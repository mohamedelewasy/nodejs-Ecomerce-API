const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const sharp = require("sharp");
const Category = require("../models/Category");
const ApiError = require("../errors/apiError");
const ApiFeature = require("../utils/apiFeature");
const Handler = require("./handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// const storage = multer.memoryStorage();
// const fileFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) cb(null, true);
//   else cb(new ApiError("only image allowed", 400));
// };
// const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadCategoryImage = uploadSingleImage();
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageId = `${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/categories/${imageId}`);
    req.body.image = imageId;
  }
  next();
});

// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const imageId = `${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(600, 600)
//     .toFormat("jpeg")
//     .toFile(`uploads/categories/${imageId}`);
//   req.body.image = imageId;
//   next();
// });

// @desc    get list of category
// @route   GET /categories
// @access  public
exports.getAllCategories = Handler.getAllHandler(Category);

// @desc    get specific category by slug
// @route   GET /categories/:slug
// @access  public
exports.getCategory = Handler.getSpecificHandler(Category);

// @desc    create a category
// @route   POST /categories
// @access  private
exports.createCategory = Handler.createHandler(Category);

// @desc    update specific category
// @route   PUT /categories
// @access  private
exports.updateCategory = Handler.updateHandler(Category);

// @desc    delete specific category by slug
// @route   DELETE /categories/:slug
// @access  public
exports.deleteCategory = Handler.deleteHandler(Category);
