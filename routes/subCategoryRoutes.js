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

router
  .route("/:categorySlug/subcategories")
  .get(getAllSubsValidator, getCategoryId, getAllSubs)
  .post(createSubValidator, getCategoryId, createSub);

router
  .route("/:categorySlug/subcategories/:slug")
  .get(getSubValidator, getCategoryId, getSub)
  .put(updateSubValidator, getCategoryId, updateSub)
  .delete(deleteSubValidator, getCategoryId, deleteSub);

module.exports = router;
