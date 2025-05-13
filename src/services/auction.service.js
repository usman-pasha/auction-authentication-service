import AppError from "../core/appError.js";
import { auctionModel } from "../models/auction.model.js"
import { categoryModel } from "../models/category.model.js"
import * as logger from "../utility/log.js";
import mongoose from "mongoose";
// import { Schema } from "mongoose"
// const ObjectId = Schema.Types.ObjectId

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

const parseIndianDateTime = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    // Create a date in IST
    const istDate = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes - 30));
    return new Date(istDate.getTime() + 5.5 * 60 * 60 * 1000); // Shift to IST
};


export const validateAuctionData = (data) => {
    if (!data.startTime || !data.endTime) {
        throw new AppError(400, "Start time and end time are required.");
    }

    const startTime = parseIndianDateTime(data.startTime);
    const endTime = parseIndianDateTime(data.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new AppError(400, "Invalid date format. Use 'DD/MM/YYYY HH:mm'.");
    }

    if (startTime <= new Date()) {
        throw new AppError(400, "Start time must be in the future.");
    }

    if (endTime <= startTime) {
        throw new AppError(400, "End time must be after start time.");
    }

    if (!data.startPrice || typeof data.startPrice !== "number" || data.startPrice <= 0) {
        throw new AppError(400, "Start price must be a positive number.");
    }

    if (!data.reservePrice || typeof data.reservePrice !== "number" || data.reservePrice <= 0) {
        throw new AppError(400, "Reserve price must be a positive number.");
    }

    if (data.startPrice >= data.reservePrice) {
        throw new AppError(400, "Start price must be less than reserve price.");
    }

    return { startTime, endTime }; // Return the parsed times
};


// create placed 
export const createAuctionProduct = async (body) => {
    try {
        logger.info(`creting the auction product`);
        const { startTime, endTime } = validateAuctionData(body);

        const payload = {
            productId: body.productId,
            auctioneerId: body.userId,
            startTime,       // <- Actual Date object
            endTime,         // <- Actual Date object
            startPrice: body.startPrice,
            reservePrice: body.reservePrice,
            createdBy: body.userId,
            updatedBy: body.userId,
        };
        const craetedAuctionProduct = await createRecord(payload);
        const populateQuery = [
            { path: "auctioneerId", select: ["_id", "username", "accountType"] },
            {
                path: "productId", select: ["_id", "title", "description", "status",],
                populate: {
                    path: "categoryId",
                    select: ["_id", "categoryName"]
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
            path: "productId", select: ["_id", "title", "description", "status",],
            populate: {
                path: "categoryId",
                select: ["_id", "categoryName"]
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
            path: "productId", select: ["_id", "title", "description", "status",],
            populate: {
                path: "categoryId",
                select: ["_id", "categoryName"]
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
                path: "productId", select: ["_id", "title", "description", "status",],
                populate: {
                    path: "categoryId",
                    select: ["_id", "categoryName"]
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

export const publishAuctioneerProduct = async (auctionProductId, body) => {
    try {
        logger.info("Publish Auctioneer Product Started");

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(auctionProductId)) {
            throw new AppError(400, "Invalid auction product ID.");
        }

        // Fetch the existing auction
        const auctioneerProduct = await findOnlyOneRecord({ _id: auctionProductId });
        if (!auctioneerProduct) throw new AppError(404, "Auction Product Not Found");

        // If auction hasn't ended yet, prevent republish
        if (new Date(auctioneerProduct.endTime) > new Date()) {
            throw new AppError(400, `Auction is still active. Can't republish.`);
        }

        // Validate and parse new start/end times
        if (!body.startTime || !body.endTime) {
            throw new AppError(400, "Start time and end time are required for republishing.");
        }

        const startTime = new Date(body.startTime);
        const endTime = new Date(body.endTime);

        if (isNaN(startTime) || isNaN(endTime)) {
            throw new AppError(400, "Invalid date format. Use ISO or valid date string.");
        }

        if (startTime <= new Date()) {
            throw new AppError(400, "Start time must be in the future.");
        }

        if (endTime <= startTime) {
            throw new AppError(400, "End time must be after start time.");
        }

        // Prepare update
        const condition = { _id: auctioneerProduct._id };
        const updateData = {
            startTime,
            endTime,
            status: body.status || "upcoming",
            updatedBy: body.userId,
        };

        const record = await updateRecord(condition, updateData);
        return record;

    } catch (error) {
        throw new AppError(400, error.message);
    }
};


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


