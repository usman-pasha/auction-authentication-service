import { getAllBids } from "../services/bid.service.js";

export const initAuctioneerSocket = (nsp) => {
  nsp.on("connection", (socket) => {
    console.log(`🏷️ Auctioneer connected: ${socket.id}`);

    // Auctioneer joins a specific auction room
    socket.on("monitorAuction", async ({ auctionId }) => {
      try {
        if (!auctionId) return socket.emit("auctionError", { message: "Auction ID required" });

        console.log(`Auctioneer monitoring auction: ${auctionId}`);
        socket.join(`auction:${auctionId}`);

        // Send initial bids
        const bids = await getAllBids(auctionId);
        socket.emit("initialBids", bids);

        // The auctioneer will automatically receive updates
        // from the 'bidPlaced' event emitted by bidders

        
      } catch (err) {
        console.error("Error monitoring auction:", err.message);
        socket.emit("auctionError", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Auctioneer disconnected: ${socket.id}`);
    });
  });
};
