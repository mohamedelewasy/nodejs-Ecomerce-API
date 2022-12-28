const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
        color: String,
      },
    ],
    taxPrice: Number,
    shippingPrice: Number,
    shippingAddress: String,
    totalPrice: Number,
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: Boolean,
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

OrderSchema.pre(/find/, function (next) {
  this.populate({ path: "user", select: "name" }).populate({
    path: "cartItems.product",
    select: "title",
  });
  next();
});

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
