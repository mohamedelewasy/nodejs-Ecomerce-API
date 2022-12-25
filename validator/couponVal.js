const { param, body } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getCouponValidator = [
  param("id", "missing param id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  body("name", "coupon name is required")
    .isLength({ min: 4 })
    .withMessage("ategory must be at least 4 characters")
    .isLength({ max: 16 })
    .withMessage("brand must be at most 16 characters"),
  body("expire", "expire date is required"),
  body("discount", "discount number is required"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  param("id", "missing param id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
exports.deleteCouponValidator = [
  param("id", "missing param id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
