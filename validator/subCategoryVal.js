const { param, check, validationResult } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getSubValidator = [
  param("slug")
    .notEmpty()
    .withMessage("sub category slug is required")
    .isSlug()
    .withMessage("invalid category slug format"),
  param("categorySlug")
    .notEmpty()
    .withMessage("category slug is required")
    .isSlug()
    .withMessage("invalid category slug format"),
  validatorMiddleware,
];

exports.getAllSubsValidator = [
  param("categorySlug")
    .notEmpty()
    .withMessage("category slug is required")
    .isSlug()
    .withMessage("invalid category slug format"),
  validatorMiddleware,
];

exports.createSubValidator = [
  check("name")
    .notEmpty()
    .withMessage("sub-category required")
    .isLength({ min: 2 })
    .withMessage("sub-category must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("sub-category must be at most 32 characters"),
  param("categorySlug")
    .notEmpty()
    .withMessage("category slug must be sent")
    .isSlug()
    .withMessage("invalid category slug format"),
  validatorMiddleware,
];

exports.updateSubValidator = [
  param("slug")
    .notEmpty()
    .withMessage("sub category slug is required")
    .isSlug()
    .withMessage("invalid category slug format"),
  param("categorySlug")
    .notEmpty()
    .withMessage("category slug is required")
    .isSlug()
    .withMessage("invalid category slug format"),
  validatorMiddleware,
];

exports.deleteSubValidator = [
  param("slug")
    .notEmpty()
    .withMessage("sub category slug is required")
    .isSlug()
    .withMessage("invalid category slug format"),
  param("categorySlug")
    .notEmpty()
    .withMessage("category slug is required")
    .isSlug()
    .withMessage("invalid category slug format"),
  validatorMiddleware,
];
