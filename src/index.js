// Import core and custom packages
import http from "http";

import db from "./core/db.js";
import { app } from "./app.js";
import { config } from "./config/index.js";
import { placedBid, getAllBids } from "./services/bid.service.js"

import { Server } from "socket.io"; // Import Server for Socket.IO

// Function to start the server
const startServer = () => {
    const server = http.createServer(app);

    // Start listening on the configured port
    server.listen(config.PORT, async () => {
        console.log(`App is Running on Port: ${config.PORT}`);
        try {
            await db(config.DB_URI); // Connect to the database
            // console.log("Database connection successful");
        } catch (err) {
            console.error("Database connection failed:", err);
            process.exit(1); // Exit the process if DB connection fails
        }
    });

    // Socket.IO integration
    const io = new Server(server, {
        cors: {
            origin: "*", // Allow all origins
        },
    });

    const bidStore = {};
    // Handle WebSocket connections
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on('getInitialBids', async(data) => {
            const auctionProductId = data.auctionProductId;

            // Fetch the initial bid data from the database
            const bids =await getAllBids(auctionProductId); // Your method to fetch bids

            socket.emit('initialBids', bids);
        });
        // Listen for new bids
        socket.on("placeBid", async (bidData) => {
            try {
                // Call the placeBid function with the provided data
                const bidResult = await placedBid(bidData);
                console.log(bidResult);

                // Emit success response to the client
                socket.emit("bidSuccess", { message: "Bid placed successfully", bid: bidResult });

                // Broadcast the updated auction data to all clients
                const getAllBidsData = await getAllBids(bidResult.auctionProductId)
                console.log(getAllBidsData);
                bidStore[bidResult.auctionProductId] = getAllBidsData;
                io.emit("bidUpdated", getAllBidsData);
            } catch (err) {
                // Handle and emit error to the client
                console.error("Error placing bid:", err.message);
                socket.emit("bidError", { message: err.message });
            }
        });
        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    // Handle server errors and restart
    server.on("error", (err) => {
        console.error("Server error:", err);
        setTimeout(startServer, 5000); // Wait 5 seconds before restarting
    });

    // Gracefully handle uncaught exceptions
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        server.close(() => {
            process.exit(1); // Exit after closing the server
        });
    });

    // Gracefully handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection:", err);
        server.close(() => {
            process.exit(1); // Exit after closing the server
        });
    });
};

// Function to save bid to the database (placeholder implementation)
const saveBidToDB = async (bidData) => {
    // Implement database saving logic here
    console.log("Saving bid to the database:", bidData);
    // Example: await BidModel.create(bidData);
};

// Initial server startup
startServer();


// const bidDataRes = {
//     auctionId: bidResult.auctionProductId,
//     highestBid: {
//         bidderId: bidResult.userId,
//         amount: bidResult.bidAmount,
//     },
//     currentBidPrice: bidResult.bidAmount,
// }
// io.emit("bidUpdated", bidDataRes);