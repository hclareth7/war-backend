// physicalDeliveryController.js
import PhysicalDelivery from '../models/physicalDelivery';
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';

export const save = async (req, res, next) => {

    // #swagger.tags = ['PhysicalDelivery']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const data = req.body;
    const newPhysicalDelivery = new PhysicalDelivery({ ...data});
    await newPhysicalDelivery.save();
    res.json({ message: 'Physical Delivery created successfully.' });
} catch (error) {
    console.log(error);
    next(error)
}
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['PhysicalDelivery']
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
                searchableFields: config.CONFIGS.searchableFields.events
            };
        };
        const getAllModel = await mutil.getTunnedDocument(PhysicalDelivery, ['author','itemsList.item','event'], page, perPage, searchOptions);
        res.status(200).json({
            data: getAllModel
        });
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['PhysicalDelivery']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        const physicalDeliveryFound = await PhysicalDelivery.findById(id).populate(['author','itemsList.item','event']);
        if (!physicalDeliveryFound) {
            return next(new Error('Physical Delivery does not exist'));
        }
        res.status(200).json({
            data: physicalDeliveryFound
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['PhysicalDelivery']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const update = req.body
        const id = req.params.id;
        await PhysicalDelivery.findByIdAndUpdate(id, update);
        const delivery = await PhysicalDelivery.findById(id);
        res.status(200).json({
            data: delivery,
            message: 'delivery has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['PhysicalDelivery']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        await PhysicalDelivery.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Physical Delivery  has been deleted'
        });
    } catch (error) {
        next(error)
    }
};