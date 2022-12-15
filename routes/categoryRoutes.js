const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  createCategory,
  uploadCategoryImage,
  updateCategory,
  deleteCategory,
  resizeCategoryImage,
} = require("../services/categoryServices");

const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require("../validator/categoryVal");

const { protect, allowedTo } = require("../services/authServices");

router
  .route("/categories")
  .get(getAllCategories)
  .post(
    protect,
    allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/categories/:slug")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

module.exports = router;
