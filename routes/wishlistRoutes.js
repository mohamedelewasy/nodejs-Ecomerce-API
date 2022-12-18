const express = require("express");
const router = express.Router();
const {
  addProductWishList,
  deleteProductWishList,
  getWishList,
} = require("../services/wishListServices");

const { protect, allowedTo } = require("../services/authServices");

router
  .route("/wishlist")
  .get(protect, allowedTo("user"), getWishList)
  .post(protect, allowedTo("user"), addProductWishList);
router
  .route("/wishlist/:id")
  .delete(protect, allowedTo("user"), deleteProductWishList);

module.exports = router;
