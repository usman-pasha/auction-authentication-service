import {
    placedBid
} from "../services/bid.service.js";
import * as responser from "../core/responser.js";
import * as logger from "../utility/log.js"

class bidController {
    // create
    placedBid = async (req, res) => {
        const reqData = req.body;
        // reqData.userId = req.userId
        const data = await placedBid(reqData);
        logger.info(data)
        return responser.send(201, `Successfully Bid Placed`, req, res, data);
    };

    // // getAllProduct
    // getAllbidProducts = async (req, res) => {
    //     const reqQuery = req.query
    //     const data = await getAllbidProducts(reqQuery);
    //     logger.info(data)
    //     return responser.send(200, `Successfully All Aution Product Fetched`, req, res, data);
    // };
    // // getOneProduct
    // getOnebidProduct = async (req, res) => {
    //     const params = req.params
    //     const data = await getOnebidProduct(params.bidProductId);
    //     logger.info(data)
    //     return responser.send(200, `Successfully Single Aution Product Fetched`, req, res, data);
    // };
    // // update
    // updatebidProduct = async (req, res) => {
    //     const reqData = req.body;
    //     reqData.userId = req.userId;
    //     const params = req.params
    //     const data = await updatebidProduct(params.bidProductId, reqData);
    //     logger.info(data)
    //     return responser.send(200, `Successfully Aution Product Updated`, req, res, data);
    // };
    // // delete
    // deletebidProduct = async (req, res) => {
    //     const params = req.params
    //     const data = await deletebidProduct(params.bidProductId);
    //     logger.info(data)
    //     return responser.send(200, `Successfully Aution Product Deleted`, req, res, data);
    // };
}

export default new bidController();
