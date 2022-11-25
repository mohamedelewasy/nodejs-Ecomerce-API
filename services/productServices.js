const Product = require("../models/Product");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeature = require("../utils/apiFeature");
const Handler = require("./handler");

// @desc    get list of Products
// @route   GET /products
// @access  public
exports.getAllProducts = Handler.getAllHandler(Product);

// @desc    get specific product by id
// @route   GET /product/:id
// @access  public
exports.getProduct = Handler.getSpecificHandler(Product);

// @desc    create a product
// @route   POST /product
// @access  private
exports.createProduct = Handler.createHandler(Product);

// @desc    update specific product
// @route   PUT /product/:id
// @access  private
exports.updateProduct = Handler.updateHandler(Product);

// @desc    delete specific product by id
// @route   DELETE /products/:id
// @access  public
exports.deleteProduct = Handler.deleteHandler(Product);
