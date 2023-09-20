import Beneficiary from '../models/beneficiary';
import Model from '../models/beneficiary';
import * as service from '../services/s3Upload';
import * as mutil from '../helpers/modelUtilities';
import * as config from '../config/config';

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
        const foto = req.file;
        const body = JSON.parse(req.body.data);
        const saveModel = new Model(body);
        if (foto) {
            const image_url = await service.uploadS3(foto, `${saveModel._id}.${foto.originalname.match(/\.(.*?)$/)?.[1]}`);
            saveModel.photo_url = image_url;
        }

        await saveModel.save();
        const data = { 'message': `${modelName} successfully created`, 'data': saveModel };
        res.json(data);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
export const filter = async (req,res,next)=>{
  // options = [
  //   { "filterType": "dateRange", "startDate": "09-08-2023", "endDate": "09-12-2023", "field": "birthday" },
  //   { "filterType": "dateSpecific", "value": "09-08-2023", "field": "birthday" },
  //   { "filterType": "number", "value": "10", "operator": ">", "field": "score_sisben" },
  //   { "filterType": "string", "value": "pablo", "field": "first_name" },
  // ]
    try {
        const options:[]=req.body.options;
        if(options.length ===0 ){
            return res.status(404).json({
                data:[]
            });
        }
        const modelFilterResult =await  mutil.getFilteredDocument(Model,options);
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
        const getAllModel = await mutil.getTunnedDocument(Beneficiary, ['eps', 'association'], page, perPage, searchOptions)
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