const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeature = require("../utils/apiFeature");
const Handler = require("./handler");

// @desc middleware that assert category in database and pass category id for next middleware
exports.getCategoryId = asyncHandler(async (req, res, next) => {
  const { categorySlug } = req.params;
  let category = await Category.findOne({ slug: categorySlug });
  if (!category)
    return next(
      new ApiError(`category not found for this slug: ${categorySlug}`, 404)
    );
  req.params.categoryId = category._id;
  next();
});

// @desc    get list of sub-category that belongs to a specific category
// @params  {categorySlug: main category slug, required}
// @route   GET /:categorySlug/subcategories
// @access  public
exports.getAllSubs = asyncHandler(async (req, res, next) => {
  const apiFeature = new ApiFeature(
    SubCategory.find({ category: req.params.categoryId }),
    req.query
  );
  apiFeature.searchByKeyword().paginate().limitFields().sort();
  let subs = await apiFeature.mongoQuery;
  res
    .status(200)
    .json({ page: apiFeature.currentPage, length: subs.length, data: subs });
});

// @desc    get specific sub-category by slug
// @params  {categorySlug: main category slug, required},
//          {slug: sub category slug, required}
// @route   GET /:categorySlug/subcategories/:slug
// @access  public
exports.getSub = asyncHandler(async (req, res, next) => {
  const { slug, categoryId } = req.params;
  const sub = await SubCategory.findOne({
    slug,
    category: categoryId,
  });
  if (!sub)
    return next(
      new ApiError(`sub category not found for this slug: ${slug}`, 404)
    );
  res.status(200).json({ data: sub });
});

// @desc    create a sub-category
// @params  {categorySlug: main category slug, required},
//          {name: name of new sub category, required}
// @route   POST /:categorySlug/subcategories
// @access  private
exports.createSub = Handler.createHandler(SubCategory);

// @desc    update specific sub-category (name, category)
// @params  {categorySlug: main category slug, required}
//          {slug: sub category slug, required}
//          {name: new sub category name}
//          {category: new sub category id}
// @route   PUT /:categorySlug/subcategories/:slug
// @access  private
exports.updateSub = Handler.updateHandler(SubCategory);

// @desc    delete specific sub-category by slug
// @params  {categorySlug: main category slug, required},
//          {slug: sub category slug, required}
// @route   DELETE /:categorySlug/subcategories/:slug
// @access  private
exports.deleteSub = Handler.deleteHandler(SubCategory);
