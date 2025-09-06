import { auctionModel } from "../models/auction.model.js";
import * as logger from "../utility/log.js";

const convertUTCtoIST = (utcDate) => {
    // Add 5 hours and 30 minutes to convert to IST
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
    return istDate;
};

export const updateAuctionStatuses = async () => {
    try {
        // Get the current time in UTC
        logger.info("Updating Auction Status From Cron Job")
        const now = new Date();
        // console.log("Current UTC Time:", now.toISOString());
        // Convert the current time to IST
        const nowIST = convertUTCtoIST(now);
        console.log("Converted IST Time:", nowIST.toISOString());

        // Find auctions that should be marked as active
        const active = await auctionModel.updateMany(
            { startTime: { $lte: nowIST }, endTime: { $gte: nowIST } }, // Compare with IST
            { $set: { status: "active" } }
        );

        // // Find auctions that should be marked as closed
        // const closed = await auctionModel.updateMany(
        //     { endTime: { $lt: nowIST } }, // Compare with IST
        //     { $set: { status: "closed" } }
        // );

        // Log the update results
        console.log(`[CRON] Status Update => Active: ${active.modifiedCount}, Time: ${nowIST.toISOString()}`);
        // console.log(`[CRON] Status Update => Active: ${active.modifiedCount}, Closed: ${closed.modifiedCount}, Time: ${nowIST.toISOString()}`);

    } catch (error) {
        console.error("[CRON ERROR] Failed to update auction statuses:", error.message);
    }
};

