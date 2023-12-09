// eventController.js
import Representant from '../models/representant';
import Delivery from "../models/delivery";
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';
import { generateFilePdfDeliveryRepresentant } from '../services/pdfcreator';


export const getDeliverysPdf=async (req, res, next)=>{
    try {
        const configPdf = config.CONFIGS.configFilePdf;
        const id=req.params.id;
        const idEvent=req.params.idEvent;
        const representantFound=await Representant.findOne({_id:id}).populate([{
            path:"association",
            populate:[{path:"community"}]
        }]);
        if(representantFound){
            const deliverysFound=await Delivery.find({representant:id,event:idEvent}).populate([
                {
                    path:"representant",
                },
                {
                    path:"event",
                },
                {
                    path: "itemList",
                    populate:[{path:"item"}]
                }
            ]);
            const itemListPdf:any[]=[];
            deliverysFound.map((dataItem)=>{
                const {itemList}=dataItem;
                itemList.map((data:any,index:number)=>{
                  const indexItemFound=itemListPdf.findIndex((i)=>i._id===data?.item._id.toString());
                  if(indexItemFound!==-1){
                    itemListPdf[indexItemFound].amount+=itemList[index]?.amount;
                  }else{
                    itemListPdf.push({_id:data?.item?._id.toString(),name:data.item?.name,amount:data?.amount,code:data.item?.code,value:data.item?.value});
                  }
                });
              });
            const event=deliverysFound[0]?.event;
            generateFilePdfDeliveryRepresentant(res,
                {
                    directionLogo: configPdf.logoPdfDirection,
                    titleMain: configPdf.headerDocument.titleMain,
                    infoContract: configPdf.headerDocument.infoContrato,
                    textAditional: configPdf.headerDocument.textAditional
                },
                // representant
                representantFound
                ,
                event,
                itemListPdf,
                configPdf.textDataBeforeFooter,
                {
                    nameAfterSignature: configPdf.infoContentFooterPdf.nameAfterSignature,
                    representantLegal: configPdf.infoContentFooterPdf.representantLegal,
                    replegalprint: configPdf.replegalprint
                },
                {
                    content: configPdf.infoContentFooterPdf.content,
                    titleInfo: configPdf.infoContentFooterPdf.titleInfo,
                }
            );
        }
    } catch (error) {
        next(error);
    }
}

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
