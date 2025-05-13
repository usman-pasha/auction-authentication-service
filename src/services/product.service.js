import { productModel } from "../models/product.model.js";
import * as categoryService from "./category.service.js"
import AppError from "../core/appError.js";
import * as logger from "../utility/log.js";
import mongoose from "mongoose";

// Create Product Record
export const createRecord = async (object) => {
    const record = await productModel.create(object);
    return record;
};

// Get Product by ID
export const getOnlyRecord = async (productId) => {
    const product = await productModel.findOne({ _id: productId });
    return product;
};

// Create Product with validation
export const createProduct = async (body) => {
    if (!body.title || !body.description || !body.condition) {
        throw new AppError(400, "Missing required fields for product creation");
    }

    // if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3) {
    //     throw new AppError(400, "Title is required and must be at least 3 characters long.");
    // }

    // if (!data.description || typeof data.description !== "string" || data.description.trim().length < 10) {
    //     throw new AppError(400, "Description is required and must be at least 10 characters long.");
    // }

    // if (!data.categoryId || !mongoose.Types.ObjectId.isValid(data.categoryId)) {
    //     throw new AppError(400, "A valid Category ID is required.");
    // }

    if (body.categoryId) {
        body.categoryId = new mongoose.Types.ObjectId(body.categoryId);
        const category = await categoryService.getOnlyRecord({ _id: body.categoryId });
        if (!category) delete body.categoryId;
    }
    const object = {
        title: body.title,
        description: body.description,
        categoryId: body.categoryId,
        auctioneerId: body.userId,
        condition: body.condition,
        images: body.images || [],
        status: body.status || "listed",
        createdBy: body.userId,
        updatedBy: body.userId,
    };

    const product = await createRecord(object);
    logger.info("Product Created:", product);
    return product;
};

// Get All Products
export const getAllProducts = async () => {
    logger.info("START:Get All Products");

    const populateQuery = [
        { path: "categoryId", select: ["_id", "categoryName"] },
        { path: "auctioneerId", select: ["_id", "username", "accountType"] },
        { path: "createdBy", select: ["_id", "username"] },
        { path: "updatedBy", select: ["_id", "username"] }
    ];

    const products = await productModel.find({}).populate(populateQuery);
    if (products.length <= 0) throw new AppError(404, "No products found");
    return products;
};

// Get One Product by ID
export const getOnlyOneProduct = async (productId) => {
    logger.info("START:Get only Product");

    const populateQuery = [
        { path: "categoryId", select: ["_id", "categoryName"] },
        { path: "auctioneerId", select: ["_id", "username", "accountType"] },
        { path: "createdBy", select: ["_id", "username"] },
        { path: "updatedBy", select: ["_id", "username"] }
    ];

    const product = await productModel.findOne({ _id: productId }).populate(populateQuery);
    if (!product) throw new AppError(404, "Product not found");
    return product;
};

// Update Product
export const updateProduct = async (productId, body) => {
    logger.info("START:Updating Product");
    const record = await productModel.findOneAndUpdate(
        { _id: productId },
        { ...body },
        { new: true }
    );
    if (!record) throw new AppError(404, "Product not found for update");
    return record;
};

// Delete Product
export const deleteProduct = async (productId) => {
    logger.info("START:Deleting the Product");
    const deleted = await productModel.findOneAndDelete({ _id: productId });
    if (!deleted) throw new AppError(404, "Product not found");
    return true;
};

