const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: Number,
        color: String,
      },
    ],
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("cart", CartSchema);

module.exports = CartModel;
