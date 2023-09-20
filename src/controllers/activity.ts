import Model from '../models/activity';
import * as pdf from '../services/pdfcreator';

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
        const getAllModel = await Model.find({}).populate(['participatingAssociations']);
        res.status(200).json({
            data: getAllModel
        });
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
        const getModel = await Model.findById(id).populate('attendees');
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
        let update = req.body;
        const id = req.params.id;
        const actualModel = await Model.findById(id);
        update = { ...update, participatingAssociations: new Set([...update.participatingAssociations, ...(actualModel?.participatingAssociations as any)]) }
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

