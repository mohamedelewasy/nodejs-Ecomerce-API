const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiError = require("../errors/apiError");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @desc    signup user
// @route   POST /signup
// @access  public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(201).json({ data: user, token });
});

// @desc    login user
// @route   POST /login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(`incorrect email or password`, 401));
  }
  if (await user.comparePassword(password)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return res.status(200).json({ data: user, token });
  }
  return next(new ApiError(`incorrect email or password`, 401));
});

// @desc    check authentications
// @route   middleware
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.slice(7)
      : undefined;
  }
  if (!token)
    return next(new ApiError("you have no access to this route", 401));

  // verify token
  let verifiedData = jwt.verify(token, process.env.JWT_SECRET);

  // check user last updates
  const user = await User.findById(verifiedData.userId);
  if (!user) return next(new ApiError("no user exists for this id", 401));
  if (parseInt(user.updatedAt.getTime() / 1000) > verifiedData.iat)
    return next(new ApiError("please login again", 401));
  req.user = user;
  next();
});

// @desc    check authorizations
// @route   middleware
exports.allowedTo = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you have no permissions to access this route", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // generate verification code
  const randomCode = Math.floor(111111 + Math.random() * 888888).toString();
  let randomCodeCrypted = await bcrypt.hash(
    randomCode,
    await bcrypt.genSalt(1)
  );
  // put crypted code in user db
  let user = await User.findOneAndUpdate(
    { email: req.body.email },
    { verificationCode: randomCodeCrypted }
  );
  if (!user)
    return next(
      new ApiError(`no user exists for this email:${req.body.email}`, 400)
    );
  // send email
  try {
    await sendEmail({
      email: user.email,
      subject: "password reset code",
      message: `Hello ${user.name}, 
      we recieved a request to reset your password. CODE:${randomCode}.`,
    });
    console.log(randomCode);
  } catch (error) {
    return next(new ApiError("cannot send email", 400));
  }
  res.status(200).json({ msg: "reset code sent successfully" });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`no user exists for this email:${req.body.email}`, 400)
    );
  if (
    user.updatedAt.getTime() +
      parseInt(process.env.VERIFICATION_EXPIRE) * 60 * 1000 <
      Date.now() ||
    !(await bcrypt.compare(req.body.verificationCode, user.verificationCode))
  )
    return next(new ApiError("reset code is invalid or expired", 400));
  user.resetPasswordVerified = true;
  user.save();
  console.log("reset code verified");
  res.status(200).json({ msg: "code verified successfully" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (
    !user.resetPasswordVerified &&
    !user.updatedAt.getTime() +
      (process.env.VERIFICATION_EXPIRE + 10) * 60 * 1000 >
      Date.now()
  ) {
    return next(new ApiError("reset code is invalid or expired", 400));
  }
  let newPassword = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );
  let newUser = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      password: newPassword,
      resetPasswordVerified: false,
      verificationCode: false,
    },
    { new: true }
  );
  return res.status(200).json({ msg: "password updated successfully" });
});
