import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import categoryRoute from "./category.route.js";
import auctionRoute from "./auction.route.js";
import bidRoute from "./bid.route.js";
import productRoute from "./product.route.js";

export const routes = (app, apiKey) => {
    app.use(`${apiKey}/auth`, authRoute);
    app.use(`${apiKey}/user`, userRoute);
    app.use(`${apiKey}/category`, categoryRoute);
    app.use(`${apiKey}/product`, productRoute);
    app.use(`${apiKey}/auction`, auctionRoute);
    app.use(`${apiKey}/bid`, bidRoute);
}

// http://localhost:5006/api/v1/auth
// http://localhost:5006/api/v1/user
