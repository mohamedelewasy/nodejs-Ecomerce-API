// CRUD OP
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Handler = require("./handler");
const User = require("../models/User");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadUserImage = uploadSingleImage("profileImage");
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageId = `${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/users/${imageId}`);
    req.body.profileImage = imageId;
  }
  next();
});

// @desc    get list of users
// @route   GET /users
// @access  admin
exports.getAllUsers = Handler.getAllHandler(User);

// @desc    get specific user by id
// @route   GET /user/:id
// @access  admin, user
exports.getUser = Handler.getSpecificHandler(User);

// @desc    create a user
// @route   POST /user
// @access  public
exports.createUser = Handler.createHandler(User);

// @desc    update specific user
// @route   PUT /user
// @access  admin, user
exports.updateUser = asyncHandler(async (req, res, next) => {
  if (req.body.password) delete req.body.password;
  let user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });
  if (!user)
    return next(
      new ApiError(`user not found for this id: ${req.params.id}`, 404)
    );
  res.status(200).json({ data: user });
});

// @desc    update specific user password
// @route   PUT /user
// @access  admin, user
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);
  let user = await User.findByIdAndUpdate(
    req.params.id,
    { password },
    {
      new: true,
    }
  );
  if (!user)
    return next(
      new ApiError(`user not found for this id: ${req.params.id}`, 404)
    );
  res.status(200).json({ data: user });
});

// @desc    delete specific user by id
// @route   DELETE /user/:id
// @access  admin
exports.deleteUser = Handler.deleteHandler(User);

// @desc    deactivate user
// @route   get users/:id/deactive
// @access  private/admin
exports.deactivateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );
  res.status(200).json({ data: user });
});

// @desc    get current user by id
// @route   GET /user/me
// @access  private/protect
exports.getUserLoggedData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    update current user password
// @route   put /user/me/updatepassword
// @access  private/protect
exports.updateUserLoggedPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)),
    },
    {
      new: true,
    }
  );
  if (!user)
    return next(
      new ApiError(`user not found for this id: ${req.params.id}`, 404)
    );
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(200).json({ data: user, token });
});

// @desc    update logged user data
// @route   PUT users/me/update
// @access  private/protect
exports.updateUserLoggedData = asyncHandler(async (req, res, next) => {
  if (req.body.password) delete req.body.password;
  let user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  if (!user)
    return next(
      new ApiError(`user not found for this id: ${req.params.id}`, 404)
    );
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(200).json({ data: user, token });
});

// @desc    deactivate user data
// @route   get users/me/deactive
// @access  private/protect
exports.deactivateUserLoggedData = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    { new: true }
  );
  res.status(200).json({ msg: "user deactivated successfully" });
});
