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
}

export default new bidController();
