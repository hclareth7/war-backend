// itemController.js
import Item from '../models/item';
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';


export const save = async (req, res, next) => {

    // #swagger.tags = ['Items']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const { name, code , value } = req.body;
    const itemFound=await Item.findOne({ code: { $gt: code } });
    if(!itemFound){
        const newItem = new Item({ name, code , value });
        await newItem.save();
        return res.json({ message: 'Item created successfully.' });
    }
    res.json({ message: 'already existing item.' });
} catch (error) {
    console.log(error);
    next(error)
}
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Items']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const page = req.query.page
        const perPage = req.query.perPage
        let searchOptions = {};

        if (req.query.queryString) {
            searchOptions = {
                queryString: req.query.queryString,
                searchableFields: config.CONFIGS.searchableFields.item
            };
        };
        const getAllModel = await mutil.getTunnedDocument(Item, [], page, perPage, searchOptions)
        res.status(200).json({
            data: getAllModel
        });
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Items']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        const item = await Item.findById(id);
        if (!item) {
            return next(new Error('Item does not exist'));
        }
        res.status(200).json({
            data: item
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['Items']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const update = req.body
        const id = req.params.id;
        await Item.findByIdAndUpdate(id, update);
        const item = await Item.findById(id)
        res.status(200).json({
            data: item,
            message: 'Item has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Items']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        await Item.findByIdAndDelete(id);
        res.status(200).json({
            data: null,
            message: 'Item has been deleted'
        });
    } catch (error) {
        next(error)
    }
};