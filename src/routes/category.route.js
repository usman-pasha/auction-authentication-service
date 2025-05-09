import express from "express";
import categoryController from "../controllers/category.controller.js";
import { catchError } from "../core/catachError.js";
import { verifyAuth, authorizePermissions } from "../middlewares/auth.js";

const categoryRoute = express.Router();

// categoryRoute.route("/createCategory").post(verifyAuth, authorizePermissions("Bidder"), catchError(categoryController.createCategory));
categoryRoute.route("/createCategory").post(verifyAuth, authorizePermissions("Auctioneer"), catchError(categoryController.createCategory));
categoryRoute.route("/getSingleCategory/:categoryId").get(catchError(categoryController.getOnlyOneCategory));
categoryRoute.route("/getAllCategories").get(catchError(categoryController.getAllCategories));
categoryRoute.route("/updateCategory/:categoryId").patch(verifyAuth, authorizePermissions("Bidder"), catchError(categoryController.updateCategory));
categoryRoute.route("/deleteCategory/:categoryId").delete(verifyAuth, authorizePermissions("Bidder"), catchError(categoryController.deleteCategory));

export default categoryRoute;
