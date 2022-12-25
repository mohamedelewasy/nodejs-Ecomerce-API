const Coupon = require("../models/Coupon");
const Handler = require("./handler");

// @desc    get list of coupons
// @route   GET /coupons
// @access  private/admin
exports.getAllCoupons = Handler.getAllHandler(Coupon);

// @desc    get specific coupon by id
// @route   GET /brand/:id
// @access  private/admin
exports.getCoupon = Handler.getSpecificHandler(Coupon);

// @desc    create a coupon
// @route   POST /coupon
// @access  private/admin
exports.createCoupon = Handler.createHandler(Coupon);

// @desc    update specific coupon
// @route   PUT /coupon
// @access  private/admin
exports.updateCoupon = Handler.updateHandler(Coupon);

// @desc    delete specific coupon by id
// @route   DELETE /coupon/:id
// @access  private/admin
exports.deleteCoupon = Handler.deleteHandler(Coupon);
