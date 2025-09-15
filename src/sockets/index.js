// sockets/index.js
import { Server } from "socket.io";
import { initBidderSocket } from "./bid.socket.js";
import { initAuctioneerSocket } from "./auctioneer.socket.js";
import { initAdminSocket } from "./admin.socket.js";

export const initSockets = (server) => {
  console.log("🔌 Initializing Socket.IO...");

  // Create Socket.IO instance here
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Initialize namespaces
  initBidderSocket(io.of("/auction"));
  initAuctioneerSocket(io.of("/auction"));
  initAdminSocket(io.of("/auction"));

  console.log("✅ All socket namespaces initialized");

  return io; // If you ever need `io` in other places
};
