import {
    createProduct,
    getAllProducts,
    getOnlyOneProduct,
    updateProduct,
    deleteProduct
} from "../services/product.service.js";

import * as responser from "../core/responser.js";
import * as logger from "../utility/log.js";

class productController {

    createProduct = async (req, res) => {
        const reqData = req.body;
        reqData.userId = req.userId;
        const data = await createProduct(reqData);
        logger.info(data);
        return responser.send(201, "Successfully Product Created", req, res, data);
    };

    getAllProducts = async (req, res) => {
        const data = await getAllProducts();
        logger.info(data);
        return responser.send(200, "Successfully All Products Fetched", req, res, data);
    };

    getOnlyOneProduct = async (req, res) => {
        const reqParams = req.params;
        const data = await getOnlyOneProduct(reqParams.productId);
        logger.info(data);
        return responser.send(200, "Successfully Product Fetched", req, res, data);
    };

    updateProduct = async (req, res) => {
        const reqData = req.body;
        reqData.userId = req.userId;
        const params = req.params;
        const data = await updateProduct(params.productId, reqData);
        logger.info(data);
        return responser.send(200, "Successfully Product Updated", req, res, data);
    };

    deleteProduct = async (req, res) => {
        const reqParams = req.params;
        const data = await deleteProduct(reqParams.productId);
        logger.info(data);
        return responser.send(200, "Successfully Product Deleted", req, res, data);
    };
}

export default new productController();
