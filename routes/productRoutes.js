const express = require("express");
const reviewRoutes = require("./reviewRoutes");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productServices");

const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../validator/productVal");

const { protect, allowedTo } = require("../services/authServices");

router.use("/products/:productId/", reviewRoutes);

router
  .route("/products")
  .get(getAllProducts)
  .post(
    protect,
    allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/products/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
