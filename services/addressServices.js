const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    add address
// @route   POST /address
// @access  protect/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { new: true }
  );
  res.status(200).json({ msg: "address added", data: user.addresses });
});

// @desc    delete address
// @route   DELETE /address
// @access  protect/user
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } },
    { new: true }
  );
  res.status(200).json({ msg: "address removed", data: user.addresses });
});

// @desc    get user wishlist
// @route   get /wishlist
// @access  protect/user
exports.getAddresses = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);
  res.status(200).json({ data: user.addresses });
});
