const Model = require('../models/beneficiary');

const modelName = Model.modelName;
exports.save = async (req, res, next) => {
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

exports.getAll = async (req, res, next) => {
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

exports.get = async (req, res, next) => {
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

exports.update = async (req, res, next) => {
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

exports.delete = async (req, res, next) => {
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
