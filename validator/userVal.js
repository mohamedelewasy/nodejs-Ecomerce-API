const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const User = require("../models/User");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name is required")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .exists()
    .withMessage("user email is required")
    .isEmail()
    .withMessage("invalid email format")
    .isLength({ min: 8 })
    .withMessage("email is too short")
    .isLength({ max: 64 })
    .withMessage("email is too long")
    .custom((val) => {
      return User.findOne({ email: val }).then((user) => {
        if (user)
          return Promise.reject(new Error("this email is already taken"));
        else return true;
      });
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("invalid mobile number"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required")
    .custom((val, { req }) => {
      if (val != req.body.password) {
        return Promise.reject(
          new Error("confirmation password is not correct")
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .exists()
    .withMessage("user email is required")
    .isEmail()
    .withMessage("invalid email format"),
  check("id").isMongoId().withMessage("invalid id format"),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("invalid mobile number"),
  validatorMiddleware,
];

exports.updateUserPasswordValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  check("oldPassword")
    .exists()
    .withMessage("old password is required")
    .custom(async (val, { req }) => {
      let user = await User.findById(req.params.id);
      if (!user) throw new Error("there is no user for this id");
      if (!(await user.comparePassword(val))) {
        return Promise.reject(new Error("old password is incorrect"));
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required")
    .custom((val, { req }) => {
      if (val != req.body.password) {
        return Promise.reject(
          new Error("confirmation password is not correct")
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.loginUserValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required for login")
    .isEmail()
    .withMessage("invalid emailformat"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),
  validatorMiddleware,
];

exports.forgetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required for login")
    .isEmail()
    .withMessage("invalid emailformat"),
  validatorMiddleware,
];

exports.verifyResetCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required for login")
    .isEmail()
    .withMessage("invalid emailformat"),
  body("verificationCode")
    .notEmpty()
    .withMessage("verification code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("verificationCode must be 6 digits"),
  validatorMiddleware,
];

exports.resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required for login")
    .isEmail()
    .withMessage("invalid emailformat"),
  body("password")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),
  validatorMiddleware,
];

exports.updateUserLoggedPasswordValidation = [
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required")
    .custom((val, { req }) => {
      if (val != req.body.password) {
        return Promise.reject(
          new Error("confirmation password is not correct")
        );
      }
      return true;
    }),
  validatorMiddleware,
];
