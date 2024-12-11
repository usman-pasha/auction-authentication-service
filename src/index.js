// default package 
import http from "http";

// custome package
import db from "./core/db.js";
import { app } from "./app.js";
import { config } from "./config/index.js";

// Function to start the server
const startServer = () => {
    const server = http.createServer(app);

    server.listen(config.PORT, async () => {
        console.log(`App is Running on Port: ${config.PORT}`);
        try {
            await db(config.MONGO_URI);
        } catch (err) {
            console.error("Database connection failed", err);
            process.exit(1);  // Exit the process if DB connection fails
        }
    });

    // Handle server errors and restart
    server.on("error", (err) => {
        console.error("Server error:", err);
        setTimeout(startServer, 5000);  // Wait 5 seconds before restarting
    });

    // Gracefully handle uncaught exceptions
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        server.close(() => {
            process.exit(1);  // Exit after closing the server
        });
    });

    // Gracefully handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection:", err);
        server.close(() => {
            process.exit(1);  // Exit after closing the server
        });
    });
};

// Initial server startup
startServer();
