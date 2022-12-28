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

router
  .route("/coupons")
  .all(protect, allowedTo("admin"))
  .get(getAllCoupons)
  .post(createCouponValidator, createCoupon);

router
  .route("/coupons/:id")
  .all(protect, allowedTo("admin"))
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
