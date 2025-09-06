import cron from "node-cron";
import { updateAuctionStatuses } from "./auction.js";

// Run every minute
cron.schedule("*/2 * * * *", async () => {
    await updateAuctionStatuses();
}, {
    timezone: "Asia/Kolkata" // for IST
});
