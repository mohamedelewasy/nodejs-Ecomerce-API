const Category = require("../models/Category");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");

// @desc    get list of category
// @route   GET /categories
// @access  public
exports.getAllCategories = asyncHandler(async (req, res) => {
  let page = req.query.page || 1;
  let limit = 5;
  let skip = (page - 1) * limit;
  let categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ page, length: categories.length, data: categories });
});

// @desc    get specific category by slug
// @route   GET /categories/:slug
// @access  public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  if (!category)
    return next(new ApiError(`category not found for this slug: ${slug}`, 404));
  res.status(200).json({ data: category });
});

// @desc    create a category
// @route   POST /categories
// @access  private
exports.createCategory = asyncHandler(async (req, res) => {
  let category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
  });
  res.status(201).json(category);
});

// @desc    update specific category
// @route   PUT /categories
// @access  private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let { slug } = req.params;
  let category = await Category.findOneAndUpdate(
    { slug },
    {
      name: req.body.name,
      slug: slugify(req.body.name),
    },
    { new: true }
  );
  if (!category)
    return next(new ApiError(`category not found for this slug: ${slug}`, 404));
  res.status(200).json({ data: category });
});

// @desc    delete specific category by slug
// @route   DELETE /categories/:slug
// @access  public
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const category = await Category.findOneAndDelete({ slug });
  if (!category)
    return next(new ApiError(`category not found for this slug: ${slug}`, 404));
  res.status(200).json({ msg: "deleted successfully", data: category });
});
