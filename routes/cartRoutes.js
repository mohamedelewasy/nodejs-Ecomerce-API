const express = require("express");
const router = express.Router();
const {
  addProduct,
  getCart,
  deleteProduct,
  deleteAllProducts,
  updateProductQuantity,
  addCoupon,
} = require("../services/cartServices");

// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../validator/brandVal");

const { protect, allowedTo } = require("../services/authServices");

router
  .route("/cart")
  .all(protect, allowedTo("user"))
  .post(addProduct)
  .get(getCart)
  .put(updateProductQuantity)
  .delete(deleteProduct);

router.route("/cart/all").delete(protect, allowedTo("user"), deleteAllProducts);

router.route("/cart/coupon").post(protect, allowedTo("user"), addCoupon);

module.exports = router;
