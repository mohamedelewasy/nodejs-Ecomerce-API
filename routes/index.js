const express = require("express");
const router = express.Router();
const category = require("./categoryRoutes");
const subCategory = require("./subCategoryRoutes");
const brand = require("./brandRoutes");
const product = require("./productRoutes");

router.get("/", (req, res) => {
  res.send("ok");
});

router.use("", category);
router.use("", subCategory);
router.use("", brand);
router.use("", product);

module.exports = router;
