import express from "express";
import bidController from "../controllers/bid.controller.js";
import { catchError } from "../core/catachError.js";
import { verifyAuth, authorizePermissions } from "../middlewares/auth.js";

const bidRoute = express.Router();

bidRoute.get("/getSingle/:bidId", catchError(bidController.getOnebidProduct))
bidRoute.get("/getAll", catchError(bidController.getAllbidProducts))

bidRoute.use(verifyAuth);
// bidRoute.use(authorizePermissions("bideer"));
bidRoute.route("/create")
    .post(catchError(bidController.createbidProduct));
bidRoute.patch("/update/:bidProductId", catchError(bidController.updatebidProduct))
bidRoute.delete("/delete/:bidProductId", catchError(bidController.deletebidProduct))
bidRoute.patch("/publish/:bidProductId", catchError(bidController.publishbideerProduct))
bidRoute.get("/currentProducts", catchError(bidController.currentbideerProduct))

export default bidRoute;

