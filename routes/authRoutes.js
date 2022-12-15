const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authServices");

const {
  createUserValidator,
  loginUserValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../validator/userVal");

router.route("/signup").post(createUserValidator, signup);

router.route("/login").post(loginUserValidator, login);

router.route("/forgetpassword").post(forgetPasswordValidator, forgetPassword);

router
  .route("/forgetpassword/verify")
  .post(verifyResetCodeValidator, verifyResetCode);

router
  .route("/forgetpassword/reset")
  .post(resetPasswordValidator, resetPassword);

module.exports = router;
