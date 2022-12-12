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

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
};

// findone findall update
BrandSchema.post("init", function (doc) {
  setImageUrl(doc);
});

// create
BrandSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
