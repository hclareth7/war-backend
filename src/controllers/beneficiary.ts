import Model from '../models/beneficiary';
import * as service from '../services/s3Upload'

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
    // #swagger.tags = ['Beneficiaries']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const getAllModel = await Model.find({});
        res.status(200).json({
            data: getAllModel
        });
    } catch (error) {
        console.log(error);
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
        const getModel = await Model.findById(id);
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
        await Model.findByIdAndDelete(id);
        res.status(200).json({
            data: null,
            message: `${modelName} has been deleted`
        });
    } catch (error) {
        next(error);
    }
};

export const updatePhoto = async (req, res, next) => {
    // #swagger.tags = ['Beneficiary']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {

        const file = req.file;
        const identifier = JSON.parse(req.body.beneficiary_id);
        const getModel = await Model.findById(identifier.beneficiary_id);
        if (!getModel) {
            return next(new Error(`${modelName} does not exist`));
        }
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }
        const image_url = await service.uploadS3(file, `${identifier.beneficiary_id}.${file.originalname.match(/\.(.*?)$/)?.[1]}`);
        const update = { photo_url: image_url };
        await Model.findByIdAndUpdate({ _id: identifier.beneficiary_id }, update);
        const beneficiary = await Model.findById({ _id: identifier.beneficiary_id });
        res.status(200).json({
            data: beneficiary,
            message: 'Beneficiary has been updated'
        });

    } catch (error) {
        console.log(error)
        next(error)
    }
};