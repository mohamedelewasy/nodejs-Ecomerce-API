const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title must be required"],
      trim: true,
      minLength: [3, "title must be at least 3 characters"],
      maxLength: [32, "title must be at most 32 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "product description must be required"],
      minLength: [32, "too short description"],
      maxLength: [2000, "too long description"],
    },
    quantity: {
      type: Number,
      required: [true, "product number is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      minLength: [0, "wrong price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "imgae cover is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "product must be belongs to category"],
    },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [1, "minimum rating is 1"],
      max: [5, "maximum rating is 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// @desc query mongoose middleware to populate
ProductSchema.pre(/find/, function (next) {
  this.populate({ path: "category subCategory brand", select: "name" });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageURL;
  }
  if (doc.images) {
    let customImages = [];
    doc.images.map((img) => {
      customImages.push(`${process.env.BASE_URL}/products/${img}`);
    });
    doc.images = customImages;
  }
};

// populate product reviews
ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// findone findall update
ProductSchema.post("init", function (doc) {
  setImageUrl(doc);
});

// create
ProductSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
