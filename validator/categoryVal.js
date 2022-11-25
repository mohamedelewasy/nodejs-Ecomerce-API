const { param, check, validationResult } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.getCategoryValidator = [
  param("slug").isSlug().withMessage("invalid category slug format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("category must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("category must be at most 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("new name is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  param("slug").isSlug().withMessage("invalid category slug format"),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  param("slug").isSlug().withMessage("invalid category slug format"),
  validatorMiddleware,
];
