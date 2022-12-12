const express = require("express");
const router = express.Router();
const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
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
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand);

router
  .route("/brands/:slug")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
