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

router
  .route("/categories")
  .get(getAllCategories)
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/categories/:slug")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
