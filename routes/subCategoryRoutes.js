const router = require("express").Router();
const {
  getAllSubs,
  createSub,
  getSub,
  updateSub,
  deleteSub,
  getCategoryId,
} = require("../services/subcategoryServices");
const {
  createSubValidator,
  getAllSubsValidator,
  getSubValidator,
  updateSubValidator,
  deleteSubValidator,
} = require("../validator/subCategoryVal");

const { protect, allowedTo } = require("../services/authServices");

router
  .route("/:categorySlug/subcategories")
  .get(getAllSubsValidator, getCategoryId, getAllSubs)
  .post(
    protect,
    allowedTo("admin"),
    createSubValidator,
    getCategoryId,
    createSub
  );

router
  .route("/:categorySlug/subcategories/:slug")
  .get(getSubValidator, getCategoryId, getSub)
  .put(
    protect,
    allowedTo("admin"),
    updateSubValidator,
    getCategoryId,
    updateSub
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubValidator,
    getCategoryId,
    deleteSub
  );

module.exports = router;
