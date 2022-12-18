const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    add product to wishlist
// @route   POST /wishlist
// @access  protect/user
exports.addProductWishList = asyncHandler(async (req, res, next) => {
  if (req.params.productId) req.body.product = req.params.productId;
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: req.body.product } },
    { new: true }
  );
  res
    .status(200)
    .json({ msg: "product added to wish list", data: user.wishList });
});

// @desc    delete product from wishlist
// @route   DELETE /wishlist
// @access  protect/user
exports.deleteProductWishList = asyncHandler(async (req, res, next) => {
  if (req.params.productId) req.body.product = req.params.productId;
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishList: req.params.id } },
    { new: true }
  );
  res
    .status(200)
    .json({ msg: "product removed from wish list", data: user.wishList });
});

// @desc    get user wishlist
// @route   get /wishlist
// @access  protect/user
exports.getWishList = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id).populate("wishList");
  res.status(200).json({ data: user.wishList });
});
