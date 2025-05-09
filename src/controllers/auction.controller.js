import {
    createAuctionProduct,
    updateAuctionProduct,
    deleteAuctionProduct,
    getAllAuctionProducts,
    getOneAuctionProduct,
    publishAuctioneerProduct,
    currentAuctioneerProduct
} from "../services/auction.service.js";
import * as responser from "../core/responser.js";
import * as logger from "../utility/log.js"

class auctionController {
    // create
    createAuctionProduct = async (req, res) => {
        const reqData = req.body;
        reqData.userId = req.userId
        const data = await createAuctionProduct(reqData);
        logger.info(data)
        return responser.send(201, `Successfully Aution Product Created`, req, res, data);
    };
    // getAllProduct
    getAllAuctionProducts = async (req, res) => {
        const reqQuery = req.query
        const data = await getAllAuctionProducts(reqQuery);
        logger.info(data)
        return responser.send(200, `Successfully All Aution Product Fetched`, req, res, data);
    };
    // getOneProduct
    getOneAuctionProduct = async (req, res) => {
        const params = req.params
        const data = await getOneAuctionProduct(params.auctionProductId);
        logger.info(data)
        return responser.send(200, `Successfully Single Aution Product Fetched`, req, res, data);
    };
    // update
    updateAuctionProduct = async (req, res) => {
        const reqData = req.body;
        reqData.userId = req.userId;
        const params = req.params
        const data = await updateAuctionProduct(params.auctionProductId, reqData);
        logger.info(data)
        return responser.send(200, `Successfully Aution Product Updated`, req, res, data);
    };
    // delete
    deleteAuctionProduct = async (req, res) => {
        const params = req.params
        const data = await deleteAuctionProduct(params.auctionProductId);
        logger.info(data)
        return responser.send(200, `Successfully Aution Product Deleted`, req, res, data);
    };
    // publish
    publishAuctioneerProduct = async (req, res) => {
        const reqData = req.body;
        reqData.userId = req.userId;
        const params = req.params
        const data = await publishAuctioneerProduct(params.auctionProductId, reqData);
        logger.info(data)
        return responser.send(200, `Successfully Aution Product Published`, req, res, data);
    };
    // current product
    currentAuctioneerProduct = async (req, res) => {
        const loggedInAuctioneer = req.user;
        const data = await currentAuctioneerProduct(loggedInAuctioneer);
        logger.info(data)
        return responser.send(200, `Successfully Current Aution Product Fetched`, req, res, data);
    };
}

export default new auctionController();
