const multer = require("multer");
const sharp = require("sharp");
const Product = require("../models/Product");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeature = require("../utils/apiFeature");
const Handler = require("./handler");
const {
  uploadMultipleImages,
} = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverId = `${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/products/${imageCoverId}`);
    req.body.imageCover = imageCoverId;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, i) => {
        const imageId = `${Date.now()}-${i}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .toFile(`uploads/products/${imageId}`);
        req.body.images.push(imageId);
      })
    );
  }
  next();
});

// @desc    get list of Products
// @route   GET /products
// @access  public
exports.getAllProducts = Handler.getAllHandler(Product);

// @desc    get specific product by id
// @route   GET /product/:id
// @access  public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product)
    return next(
      new ApiError(`product not found for this id: ${req.params.id}`, 400)
    );
  res.status(200).json({ data: product });
});

// @desc    create a product
// @route   POST /product
// @access  private
exports.createProduct = Handler.createHandler(Product);

// @desc    update specific product
// @route   PUT /product/:id
// @access  private
exports.updateProduct = Handler.updateHandler(Product);

// @desc    delete specific product by id
// @route   DELETE /products/:id
// @access  public
exports.deleteProduct = Handler.deleteHandler(Product);
