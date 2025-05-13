import express from "express";
import productController from "../controllers/product.controller.js";
import { catchError } from "../core/catachError.js";
import { verifyAuth, authorizePermissions } from "../middlewares/auth.js";

const productRoute = express.Router();

productRoute
  .route("/createProduct")
  .post(verifyAuth, authorizePermissions("Auctioneer"), catchError(productController.createProduct));

productRoute
  .route("/getSingleProduct/:productId")
  .get(catchError(productController.getOnlyOneProduct));

productRoute
  .route("/getAllProducts")
  .get(catchError(productController.getAllProducts));

productRoute
  .route("/updateProduct/:productId")
  .patch(verifyAuth, authorizePermissions("Auctioneer"), catchError(productController.updateProduct));

productRoute
  .route("/deleteProduct/:productId")
  .delete(verifyAuth, authorizePermissions("Auctioneer"), catchError(productController.deleteProduct));

export default productRoute;
