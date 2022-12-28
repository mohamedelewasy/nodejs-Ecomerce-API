const asyncHandler = require("express-async-handler");
const handler = require("../services/handler");
const ApiError = require("../errors/apiError");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");

const getCartTotalPrice = async (cart) => {
  let cartTotalPrice = 0;
  for (item of cart.cartItems) {
    let product = await Product.findById(item.product);
    cartTotalPrice += product.price * item.quantity;
  }
  let coupon = await Coupon.findById(cart.coupon);
  if (coupon && coupon.expire <= Date.now()) {
    return next(new ApiError("coupon is invalid or expired", 400));
  }
  if (coupon)
    cartTotalPrice = (
      cartTotalPrice -
      (cartTotalPrice * coupon.discount) / 100
    ).toFixed(2);
  return cartTotalPrice;
};

const editProductsQuantity = async (cart, order) => {
  const bulkOption = order.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOption, {});
  cart.cartItems = [];
  cart.coupon = null;
  await cart.save();
};

// @desc    create cash order
// @route   POST /order/cartId
// @access  protect/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  if (!cart) return next(new ApiError("cannot fint card for this id", 400));
  let cartTotalPrice = await getCartTotalPrice(cart);

  let order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalPrice: cartTotalPrice,
    isPaid: false,
  });

  editProductsQuantity(cart, order);

  return res.status(200).json({ data: order, cartTotalPrice });
});

// @desc    get list of orders
// @route   GET /orders/me
// @access  protect/user
exports.getLoggedUserOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) return next(new ApiError("cannot find order for this user"));
  return res.status(200).json({ data: order });
});

// @desc    get list of orders
// @route   GET /orders
// @access  protect/admin
exports.getAllOrders = handler.getAllHandler(Order);

// @desc    get specific order
// @route   GET /orders/:id
// @access  protect/admin
exports.getOrder = handler.getSpecificHandler(Order);

// @desc    update order statue
// @route   PUT /orders/:id
// @access  protect/admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  if (req.body.isPaid) req.body.paidAt = Date.now();
  if (req.body.isDelivered) req.body.deliveredAt = Date.now();
  let order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!order) return next(new ApiError("cannot find order for this id"));
  res.status(200).json({ data: order });
});
