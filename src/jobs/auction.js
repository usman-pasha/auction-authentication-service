import { auctionModel } from "../models/auction.model.js";
import * as logger from "../utility/log.js";

export const updateAuctionStatuses = async () => {
    try {
        // Get the current time in UTC
        const nowUTC = new Date();
        logger.info("Updating Auction Status From Cron Job");
        console.log("Current UTC Time:", nowUTC.toISOString());

        // Find auctions that should be marked as active
        const active = await auctionModel.updateMany(
            { startTime: { $lte: nowUTC }, endTime: { $gte: nowUTC } }, // Compare with UTC
            { $set: { status: "active" } }
        );

        // Find auctions that should be marked as closed
        const closed = await auctionModel.updateMany(
            { endTime: { $lt: nowUTC } }, // Compare with UTC
            { $set: { status: "closed" } }
        );

        // Log the update results
        console.log(`[CRON] Status Update => Active: ${active.modifiedCount}, Closed: ${closed.modifiedCount}, Time: ${nowUTC.toISOString()}`);

    } catch (error) {
        console.error("[CRON ERROR] Failed to update auction statuses:", error.message);
    }
};

