import { bidModel } from "../models/bid.model.js";
import { auctionModel } from "../models/auction.model.js";
import AppError from "../core/appError.js";
import * as logger from "../utility/log.js";
import { getMethod, patchMethod } from "../utility/commonApi.js";
import mongoose from "mongoose";

export const createRecord = async (object) => {
    const record = await bidModel.create(object);
    return record;
};

export const findOnlyOneRecord = async (condition, populateQuery, select) => {
    const record = await bidModel.findOne(condition)
        .populate(populateQuery)
        .select(select);
    return record;
};

export const findAllRecords = async (condition, populateQuery, select) => {
    const record = await bidModel.find(condition)
        .populate(populateQuery)
        .select(select);
    return record;
};

export const updateRecord = async (condition, body) => {
    const option = { new: true }
    const record = await bidModel.findOneAndUpdate(condition, body, option)
    return record;
};

export const deleteRecord = async (condition) => {
    const record = await bidModel.findOneAndDelete(condition)
    return record;
};

// placed bid 
export const placedBid = async (body) => {
    try {
        logger.info(`Placing the Bid`)
        if (!body.bidAmount || !body.auctionProductId) {
            throw new AppError(400, "Required Parameters")
        }
        const auctionProduct = await auctionModel.findOne({ _id: body.auctionProductId });
        if (body.auctionProductId) {
            body.auctionProductId = new mongoose.Types.ObjectId(body.auctionProductId);
            if (!auctionProduct) throw new AppError(404, "Auction Product not found");
        }

        // Check if the auction is active
        if (auctionProduct.status !== 'active') {
            throw new AppError(400, "Bidding is only allowed on active auctions");
        }
        const now = new Date();
        if (new Date(auctionProduct.startTime) > now) {
            throw new AppError(400, 'Auction Has Not Started Yet')
        }
        if (new Date(auctionProduct.endTime) < now) {
            throw new AppError(400, 'Auction Is Ended')
        }

        // Validate bid amount
        const currentHighestBid = auctionProduct.highestBid.amount || 0;
        if (body.bidAmount <= currentHighestBid) {
            throw new AppError(400, `Bid amount must be higher than the current highest bid: ${currentHighestBid}`);
        }
        // check bidAmount and starting startPrice from auction

        // Prepare payload for creating the bid
        const payload = {
            auctionProductId: body.auctionProductId,
            userId: body.userId,
            bidAmount: Number(body.bidAmount),
        };

        // Create a new bid record
        const bidCreate = await createRecord(payload);
        if (!bidCreate || !bidCreate._id) {
            throw new AppError(500, "Failed to create the bid record");
        }
        // Update auction with the new highest bid and add the bid ID to bidIds
        await auctionModel.findOneAndUpdate(
            { _id: bidCreate.auctionProductId },
            {
                $set: {
                    "highestBid.bidderId": body.userId,
                    "highestBid.amount": body.bidAmount,
                    currentBidPrice: body.bidAmount,
                },
                $push: {
                    bidIds: bidCreate._id,
                },
            },
            { new: true }
        );

        logger.info("Bid placed successfully");
        const populateQuery = [
            { path: "auctionProductId", select: ["_id", "title", "description", "bidIds"] },
            { path: "userId", select: ["_id", "username", "accountType"] },
        ]
        const bid = await findOnlyOneRecord({ _id: bidCreate._id }, populateQuery);
        // logger.data("bidd", bid)
        return bid;
    } catch (error) {
        throw new AppError(400, error.message)
    }
}

// 
export const getAllBids = async (currentBidId) => {
    try {
        logger.info(`Placing the Bid Get`);
        const condition = {
            auctionProductId: currentBidId
        }
        const populateQuery = [
            { path: "auctionProductId", select: ["_id", "title", "description", "bidIds"] },
            { path: "userId", select: ["_id", "username", "accountType"] },
        ]
        const bid = await bidModel.find(condition).populate(populateQuery).sort({ bidAmount: -1 });
        logger.data("bidd", bid)
        return bid;
    } catch (error) {
        throw new AppError(400, error.message)
    }
}