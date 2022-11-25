const mongoose = require("mongoose");
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "sub-category must be required"],
      trim: true,
      unique: [true, "sub-category must be unique"],
      minlength: [2, "sub-category must be at least 2 characters"],
      maxlength: [32, "sub-category must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "sub-category must be belong to category"],
    },
  },
  { timestamps: true }
);

// @desc query mongoose middleware to populate
SubCategorySchema.pre(/find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next();
});

const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategoryModel;
