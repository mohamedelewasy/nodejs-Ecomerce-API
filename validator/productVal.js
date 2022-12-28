const { param, check, validationResult } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Brand = require("../models/Brand");
const { default: slugify } = require("slugify");

const validateCategory = (value) => {
  return Category.findOne({ _id: value })
    .then((category) => {
      if (!category)
        return Promise.reject(
          new Error(`category not found for this id: ${value}`)
        );
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

const validateSubCategory = (values, { req }) => {
  return SubCategory.find({
    _id: { $in: values },
    category: req.body.category,
  })
    .then((subs) => {
      if (!subs || subs.length < values.length)
        return Promise.reject(new Error(`invalid sub category`));
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

const validateBrand = (value, { req }) => {
  return Brand.findOne({ _id: value })
    .then((brand) => {
      if (!brand)
        return Promise.reject(
          new Error(`brand not found for this id: ${value}`)
        );
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title is required")
    .isLength({ min: 3 })
    .withMessage("title must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("title must be at most 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ min: 32 })
    .withMessage("description is too short")
    .isLength({ max: 2000 })
    .withMessage("description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("product number is required")
    .isNumeric()
    .withMessage("quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isFloat({ min: 1 })
    .withMessage("price must be a number greater than 0")
    .toFloat(),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("price after descount must be a number")
    .toFloat()
    .custom((val, { req }) => {
      if (req.body.price <= val)
        throw new Error("price after discount must be lower than the price");
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be array of colors"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be array of images"),
  check("imageCover").notEmpty().withMessage("image cover is required"),
  check("category")
    .notEmpty()
    .withMessage("product category is required")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(validateCategory),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("invalid sub-category id format")
    .custom(validateSubCategory),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("invalid brand id format")
    .custom(validateBrand),
  check("ratingAverage")
    .optional()
    .isNumeric({ min: 0, max: 5 })
    .withMessage("rating average must be a number in range (1-5)"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratings quantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
