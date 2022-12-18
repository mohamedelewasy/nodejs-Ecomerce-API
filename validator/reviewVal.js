const { param, body, oneOf } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("review id is required")
    .isMongoId()
    .withMessage("invalid id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  body("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isNumeric({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  body("body")
    .optional()
    .isLength({ min: 3, max: 225 })
    .withMessage("invalid comment"),
  oneOf([
    body("product").isMongoId().withMessage("invalid product id format"),
    param("productId").isMongoId().withMessage("invalid product id format"),
  ]),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("review id is required")
    .isMongoId()
    .withMessage("invalid id format"),
  body("reating")
    .optional()
    .notEmpty()
    .withMessage("rating is required")
    .isNumeric({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  body("body")
    .optional()
    .optional()
    .isLength({ min: 3, max: 225 })
    .withMessage("invalid comment"),
  body("user").optional().isMongoId().withMessage("invalid user id format"),
  body("product")
    .optional()
    .isMongoId()
    .withMessage("invalid product id format"),
  validatorMiddleware,
];
exports.deleteReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("review id is required")
    .isSlug()
    .withMessage("invalid brand slug format"),
  validatorMiddleware,
];
