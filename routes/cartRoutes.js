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

router.use(protect, allowedTo("user"));

router
  .route("/cart")
  .post(addProduct)
  .get(getCart)
  .put(updateProductQuantity)
  .delete(deleteProduct);

router.route("/cart/all").delete(deleteAllProducts);

router.route("/cart/coupon").post(addCoupon);

module.exports = router;
