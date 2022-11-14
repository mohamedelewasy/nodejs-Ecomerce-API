const Brand = require("../models/Brand");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");

// @desc    get list of brands
// @route   GET /brands
// @access  public
exports.getAllBrands = asyncHandler(async (req, res) => {
  let page = req.query.page || 1;
  let limit = 5;
  let skip = (page - 1) * limit;
  let brand = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ page, length: brand.length, data: brand });
});

// @desc    get specific brand by slug
// @route   GET /brand/:slug
// @access  public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const brand = await Brand.findOne({ slug });
  if (!brand)
    return next(new ApiError(`brand not found for this slug: ${slug}`, 404));
  res.status(200).json({ data: brand });
});

// @desc    create a brand
// @route   POST /brand
// @access  private
exports.createBrand = asyncHandler(async (req, res) => {
  let brand = await Brand.create({
    name: req.body.name,
    slug: slugify(req.body.name),
  });
  res.status(201).json(brand);
});

// @desc    update specific brand
// @route   PUT /brand
// @access  private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  let { slug } = req.params;
  let brand = await Brand.findOneAndUpdate(
    { slug },
    {
      name: req.body.name,
      slug: slugify(req.body.name),
    },
    { new: true }
  );
  if (!brand)
    return next(new ApiError(`brand not found for this slug: ${slug}`, 404));
  res.status(200).json({ data: brand });
});

// @desc    delete specific brand by slug
// @route   DELETE /brand/:slug
// @access  public
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const brand = await Brand.findOneAndDelete({ slug });
  if (!brand)
    return next(new ApiError(`brand not found for this slug: ${slug}`, 404));
  res.status(200).json({ msg: "deleted successfully", data: brand });
});
