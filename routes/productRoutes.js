const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productServices");

const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../validator/productVal");

router
  .route("/products")
  .get(getAllProducts)
  .post(createProductValidator, createProduct);
router
  .route("/products/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
