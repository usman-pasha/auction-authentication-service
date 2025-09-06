import cron from "node-cron";
import { updateAuctionStatuses } from "./auction.js";

// Run every 2 minutes in UTC
cron.schedule("*/20 * * * * *", async () => {
    await updateAuctionStatuses();
});
