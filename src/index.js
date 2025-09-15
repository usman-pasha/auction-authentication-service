// server.js
import http from "http";
import { app } from "./app.js";
import { config } from "./config/index.js";
import db from "./core/db.js";
import { initSockets } from "./sockets/index.js";

const startServer = async () => {
    try {
        await db(config.DB_URI);
        console.log("✅ Database connected");

        const server = http.createServer(app);

        // Start listening
        server.listen(config.PORT, () => {
            console.log(`🚀 Server running on port ${config.PORT}`);
        });

        // Initialize socket
        initSockets(server);

        // Handle critical errors
        process.on("uncaughtException", (err) => {
            console.error("❌ Uncaught Exception:", err);
            server.close(() => process.exit(1));
        });

        process.on("unhandledRejection", (err) => {
            console.error("❌ Unhandled Rejection:", err);
            server.close(() => process.exit(1));
        });
    } catch (err) {
        console.error("❌ Server failed to start:", err);
        process.exit(1);
    }
};

startServer();
