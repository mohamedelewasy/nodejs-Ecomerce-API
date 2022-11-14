const router = require("express").Router();
const {
  getAllSubs,
  createSub,
  getSub,
  updateSub,
  deleteSub,
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
  .get(getAllSubsValidator, getAllSubs)
  .post(createSubValidator, createSub);

router
  .route("/:categorySlug/subcategories/:slug")
  .get(getSubValidator, getSub)
  .put(updateSubValidator, updateSub)
  .delete(deleteSubValidator, deleteSub);

module.exports = router;
