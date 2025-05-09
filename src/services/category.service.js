import { categoryModel } from "../models/category.model.js"
import AppError from "../core/appError.js";
import * as logger from "../utility/log.js";

export const createRecord = async (object) => {
    const record = await categoryModel.create(object);
    return record;
};

export const getOnlyRecord = async (categoryId) => {
    const category = await categoryModel.findOne(categoryId);
    return category;
};

export const createCategory = async (body) => {
    if (!body.categoryName) {
        throw new AppError(400, "Category Name Required");
    }
    const object = {
        categoryName: body.categoryName,
        categoryDescription: body.categoryDescription,
        createdBy: body.userId,
        updatedBy: body.userId,
    };
    const category = await createRecord(object);
    logger.info(category);
    return category;
};

export const getAllCategories = async (query) => {
    logger.info("START:Get All Categories");

    const populateQuery = [
        { path: "createdBy", select: ["_id", "username", "accountType"] },
        { path: "updatedBy", select: ["_id", "username", "accountType"] }
    ];
    const condition = {
    };
    const category = await categoryModel
        .find(condition)
        .populate(populateQuery);
    if (category.length <= 0) throw new AppError(404, "Category Not Found");
    return category;
};

export const getOnlyOneCategory = async (categoryId) => {
    logger.info("START:Get only Category");
    const populateQuery = [
        { path: "createdBy", select: ["_id", "username", "accountType"] },
        { path: "updatedBy", select: ["_id", "username", "accountType"] }
    ];
    const category = await categoryModel.findOne({ _id: categoryId }).populate(populateQuery);;
    return category;
};

export const updateCategory = async (categoryId, body) => {
    logger.info("START:Updating Category");
    const record = await categoryModel.findOneAndUpdate(
        { _id: categoryId },
        { ...body },
        { new: true }
    );
    return record;
};

export const deleteCategory = async (categoryId) => {
    logger.info("START:Deleting the Category");
    const update = await categoryModel.findOneAndDelete({ _id: categoryId });
    if (!update) throw new AppError(404, "Category not found in collection");
    return true;
};
