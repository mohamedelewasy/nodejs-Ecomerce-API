const asyncHandler = require("express-async-handler");
const ApiError = require("../errors/apiError");
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ApiFeature = require("../utils/apiFeature");

exports.getAllHandler = (model) =>
  asyncHandler(async (req, res) => {
    const apiFeature = new ApiFeature(model.find(), req.query);
    apiFeature
      .searchByKeyword(model === Product ? "product" : "")
      .paginate()
      .limitFields()
      .sort();
    let documents = await apiFeature.mongoQuery;
    res.status(200).json({
      page: apiFeature.currentPage,
      length: documents.length,
      data: documents,
    });
  });

exports.getSpecificHandler = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id, slug } = req.params;
    const document = await model.findOne(
      model === Product || model === User ? { _id: id } : { slug }
    );
    if (!document)
      return next(
        new ApiError(`document not found for this slug: ${slug}`, 404)
      );
    res.status(200).json({ data: document });
  });

exports.createHandler = (model) =>
  asyncHandler(async (req, res) => {
    if (model === SubCategory) req.body.category = req.params.categoryId;
    let document = await model.create(req.body);
    res.status(201).json(document);
  });

exports.deleteHandler = (model) =>
  asyncHandler(async (req, res, next) => {
    let { slug, categoryId } = req.params;
    let findBy = { slug };
    if (model === SubCategory) findBy["category"] = categoryId;
    const document = await model.findOneAndDelete(findBy);
    if (!document)
      return next(
        new ApiError(`document not found for this slug: ${slug}`, 204)
      );
    res.status(200).json({ msg: "deleted successfully", data: document });
  });

exports.updateHandler = (model, args = null) =>
  asyncHandler(async (req, res, next) => {
    let { id, slug, categoryId } = req.params;
    let findBy = {};
    if (model === Product || model === User) findBy["_id"] = id;
    else if (model === SubCategory) {
      findBy["slug"] = slug;
      findBy["category"] = categoryId;
    } else findBy["slug"] = slug;

    let document = await model.findOneAndUpdate(findBy, req.body, {
      new: true,
    });
    if (!document)
      return next(
        new ApiError(
          `document not found for this slug: ${req.params.slug}`,
          404
        )
      );
    res.status(200).json({ data: document });
  });
