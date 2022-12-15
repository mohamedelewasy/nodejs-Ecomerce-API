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

const { protect, allowedTo } = require("../services/authServices");

router
  .route("/brands")
  .get(getAllBrands)
  .post(
    protect,
    allowedTo("admin"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/brands/:slug")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTo("admin"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
