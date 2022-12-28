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
const order = require("./orderRoutes");

let mainRoutes = [
  user,
  auth,
  product,
  cart,
  coupons,
  addresses,
  withlist,
  review,
  category,
  subCategory,
  brand,
  order,
];

mainRoutes.forEach((route) => {
  router.use("", route);
});

module.exports = router;
