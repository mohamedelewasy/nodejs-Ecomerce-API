const Category = require("../models/Category");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeature = require("../utils/apiFeature");
const Handler = require("./handler");

// @desc    get list of category
// @route   GET /categories
// @access  public
exports.getAllCategories = Handler.getAllHandler(Category);

// @desc    get specific category by slug
// @route   GET /categories/:slug
// @access  public
exports.getCategory = Handler.getSpecificHandler(Category);

// @desc    create a category
// @route   POST /categories
// @access  private
exports.createCategory = Handler.createHandler(Category);

// @desc    update specific category
// @route   PUT /categories
// @access  private
exports.updateCategory = Handler.updateHandler(Category);

// @desc    delete specific category by slug
// @route   DELETE /categories/:slug
// @access  public
exports.deleteCategory = Handler.deleteHandler(Category);
