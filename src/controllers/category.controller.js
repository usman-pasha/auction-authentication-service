import { createCategory, getAllCategories, getOnlyOneCategory, updateCategory, deleteCategory } from "../services/category.service.js";
import * as responser from "../core/responser.js";
import * as logger from "../utility/log.js"

class categoryController {

    createCategory = async (req, res) => {
        const reqData = req.body;
        reqData.userId = req.userId
        const data = await createCategory(reqData);
        logger.info(data)
        return responser.send(201, `Successfully Category Created`, req, res, data);
    };

    getAllCategories = async (req, res) => {
        const reqQuery = req.query;
        const data = await getAllCategories(reqQuery);
        logger.info(data)
        return responser.send(200, `Successfully All Categories Fetched`, req, res, data);
    };


    getOnlyOneCategory = async (req, res) => {
        const reqParams = req.params;
        const data = await getOnlyOneCategory(reqParams.categoryId);
        logger.info(data)
        return responser.send(200, `Successfully Single category Fetched`, req, res, data);
    };

    updateCategory = async (req, res) => {
        const reqData = req.body;
        const params = req.params
        const data = await updateCategory(params.categoryId, reqData);
        logger.info(data)
        return responser.send(200, `Successfully Category Updated`, req, res, data);
    };

    deleteCategory = async (req, res) => {
        const reqParams = req.params;
        const data = await deleteCategory(reqParams.categoryId);
        logger.info(data)
        return responser.send(200, `Successfully Category Deleted`, req, res, data);
    };
}

export default new categoryController();
