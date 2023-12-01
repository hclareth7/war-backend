import Model from '../models/activity';
import * as pdf from '../services/pdfcreator';
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';
import Beneficiary from '../models/beneficiary';

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

export const pdfActivityAssistance=async (req, res, next)=>{
    try {
        const act_id=req.params.id;
        const activity=await Model.findOne({_id:act_id});
        const assistList = await Beneficiary.find({ activity:act_id })
        .populate(['community', 'association', 'activity']);
        if(activity){
            const totalAssistances=assistList.length;
            const configFilePdf=config.CONFIGS.configFilePdf;
            const data =await mutil.jsonDataConvertToArray(assistList,configFilePdf.propertiesAttendeesActivityPdf);
            pdf.generateFilePdf(
            res,
            null,
            {
                directionLogo: configFilePdf.logoPdfDirection,
                titleMain: configFilePdf.headerDocument.titleMain,
                titleSecundary:configFilePdf.titleSecundaryListAssitanceActivity+activity?.name.toUpperCase()
            },
            null,
            {
                headers:configFilePdf.headersContentBeforeTableAttendeesActivity,
                values:[activity?.name,mutil.organizeDate(activity?.execution_date,null),totalAssistances]
            },
            {
                headersTable: configFilePdf.headersTableAssistanceActivity,
                valuesTable: data,
            },
            configFilePdf.infoContentFooterPdf
            );
        }
    } catch (error) {
      next(error);
    }
  }

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
        const activities: any = await mutil.getTunnedDocument(Model, ['participatingAssociations.association'], page, perPage, searchOptions);
        const actData = activities.data.map(activity => activity.toObject()); // Convertir a objeto plano
        for (let i = 0; i < activities.data.length; i++) {
            const response = await Beneficiary.find({ activity: activities.data[i]._id });
            actData[i].attending_beneficiary = response.length;
        }
        const finalResponse = {
            currentPage: activities.currentPage,
            itemsPerPage: activities.itemsPerPage,
            totalItems: activities.totalItems,
            totalPages: activities.totalPages,
            data: actData        
        };
        res.status(200).json(finalResponse);
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

