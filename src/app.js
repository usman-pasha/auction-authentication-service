import express from "express"
import cors from "cors"

// custome packages
import { routes } from "./routes/index.js";
import * as responser from "./core/responser.js"
import { errorHandler } from "./core/globalError.js";
import "./jobs/index.js";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
routes(app, "/api/v1")

app.get("/api", async (req, res) => {
    try {
        const data = "Authentication Service Working Fine";
        return responser.send(200, "GET Method is working fine", req, res, data);
    } catch (error) {
        console.log("error");
        return responser.send(error.statusCode, error.message, req, res, error);
    }
})

// globalError handler 
app.use(errorHandler)

export { app }

