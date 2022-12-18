const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Handler = require("./handler");
const ApiFeature = require("../utils/apiFeature");

// @desc    get list of reviews
// @route   GET /reviews
// @access  public
exports.getAllReviews = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.productId) filter["product"] = req.params.productId;
  const apiFeature = new ApiFeature(Review.find(filter), req.query);
  apiFeature.searchByKeyword("product").paginate().limitFields().sort();
  let documents = await apiFeature.mongoQuery;
  res.status(200).json({
    page: apiFeature.currentPage,
    length: documents.length,
    data: documents,
  });
});

// @desc    get specific review by id
// @route   GET /reviews/:id
// @access  public
exports.getReview = Handler.getSpecificHandler(Review);

// @desc    create a review
// @route   POST /reviews
// @access  private/protect/user
exports.createReview = asyncHandler(async (req, res, next) => {
  if (req.params.productId) req.body.product = req.params.productId;
  let product = await Product.findById(req.body.product);
  if (!product)
    return next(new ApiError(`invalid product id:${req.body.product}`, 400));
  // check if user review the same product before
  let lastReviews = await Review.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (lastReviews)
    return next(new ApiError(`you cannot review twice the same product`, 400));

  req.body.user = req.user._id;
  let review = await Review.create(req.body);
  res.status(201).json(review);
});

// @desc    update specific review
// @route   PUT /reviews
// @access  private/protect/user
exports.updateReview = asyncHandler(async (req, res, next) => {
  // check if review belongs to the same user then update
  let review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );
  if (!review)
    return next(new ApiError(`you cannot update on this review`, 404));
  review.save();
  res.status(200).json({ data: review });
});

// @desc    delete specific brand by id
// @route   DELETE /reviews/:id
// @access  private/protect/user-admin
exports.deleteReview = asyncHandler(async (req, res, next) => {
  // check if review belongs to the same user then update
  const review = await Review.findById(req.params.id);
  if (!review) return next(new ApiError(`review not found for this id`, 400));
  if (
    req.user.role == "admin" ||
    review.user._id.toString() == req.user._id.toString()
  ) {
    review.delete();
    review.remove();
    res.status(200).json({ msg: "deleted successfully", data: review });
  } else
    return next(new ApiError(`you are not allowed to delete this review`, 404));
});
