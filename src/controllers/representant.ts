// eventController.js
import Representant from '../models/representant';
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';

export const save = async (req, res, next) => {

    // #swagger.tags = ['Representant']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Adding new Representant.',
        schema: { $ref: '#/definitions/representant' }
    } */

  try {
    const data = req.body;
    const newRepresentant = new Representant({ ...data});
    const representantSaved = await newRepresentant.save();
    res.json({ message: 'Representant created successfully.', data: representantSaved });
} catch (error) {
    console.log(error);
    next(error)
}
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Representant']
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
        const getAllModel = await mutil.getTunnedDocument(Representant, ['association'], page, perPage, searchOptions);
        res.status(200).json({
            data: getAllModel
        });
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Representant']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        const representantFound = await Representant.findById(id).populate(['association']);
        if (!representantFound) {
            return next(new Error('Representant does not exist'));
        }
        res.status(200).json({
            data: representantFound
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['Representant']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const update = req.body
        const id = req.params.id;
        await Representant.findByIdAndUpdate(id, update);
        const representant = await Representant.findById(id);
        res.status(200).json({
            data: representant,
            message: 'Representant has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Representant']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        await Representant.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Representant has been deleted'
        });
    } catch (error) {
        next(error)
    }
};
