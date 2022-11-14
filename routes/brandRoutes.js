const express = require("express");
const router = express.Router();
const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandServices");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validator/brandVal");

router
  .route("/brands")
  .get(getAllBrands)
  .post(createBrandValidator, createBrand);

router
  .route("/brands/:slug")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
