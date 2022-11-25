const Brand = require("../models/Brand");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const ApiFeature = require("../utils/apiFeature");
const Handler = require("./handler");

// @desc    get list of brands
// @route   GET /brands
// @access  public
exports.getAllBrands = Handler.getAllHandler(Brand);

// @desc    get specific brand by slug
// @route   GET /brand/:slug
// @access  public
exports.getBrand = Handler.getSpecificHandler(Brand);

// @desc    create a brand
// @route   POST /brand
// @access  private
exports.createBrand = Handler.createHandler(Brand);

// @desc    update specific brand
// @route   PUT /brand
// @access  private
exports.updateBrand = Handler.updateHandler(Brand);

// @desc    delete specific brand by slug
// @route   DELETE /brand/:slug
// @access  public
exports.deleteBrand = Handler.deleteHandler(Brand);
