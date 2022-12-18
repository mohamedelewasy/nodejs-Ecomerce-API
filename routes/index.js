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

let mainRoutes = [
  addresses,
  withlist,
  product,
  review,
  auth,
  user,
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
