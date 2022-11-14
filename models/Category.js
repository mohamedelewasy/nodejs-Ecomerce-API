const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category must be required"],
      unique: [true, "category must be unique"],
      minlength: [3, "category must be at least 3 characters"],
      maxlength: [32, "category must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
