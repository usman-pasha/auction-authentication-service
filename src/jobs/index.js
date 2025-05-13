import cron from "node-cron";
import { updateAuctionStatuses } from "./auction.js";

// Run every minute
cron.schedule("* * * * * *", async () => {
    await updateAuctionStatuses();
}, {
    timezone: "Asia/Kolkata" // for IST
});
