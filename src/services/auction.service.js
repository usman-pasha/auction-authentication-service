import AppError from "../core/appError.js";
import { auctionModel } from "../models/auction.model.js"
import { categoryModel } from "../models/category.model.js"
import * as logger from "../utility/log.js";
import mongoose from "mongoose";
// import { Schema } from "mongoose"
// const ObjectId = Schema.Types.ObjectId
import { config } from "../config/index.js";
import { getMethod } from "../utility/commonApi.js"

export const createRecord = async (object) => {
    const record = await auctionModel.create(object);
    return record;
};

export const findOnlyOneRecord = async (condition, populateQuery, select) => {
    const record = await auctionModel.findOne(condition)
        .populate(populateQuery)
        .select(select);
    return record;
};

export const findAllRecords = async (condition, populateQuery, select) => {
    const record = await auctionModel.find(condition)
        .populate(populateQuery)
        .select(select);
    return record;
};

export const updateRecord = async (condition, body) => {
    const option = { new: true }
    const record = await auctionModel.findOneAndUpdate(condition, body, option)
    return record;
};

export const deleteRecord = async (condition) => {
    const record = await auctionModel.findOneAndDelete(condition)
    return record;
};

const parseCustomDateFormat = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
};


// validation.js
export const validateAuctionData = (data) => {

    if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3) {
        throw new AppError(400, "Title is required and must be at least 3 characters long.");
    }

    if (!data.description || typeof data.description !== "string" || data.description.trim().length < 10) {
        throw new AppError(400, "Description is required and must be at least 10 characters long.");
    }

    if (!data.categoryId || !mongoose.Types.ObjectId.isValid(data.categoryId)) {
        throw new AppError(400, "A valid Category ID is required.");
    }

    if (!data.startTime || !data.endTime) {
        throw new AppError(400, "Start time and end time are required.");
    }

    // Parse the custom date format
    // const startTime = parseCustomDateFormat(data.startTime);
    // const endTime = parseCustomDateFormat(data.endTime);

    // if (isNaN(startTime) || isNaN(endTime)) {
    //     throw new AppError(400, "Invalid date format. Use 'DD/MM/YYYY HH:mm:ss'.");
    // }

    // if (startTime <= now) {
    //     throw new AppError(400, "Start time must be in the future.");
    // }

    // if (endTime <= startTime) {
    //     throw new AppError(400, "End time must be after start time.");
    // }
    const startTime = parseCustomDateFormat(data.startTime);
    console.log("STT", startTime);
    const endTime = parseCustomDateFormat(data.endTime);
    console.log("ETTT", endTime);
    if (data.startTime) {
        if (isNaN(startTime)) {
            throw new AppError(400, "Invalid date format. Use 'DD/MM/YYYY HH:mm:ss'.");
        }
        if (startTime <= new Date()) {
            throw new AppError(400, "Start time must be in the future.");
        }
    }
    // Validate and update endTime
    if (data.endTime) {
        if (isNaN(endTime)) {
            throw new AppError(400, "Invalid date format. Use 'DD/MM/YYYY HH:mm:ss'.");
        }
        if (startTime && endTime <= startTime) {
            throw new AppError(400, "End time must be after start time.");
        }
    }

    if (!data.startPrice || typeof data.startPrice !== "number" || data.startPrice <= 0) {
        throw new AppError(400, "Start price is required and must be a positive number.");
    }

    if (!data.reservePrice || typeof data.reservePrice !== "number" || data.reservePrice <= 0) {
        throw new AppError(400, "Reserve price is required and must be a positive number.");
    }

    if (data.startPrice >= data.reservePrice) {
        throw new AppError(400, "Start price must be less than reserve price.");
    }
};

// create placed 
export const createAuctionProduct = async (body) => {
    try {
        logger.info(`creting the auction product`);
        validateAuctionData(body);
        const startTime = parseCustomDateFormat(body.startTime);
        const endTime = parseCustomDateFormat(body.endTime);
        if (body.categoryId) {
            // implement the category api 
            body.categoryId = new mongoose.Types.ObjectId(body.categoryId);
            // body.categoryId = ObjectId(body.categoryId);
            // const categoryResponse = await getMethod(
            //     `${config.CATEGORY_API}/user/getForAuthentication?id=${body.categoryId}`
            // );
            const category = await categoryModel.findOne({ _id: body.categoryId });
            if (!category) delete body.categoryId;
        }
        const payload = {
            title: body.title,
            description: body.description,
            categoryId: body.categoryId,
            auctioneerId: body.userId,
            startTime: startTime,
            endTime: endTime,
            startPrice: body.startPrice,
            reservePrice: body.reservePrice,
            // image:body.image,
            createdBy: body.userId,
            updatedBy: body.userId,
        }
        const craetedAuctionProduct = await createRecord(payload);
        const populateQuery = [
            { path: "auctioneerId", select: ["_id", "username", "accountType"] },
            {
                path: "categoryId", select: ["_id", "username", "categoryName", "status",],
                populate: {
                    path: "createdBy",
                    select: ["_id", "username"]
                }
            },
            { path: "createdBy", select: ["_id", "username"] },
            { path: "updatedBy", select: ["_id", "username"] },
        ]
        const selectQuery = "-bidIds -highestBid -createdAt -updatedAt -__v ";
        const record = await findOnlyOneRecord({ _id: craetedAuctionProduct._id }, populateQuery, selectQuery)
        return record
    } catch (error) {
        throw new AppError(400, error.message)
    }
}

export const getAllAuctionProducts = async (query) => {
    const populateQuery = [
        { path: "auctioneerId", select: ["_id", "username", "accountType"] },
        {
            path: "categoryId", select: ["_id", "username", "categoryName", "status",],
            populate: {
                path: "createdBy",
                select: ["_id", "username"]
            }
        },
        { path: "createdBy", select: ["_id", "username"] },
        { path: "updatedBy", select: ["_id", "username"] },
    ]
    const selectQuery = "-bidIds -highestBid -createdAt -updatedAt -__v ";
    const record = await findAllRecords(query, populateQuery, selectQuery)
    return record
}

export const getOneAuctionProduct = async (auctionProductId) => {
    logger.info(`Auctioneer Single Product Started`)
    if (!mongoose.Types.ObjectId.isValid(auctionProductId)) {
        throw new AppError(400, "Invalid auction product Id.");
    }
    const condition = { _id: auctionProductId }
    const populateQuery = [
        { path: "auctioneerId", select: ["_id", "username", "accountType"] },
        {
            path: "categoryId", select: ["_id", "username", "categoryName", "status",],
            populate: {
                path: "createdBy",
                select: ["_id", "username"]
            }
        },
        { path: "createdBy", select: ["_id", "username"] },
        { path: "updatedBy", select: ["_id", "username"] },
    ]
    const selectQuery = "-bidIds -highestBid -createdAt -updatedAt -__v ";
    const record = await findOnlyOneRecord(condition, populateQuery, selectQuery)
    return record
}

export const updateAuctionProduct = async (auctionProductId, body) => {
    try {
        logger.info(`Auctioneer Product Is Updating Started`)
        if (!mongoose.Types.ObjectId.isValid(auctionProductId)) {
            throw new AppError(400, "Invalid auction product ID.");
        }
        const condition = {
            _id: auctionProductId
        }
        const updateData = {
            updatedBy: body.userId
        }
        if (body.title) updateData.title = body.title;
        if (body.description) updateData.description = body.description;
        // Validate and update startTime
        if (body.startTime) {
            const startTime = parseCustomDateFormat(body.startTime);
            console.log("STT", startTime);
            if (isNaN(startTime)) {
                throw new AppError(400, "Invalid date format. Use 'DD/MM/YYYY HH:mm:ss'.");
            }
            if (startTime <= new Date()) {
                throw new AppError(400, "Start time must be in the future.");
            }
            updateData.startTime = startTime;
        }
        // Validate and update endTime
        if (body.endTime) {
            const endTime = parseCustomDateFormat(body.endTime);
            console.log("ETTT", endTime);
            if (isNaN(endTime)) {
                throw new AppError(400, "Invalid date format. Use 'DD/MM/YYYY HH:mm:ss'.");
            }
            if (updateData.startTime && endTime <= updateData.startTime) {
                throw new AppError(400, "End time must be after start time.");
            }
            updateData.endTime = endTime;
        }

        if (body.startPrice) {
            if (typeof body.startPrice !== "number" || body.startPrice <= 0) {
                throw new AppError(400, "Start price must be a positive number.");
            }
            updateData.startPrice = body.startPrice;
        }

        if (body.reservePrice) {
            if (typeof body.reservePrice !== "number" || body.reservePrice <= 0) {
                throw new AppError(400, "Reserve price must be a positive number.");
            }
            if (body.startPrice && body.reservePrice <= body.startPrice) {
                throw new AppError(400, "Reserve price must be greater than start price.");
            }
            updateData.reservePrice = body.reservePrice;
        }

        if (body.categoryId) {
            body.categoryId = new mongoose.Types.ObjectId(body.categoryId);
            const category = await categoryModel.findOne({ _id: body.categoryId });
            if (!category) delete body.categoryId
            updateData.categoryId = category._id
        };
        const updateAuctionProduct = await updateRecord(condition, updateData);

        // -----------------------------------------------------
        const populateQuery = [
            { path: "auctioneerId", select: ["_id", "username", "accountType"] },
            {
                path: "categoryId", select: ["_id", "username", "categoryName", "status",],
                populate: {
                    path: "createdBy",
                    select: ["_id", "username"]
                }
            },
            { path: "createdBy", select: ["_id", "username"] },
            { path: "updatedBy", select: ["_id", "username"] },
        ]
        const selectQuery = "-bidIds -highestBid -createdAt -updatedAt -__v ";
        const record = await findOnlyOneRecord({ _id: updateAuctionProduct._id }, populateQuery, selectQuery);
        if (!record) throw new AppError(404, 'Auction Product Not Found')
        return record
    } catch (error) {
        throw new AppError(400, error.message)
    }

}

export const deleteAuctionProduct = async (auctionProductId) => {
    try {
        logger.info(`Auctioneer Product Is Deleting Started`)
        if (!mongoose.Types.ObjectId.isValid(auctionProductId)) {
            throw new AppError(400, "Invalid auction product ID.");
        }
        const condition = {
            _id: auctionProductId
        }
        const record = await deleteRecord(condition);
        if (!record) throw new AppError(404, 'Auction Product Not Found')
        return true
    } catch (error) {
        throw new AppError(400, error.message)
    }
}

// Republish 
export const publishAuctioneerProduct = async (auctionProductId, body) => {
    try {
        logger.info("Publish Auctioneer Product Started");
        if (!mongoose.Types.ObjectId.isValid(auctionProductId)) {
            throw new AppError(400, "Invalid auction product ID.");
        }
        const auctioneerProduct = await findOnlyOneRecord({ _id: auctionProductId })
        if (!auctioneerProduct) throw new AppError(404, 'Auction Product Not Found')
        if (auctioneerProduct.endTime > Date.now()) {
            throw new AppError(400, `Auction Product Is Already Active. Can't Publish`)
        }
        const condition = {
            _id: auctioneerProduct._id
        }
        const updateData = {
            updatedBy: body.userId
        }
        // startTime & endTime need to implement
        if (body.status) {
            updateData.status = body.status
        }
        const record = await updateRecord(condition, updateData);

        return record
    } catch (error) {
        throw new AppError(400, error.message)
    }
}

// currentAuctioneerProduct
export const currentAuctioneerProduct = async (loggedIn) => {
    try {
        logger.info("Current Auctioneer Product Started");
        const condition = {
            auctioneerId: loggedIn._id
        }
        const populateQuery = [
            { path: "auctioneerId", select: ["_id", "username", "accountType"] },
            {
                path: "categoryId", select: ["_id", "username", "categoryName", "status",],
                populate: {
                    path: "createdBy",
                    select: ["_id", "username"]
                }
            },
            { path: "createdBy", select: ["_id", "username"] },
            { path: "updatedBy", select: ["_id", "username"] },
        ]
        const selectQuery = "-bidIds -highestBid -createdAt -updatedAt -__v ";
        const record = await findAllRecords(condition, populateQuery, selectQuery);
        if (!record) throw new AppError(404, 'Auction Product Not Found')
        return record
    } catch (error) {
        throw new AppError(400, error.message)
    }
}

// let segments = [];
// //TODO: getsegments need to be implemented
// if (body.segments) {
//     body.segments = body.segments.map((e) => ObjectId(e));
//     const query = {
//         _id: {
//             $in: body.segments,
//         },
//         status: "PUBLISHED",
//     };
//     const projection = { _id: 1 };
//     segments = await segmentService.getAllSegments(query, projection);
// }

// module.exports.getModulesByArray = async (array) => {
//     const records = await ModuleModel.find({ _id: { $in: array } }, { _id: 1 });
//     return records;
//   };


