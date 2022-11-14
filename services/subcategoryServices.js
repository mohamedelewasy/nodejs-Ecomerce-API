const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");

// @desc    get list of sub-category that belongs to a specific category
// @params  {categorySlug: main category slug, required}
// @route   GET /:categorySlug/subcategories
// @access  public
exports.getAllSubs = asyncHandler(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = 5;
  let skip = (page - 1) * limit;
  let { categorySlug } = req.params;
  let category = await Category.findOne({ slug: categorySlug });
  if (!category)
    return next(
      new ApiError(`category not found for this slug: ${categorySlug}`, 404)
    );
  let subs = await SubCategory.find({ category: category._id })
    .skip(skip)
    .limit(limit);
  res.status(200).json({ page: page, length: subs.length, data: subs });
});

// @desc    get specific sub-category by slug
// @params  {categorySlug: main category slug, required},
//          {slug: sub category slug, required}
// @route   GET /:categorySlug/subcategories/:slug
// @access  public
exports.getSub = asyncHandler(async (req, res, next) => {
  const { slug, categorySlug } = req.params;
  let category = await Category.findOne({ slug: categorySlug });
  if (!category)
    return next(
      new ApiError(`category not found for this slug: ${categorySlug}`, 404)
    );
  const sub = await SubCategory.findOne({
    slug,
    category: category._id,
  })
    // .select("name -_id")
    .populate({ path: "category", select: "name" });
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
exports.createSub = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;
  let category = await Category.findOne({ slug: categorySlug });
  if (!category)
    return next(
      new ApiError(`category not found for this slug: ${categorySlug}`, 404)
    );
  let sub = await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    category: category._id,
  });
  res.status(201).json(sub);
});

// @desc    update specific sub-category (name, category)
// @params  {categorySlug: main category slug, required}
//          {slug: sub category slug, required}
//          {name: new sub category name}
//          {category: new sub category id}
// @route   PUT /:categorySlug/subcategories/:slug
// @access  private
exports.updateSub = asyncHandler(async (req, res, next) => {
  const { categorySlug } = req.params;
  let category = await Category.findOne({ slug: categorySlug });
  if (!category)
    return next(
      new ApiError(`category not found for this slug: ${categorySlug}`, 404)
    );
  let { slug } = req.params;
  let sub = await SubCategory.findOneAndUpdate(
    { slug, category: category._id },
    {
      name: req.body.name,
      slug: slugify(req.body.name),
      category: req.body.category,
    },
    { new: true }
  );
  if (!sub)
    return next(new ApiError(`sub not found for this slug: ${slug}`, 404));
  res.status(200).json({ data: sub });
});

// @desc    delete specific sub-category by slug
// @params  {categorySlug: main category slug, required},
//          {slug: sub category slug, required}
// @route   DELETE /:categorySlug/subcategories/:slug
// @access  private
exports.deleteSub = asyncHandler(async (req, res, next) => {
  const { categorySlug } = req.params;
  let category = await Category.findOne({ slug: categorySlug });
  if (!category)
    return next(
      new ApiError(`category not found for this slug: ${categorySlug}`, 404)
    );
  const { slug } = req.params;
  const sub = await Category.findOneAndDelete({ slug, category: category._id });
  if (!sub)
    return next(new ApiError(`category not found for this slug: ${slug}`, 404));
  res.status(200).json({ msg: "deleted successfully", data: sub });
});
