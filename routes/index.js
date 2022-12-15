const express = require("express");
const router = express.Router();
const category = require("./categoryRoutes");
const subCategory = require("./subCategoryRoutes");
const brand = require("./brandRoutes");
const product = require("./productRoutes");
const user = require("./userRoutes");
const auth = require("./authRoutes");

let mainRoutes = [auth, user, category, subCategory, brand, product];

router.get("/", (req, res) => {
  res.send("ok");
});

mainRoutes.forEach((route) => {
  router.use("", route);
});

module.exports = router;
