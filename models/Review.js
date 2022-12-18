const { Result } = require("express-validator");
const mongoose = require("mongoose");
const Product = require("./Product");
const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, "minimum rating is 1"],
      max: [5, "maximum rating is 5"],
      required: [true, "rating is required"],
    },
    body: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "review must belong to user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "review must belong to product"],
    },
  },
  { timestamps: true }
);

// @desc query mongoose middleware to populate
ReviewSchema.pre(/find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

ReviewSchema.statics.calcRating = async function (productId) {
  this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        average: { $avg: "$rating" },
        quantity: { $sum: 1 },
      },
    },
  ])
    .then(async (res) => {
      await Product.findByIdAndUpdate(
        productId,
        {
          ratingsQuantity: res[0].quantity,
          ratingAverage: res[0].average.toFixed(1),
        },
        { new: true }
      );
    })
    .catch((err) => err);
};

ReviewSchema.post("save", async function () {
  await this.constructor.calcRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calcRating(this.product);
});

const ReviewModel = mongoose.model("Review", ReviewSchema);

module.exports = ReviewModel;
