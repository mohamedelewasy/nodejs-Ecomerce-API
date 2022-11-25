const { param, check, validationResult } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.getBrandValidator = [
  param("slug")
    .notEmpty()
    .withMessage("brand slug is required")
    .isSlug()
    .withMessage("invalid brand slug format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("new name is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("name")
    .notEmpty()
    .withMessage("brand required")
    .isLength({ min: 2 })
    .withMessage("ategory must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("brand must be at most 32 characters"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("new name is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  param("slug")
    .notEmpty()
    .withMessage("brand slug is required")
    .isSlug()
    .withMessage("invalid brand slug format"),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  param("slug")
    .notEmpty()
    .withMessage("brand slug is required")
    .isSlug()
    .withMessage("invalid brand slug format"),
  validatorMiddleware,
];
