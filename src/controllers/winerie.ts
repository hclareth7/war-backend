// winerieController.js
import Winerie from '../models/winerie';
import * as config from '../config/config';
import * as mutil from '../helpers/modelUtilities';


export const save = async (req, res, next) => {

    // #swagger.tags = ['Wineries']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
        const data= req.body;
        const {wineries}=config.CONFIGS;
        if(data.type!==wineries.types[1]){
            const newWinerie = new Winerie({...data});
            await newWinerie.save();
            return res.status(201).json({ message: 'Winerie main created successfully.',data:newWinerie })
        }
        const associatedWineryFound=await Winerie.findById(data.associated_winery);
        const inventoryAssociatedWineryFound=associatedWineryFound?.inventory;
        if(inventoryAssociatedWineryFound){
            data.inventory.map(async (dataItem)=>{
            if(dataItem){
                    const itemFound=inventoryAssociatedWineryFound.find((value)=>value.item?._id.toString()===dataItem.item);
                    if(itemFound){
                        const newAmount=itemFound.amount-dataItem.amount;
                        if(dataItem.amount>itemFound.amount){
                            return res.status(201).json({ message: 'Invalid amount.'})
                        }
                        itemFound.amount=newAmount;
                    }
            }
            });
            associatedWineryFound.save();
            const newWinerieSecundary=new Winerie({...data});
            await newWinerieSecundary.save();
            return res.status(201).json({ message: 'Winerie secundary created successfully.',data:newWinerieSecundary });
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Wineries']
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
                searchableFields: config.CONFIGS.searchableFields.winerie
            };
        };
        const getAllModel = await mutil.getTunnedDocument(Winerie, ['inventory.item',"associated_winery"], page, perPage, searchOptions);
        res.status(200).json({
            data: getAllModel
        });
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Wineries']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        const winerie = await Winerie.findById(id).populate(['inventory.item','associated_winery']);
        if (!winerie) {
            return next(new Error('Winerie does not exist'));
        }
        res.status(200).json({
            data: winerie
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['Wineries']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const update = req.body
        const id = req.params.id;
        const winerieUpdated= await Winerie.findByIdAndUpdate(id,update);
        return res.status(200).json({
            data: winerieUpdated,
            message: 'Winerie has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Wineries']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        const winerieFound=await Winerie.findById(id);
        if(!winerieFound){
            return res.status(404).json({
                message: 'Winery not found'
            });
        }
        const {wineries}=config.CONFIGS;
        if(winerieFound && winerieFound?.type===wineries.types[0]){
            await Winerie.deleteMany({type:wineries.types[1],associated_winery:winerieFound._id.toString()});
            await Winerie.findByIdAndDelete(id);
            return res.status(200).json({
                message: 'Winery main has been deleted and also the wineries associated'
            });
        }
        const wineryMainFound=await Winerie.findById(winerieFound?.associated_winery).populate('inventory.item');
        winerieFound?.inventory.map(async (dataItem)=>{
           if(dataItem){
                const itemFound=wineryMainFound?.inventory.find((value)=>value.item?._id.toString()===dataItem.item?._id.toString());
                if(itemFound){
                    const newAmount=itemFound.amount+dataItem.amount;
                    itemFound.amount=newAmount;
                }
           }
        });
        wineryMainFound?.save();
        await Winerie.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Winery secundary has been deleted '
        });
    } catch (error) {
        next(error)
    }
};