const { param, check, validationResult } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  param("slug").isSlug().withMessage("invalid category slug format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("ategory must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("category must be at most 32 characters"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  param("slug").isSlug().withMessage("invalid category slug format"),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  param("slug").isSlug().withMessage("invalid category slug format"),
  validatorMiddleware,
];
