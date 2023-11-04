// eventController.js
import Event from '../models/event';
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';

export const save = async (req, res, next) => {

    // #swagger.tags = ['Events']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const data = req.body;
    const newEvent = new Event({ ...data});
    await newEvent.save();
    res.json({ message: 'Event created successfully.' });
} catch (error) {
    console.log(error);
    next(error)
}
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Events']
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
        const getAllModel = await mutil.getTunnedDocument(Event, [{path: 'associated_winery', populate:{path: 'inventory.item'}},'participatingAssociations','attendees'], page, perPage, searchOptions);
        res.status(200).json({
            data: getAllModel
        });
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        const eventFound = await Event.findById(id).populate(['associated_winery','participatingAssociations']);
        if (!eventFound) {
            return next(new Error('Event does not exist'));
        }
        res.status(200).json({
            data: eventFound
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const update = req.body
        const id = req.params.id;
        await Event.findByIdAndUpdate(id, update);
        const event = await Event.findById(id);
        res.status(200).json({
            data: event,
            message: 'Event has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        await Event.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Event has been deleted'
        });
    } catch (error) {
        next(error)
    }
};