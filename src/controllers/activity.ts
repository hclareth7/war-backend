import Model from '../models/activity';
import * as pdf from '../services/pdfcreator';
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';

const modelName = Model.modelName;

export const save = async (req, res, next) => {
    // #swagger.tags = ['Activities']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new activity.',
                schema: { $ref: '#/definitions/activity' }
    } */
    try {
        const saveModel = new Model(req.body);
        await saveModel.save();
        const data = { 'message': `${modelName} successfully created`, 'data': saveModel };
        res.json(data);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Activities']
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
                searchableFields: config.CONFIGS.searchableFields.activity
            };
        };
        const getAllModel = await mutil.getTunnedDocument(Model,['participatingAssociations'], page, perPage, searchOptions);
        res.status(200).json(getAllModel);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Activities']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const id = req.params.id;
        const getModel = await Model.findById(id).populate(['participatingAssociations']);
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
    // #swagger.tags = ['Activities']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const update = req.body
        const id = req.params.id;
        await Model.findByIdAndUpdate(id, update);
        const current = await Model.findById(id);
        res.status(200).json({
            data: current,
            message: 'Activity has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Activities']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const id = req.params.id;
        await Model.findByIdAndDelete(id);
        res.status(200).json({
            data: null,
            message: `${modelName} has been deleted`
        });
    } catch (error) {
        next(error);
    }
};

export const generatePdf = async (req, res, next) => {
    // #swagger.tags = ['Activities']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]*/

    try {
        const { query, starDate, endDate } = req.body;
        const activities = await Model.find({});
        //const activities = [["juan", "perez"], ["mario", "dias"]];
        //const header = ["nombre", "apellido"];
        const headers = Object.keys(Model.schema.paths);

        const data = {
            headers: headers,
            data: activities
        }
        const filterCondition = { start: starDate, end: endDate };
        pdf.createPDf(filterCondition, data, res);

        res.status(200).json({
            message: `successfully`
        });

    } catch (error) {
        console.log(error);
    }
}

