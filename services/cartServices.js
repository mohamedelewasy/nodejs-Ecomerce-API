const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const Coupon = require("../models/Coupon");

let calcTotalPrice = async (cart) => {
  let total = 0;
  for (item of cart.cartItems) {
    let product = await Product.findById(item.product);
    total += product.price * item.quantity;
  }
  return total;
};

// @desc    add product to cart
// @route   POST /cart
// @access  protect/user
exports.addProduct = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;
  // get user create or create a new cart
  let cart = await Cart.findOne({ user: req.user._id });
  let product = await Product.findById(productId);
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          quantity: quantity || 1,
        },
      ],
    });
  } else {
    // if product exists in cart with the same color update cart quantity
    // else add new product to cart
    let productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );
    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += 1;
      await cart.save();
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        quantity: quantity || 1,
      });
      await cart.save();
    }
    let totalPrice = await calcTotalPrice(cart);
    return res.status(201).json({ data: cart, totalPrice: totalPrice });
  }
});

// @desc    get user cart
// @route   get /cart
// @access  protect/user
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("empty cart", 204));
  }
  return res.status(200).json({ data: cart });
});

// @desc    delete product from cart
// @route   DELETE /cart
// @access  protect/user
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.body.color) filter.color = req.body.color;
  filter.product = req.body.productId;
  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: filter,
      },
    },
    { new: true }
  );
  res.status(200).json({ data: cart });
});

// @desc    update cart product quantity
// @route   put /cart
// @access  protect/user
exports.updateProductQuantity = asyncHandler(async (req, res, next) => {
  let filter = {
    user: req.user._id,
    cartItems: { product: req.body.productId },
  };
  if (req.body.color) filter.cartItems.color = req.body.color;
  let cart = await Cart.findOneAndUpdate(
    { filter },
    {
      cartItems: req.body,
    },
    { new: true }
  );
  res.status(200).json({ data: cart });
});

// @desc    delete all product from cart
// @route   DELETE /cart/all
// @access  protect/user
exports.deleteAllProducts = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  cart.cartItems = [];
  cart.save();
  res.status(204).json({ msg: "cart empty" });
});

// @desc    apply coupon on cart
// @route   POST /cart/coupon
// @access  protect/user
exports.addCoupon = applyCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) return next(new ApiError("invalid or expired coupon", 400));
  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { coupon: coupon._id },
    { new: true }
  );
  if (!cart) return next(new ApiError("empty cart", 400));
  let totalPrice = await calcTotalPrice(cart);
  let priceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  return res.status(200).json({ data: cart, totalPrice, priceAfterDiscount });
});
