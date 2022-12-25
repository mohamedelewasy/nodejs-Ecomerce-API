const mongoose = require("mongoose");
const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "coupon name must be required"],
      unique: [true, "coupon name must be unique"],
      minlength: [4, "brand must be at least 4 characters"],
      maxlength: [16, "brand must be at most 16 characters"],
    },
    expire: {
      type: Date,
      required: [true, "coupon expire time is required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount is required"],
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.model("Coupon", CouponSchema);

module.exports = CouponModel;
