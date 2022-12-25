const express = require("express");
const router = express.Router();
const {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/CouponServices");

const {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../validator/couponVal");

const { protect, allowedTo } = require("../services/authServices");

router.use(protect, allowedTo("admin"));

router
  .route("/coupons")
  .get(getAllCoupons)
  .post(createCouponValidator, createCoupon);

router
  .route("/coupons/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
