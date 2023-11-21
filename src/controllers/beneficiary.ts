import Beneficiary from '../models/beneficiary';
import Model from '../models/beneficiary';
import * as LSservice from '../services/localUpload';
import * as mutil from '../helpers/modelUtilities';
import * as config from '../config/config';
import mongoose from 'mongoose';

const modelName = Model.modelName;

export const save = async (req, res, next) => {
    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Adding new beneficiary.',
        schema: { $ref: '#/definitions/beneficiary' }
    } */

    try {
        const body = req.body.data;
        body.author = res.locals.loggedInUser._id;
        const saveModel = new Model(body);
        await saveModel.save();
        const data = { 'message': `${modelName} successfully created`, 'data': saveModel };
        res.json(data);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
export const filter = async (req, res, next) => {
    // options = [
    //   { "filterType": "dateRange", "startDate": "09-08-2023", "endDate": "09-12-2023", "field": "birthday" },
    //   { "filterType": "dateSpecific", "value": "09-08-2023", "field": "birthday" },
    //   { "filterType": "number", "value": "10", "operator": ">", "field": "score_sisben" },
    //   { "filterType": "string", "value": "pablo", "field": "first_name" },
    // ]

    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]*/
    try {
        const options: [] = req.body.options;
        if (options.length === 0) {
            return res.status(404).json({
                data: []
            });
        }
        const modelFilterResult = await mutil.getFilteredDocument(Model, options);
        return res.status(200).json({
            data: modelFilterResult
        })
    } catch (error) {
        next(error)
    }
}

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const page = req.query.page
        const perPage = req.query.perPage
        let searchOptions = {};
        if (req.query.queryString) {
            searchOptions = {
                queryString: req.query.queryString,
                searchableFields: config.CONFIGS.searchableFields.beneficiary
            };
        };
        const getAllModel = await mutil.getTunnedDocument2(Beneficiary, ['association', 'author', 'updatedBy','activity', 'community'], page, perPage, searchOptions)
        res.status(200).json(getAllModel);
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const id = req.params.id;
        const getModel = await Model.findById(id).populate(['association', 'author', 'updatedBy','activity', 'community']);
        if (!getModel) {
            return next(new Error(`${modelName} does not exist`));
        }
        res.status(200).json({
            data: getModel
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const update = req.body;
        const id = req.params.id;
        update.updatedBy = res.locals.loggedInUser._id;
        await Model.findByIdAndUpdate(id, update);
        const updatedModel = await Model.findById(id);
        res.status(200).json({
            data: updatedModel,
            message: `${modelName} has been updated`
        });
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const id = req.params.id;
        const updatedModel = await Model.findByIdAndUpdate(id, { status: 'disabled' })
        if (!updatedModel) {
            return res.status(404).json({ error: `${modelName} not found` });
        }
        res.status(200).json({
            data: null,
            message: `${modelName} has been deleted`
        });
    } catch (error) {
        next(error);
    }
};

export const uploadResource = async (req, res, next) => {
    // #swagger.tags = ['Beneficiary']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        //const file = req.file;
        const id = req.params.id;
        let beneficiary = {};
        for (const key in req.files) {
            beneficiary[key] = LSservice.getImageUrl(req, req.files[key]);
        };

        await Model.findByIdAndUpdate(id, beneficiary);

        const updatedModel = await Model.findById(id);
        res.status(200).json({
            data: updatedModel,
            message: `${modelName} has been updated`
        });

    } catch (error) {
        console.log(error)
        next(error)
    }
};

export const getByActivity = async (req, res, next) => {
    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {

        const page = req.query.page
        const perPage = req.query.perPage
        let searchOptions = {};

        const activityId = req.params.activityId;
        let directSearch: any[] = []
        if (activityId) {
            directSearch.push({ activity: new mongoose.Types.ObjectId(activityId) });
            searchOptions = { directSearch: directSearch }
        }

        if (req.query.queryString) {
            searchOptions = {
                queryString: req.query.queryString,
                searchableFields: config.CONFIGS.searchableFields.beneficiary,
                directSearch: directSearch
            };
        };


        const getModel = await mutil.getTunnedDocument(Beneficiary, ['association', 'author', 'updatedBy', 'activity'], page, perPage, searchOptions)
        if (!getModel) {
            return next(new Error("Beneficiaries does not exist"));
        }
        res.status(200).json({
            data: getModel
        });
    } catch (error) {
        next(error);
    }
};