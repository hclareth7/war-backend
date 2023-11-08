import { filterByDateRangeAndString, jsonDataConvertToArray } from '../helpers/modelUtilities';
import Model from '../models/rating';
import Permisions from '../models/permissions';
import * as pdf from '../services/pdfcreator';
import * as config from '../config/config';


const modelName = Model.modelName;

export const generateFilePdf=async (req,res,next)=>{
    try{
        const arrayData:any[]=[];
        const {startDate,endDate,valueTypeRating}=req.body;
        const filter=startDate!==undefined && endDate!==undefined ? filterByDateRangeAndString("createdAt",startDate,endDate,"rating_type",valueTypeRating): {"_id": { $eq: req.query.queryString }};
        const getAllModel=await Model.find(filter).populate(['attendee','author']);
        const {configFilePdf}=config.CONFIGS;
        getAllModel.map((itemModel:any)=>{
            if(itemModel.attendee && itemModel?.author){
                arrayData.push({...itemModel.attendee._doc,author_name:itemModel?.author?.name});
            }
        });
        const dataRaitingsPdf=await jsonDataConvertToArray(arrayData,configFilePdf.propertiesRatingsPdf);
        if(dataRaitingsPdf.length > 0){
            if(dataRaitingsPdf.length===0){
                return next(new Error("There are no records"));
            }
            pdf.generateFilePdf(res,null,
                {
                    logo:configFilePdf.logoPdf,
                    titleMain:configFilePdf.titleMainRatingsPdf
                },
                `${valueTypeRating !== 'otros' ? 'LISTADO DE VALORACIONES DE '+ valueTypeRating.toUpperCase(): 'LISTADO DE OTROS TIPOS DE VALORACIONES'}`,
                {
                    headers:startDate && endDate ? configFilePdf.headersContentBeforeTableRetings : [],
                    values:startDate && endDate ? [startDate,endDate,dataRaitingsPdf.length] : []
                },
                {
                    headersTable:configFilePdf.headersTableRetings,
                    valuesTable:dataRaitingsPdf
                },
                configFilePdf.infoContentFooterPdf
            );
        }else{
            return next(new Error("There are no records"));
        }
        
    }catch(error){
        next(error);
    }
}

export const save = async (req, res, next) => {
    // #swagger.tags = ['Rating']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new rating.',
                schema: { $ref: '#/definitions/rating' }
    } */
    try {
        const bodydata = req.body;
        bodydata.author = res.locals.loggedInUser._id;
        const saveModel = new Model(bodydata);
        await saveModel.save();
        const data = { 'message': `${modelName} successfully created`, 'data': saveModel };
        res.json(data);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Rating']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const userLogged=res.locals.loggedInUser;
        const rolUser=await Permisions.findOne({_id:userLogged.role.toString()});
        const id=userLogged._id.toString();
        const condition=rolUser?.role !=="Super Admin" && rolUser?.role !=="admin" ? {author:id}:{};
        const getAllModel = await Model.find(condition).populate(['attendee','author']);
        res.status(200).json({
            data: getAllModel
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Rating']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const id = req.params.id;
        const getModel = await Model.findById(id).populate(['attendee','author']);
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
    // #swagger.tags = ['Rating']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        let update = req.body;
        const id = req.params.id;
        const actualModel = await Model.findById(id);
        update = { ...update, attendees: new Set([...update.attendee, ...(actualModel?.attendee as any)]) }
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
    // #swagger.tags = ['Rating']
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
    // #swagger.tags = ['Rating']
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

