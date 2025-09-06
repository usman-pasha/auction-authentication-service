import express from "express";
import auctionController from "../controllers/auction.controller.js";
import { catchError } from "../core/catachError.js";
import { verifyAuth, authorizePermissions } from "../middlewares/auth.js";

const auctionRoute = express.Router();

auctionRoute.get("/getSingle/:auctionProductId", catchError(auctionController.getOneAuctionProduct))
auctionRoute.get("/getAll", catchError(auctionController.getAllAuctionProducts))

auctionRoute.use(verifyAuth);
auctionRoute.use(authorizePermissions("Auctioneer"));
auctionRoute.route("/create")
    .post(catchError(auctionController.createAuctionProduct));
auctionRoute.patch("/update/:auctionProductId", catchError(auctionController.updateAuctionProduct))
auctionRoute.delete("/delete/:auctionProductId", catchError(auctionController.deleteAuctionProduct))
auctionRoute.patch("/publish/:auctionProductId", catchError(auctionController.publishAuctioneerProduct))
auctionRoute.get("/currentProducts", catchError(auctionController.currentAuctioneerProduct))
auctionRoute.patch("/close/:auctionId", catchError(auctionController.closeAuction))

export default auctionRoute;

