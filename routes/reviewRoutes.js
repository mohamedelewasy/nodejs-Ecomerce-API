const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../services/reviewServices");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../validator/reviewVal");

const { protect, allowedTo } = require("../services/authServices");

router
  .route("/reviews")
  .get(getAllReviews)
  .post(protect, allowedTo("user"), createReviewValidator, createReview);

router
  .route("/reviews/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("admin", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
