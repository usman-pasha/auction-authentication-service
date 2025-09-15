import { placedBid, getAllBids } from "../services/bid.service.js";

export const initBidderSocket = (nsp) => {
    const bidStore = {};
    nsp.on("connection", (socket) => {
        console.log(`🎯 Bidder connected: ${socket.id}`);

        socket.on("getInitialBids", async ({ auctionProductId }) => {
            try {
                if (!auctionProductId) return socket.emit("bidError", { message: "Auction ID required" });
                socket.join(`auction:${auctionProductId}`);
                const bids = await getAllBids(auctionProductId);
                socket.emit("initialBids", bids);
            } catch (err) {
                socket.emit("bidError", { message: err.message });
            }
        });


        socket.on("placeBid", async (bidData) => {
            try {
                if (!bidData || !bidData.auctionProductId)
                    return socket.emit("bidError", { message: "Invalid bid data" });

                const bidResult = await placedBid(bidData);
                console.log("Bid placed:", bidResult);

                // Send success to the bidder
                socket.emit("bidSuccess", { message: "Bid placed successfully", bid: bidResult });

                // Update bid store
                const allBids = await getAllBids(bidResult.auctionProductId);
                bidStore[bidResult.auctionProductId] = allBids;
                nsp.emit("bidUpdated", allBids);
                // Broadcast to all clients (including auctioneer) in the auction room
                nsp.to(`auction:${bidResult.auctionProductId}`).emit("bidUpdated", allBids);

            } catch (err) {
                console.error("Error placing bid:", err.message);
                socket.emit("bidError", { message: err.message });
            }
        });

        socket.on("disconnect", () => console.log(`❌ Bidder disconnected: ${socket.id}`));
    });
};
