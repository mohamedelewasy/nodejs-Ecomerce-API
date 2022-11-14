const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand must be required"],
      unique: [true, "brand must be unique"],
      minlength: [2, "brand must be at least 3 characters"],
      maxlength: [32, "brand must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
