const express = require("express");
const router = express.Router();
const category = require("./categoryRoutes");
const subCategory = require("./subCategoryRoutes");
const brand = require("./brandRoutes");
const product = require("./productRoutes");
const user = require("./userRoutes");
const auth = require("./authRoutes");
const review = require("./reviewRoutes");
const withlist = require("./wishlistRoutes");
const addresses = require("./addressesRoutes");
const coupons = require("./CouponRoutes");
const cart = require("./cartRoutes");

let mainRoutes = [
  auth,
  cart,
  coupons,
  addresses,
  withlist,
  product,
  user,
  review,
  category,
  subCategory,
  brand,
];

router.get("/", (req, res) => {
  res.send("ok");
});

mainRoutes.forEach((route) => {
  router.use("", route);
});

module.exports = router;
