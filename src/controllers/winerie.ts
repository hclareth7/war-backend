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

export const deleteItemWinerieInventary=async (req, res, next)=>{
    try{
        const {idWinerie,idItem}=req.params;
        const {wineries}=config.CONFIGS;
        const winerieFound=await Winerie.findById(idWinerie).populate('inventory.item','associated_winery');
        if(winerieFound && winerieFound?.type===wineries.types[0]){
            const valueFound=winerieFound?.inventory.find((dataItem)=>dataItem?.item?._id.toString()===idItem);
            if(valueFound){
               await  Winerie.updateOne(
                    {_id:winerieFound._id}, 
                    { $pull: { inventory: {item: valueFound?.item?._id} } }
                );
               await  Winerie.updateMany(
                    {associated_winery:winerieFound._id,type:wineries.types[1]}, 
                    { $pull: { inventory: {item: valueFound?.item?._id} } }
                );
            }else{
                return next(new Error('Item does not exist'));
            }
            return res.status(200).json({message:"Item removed from inventory main"})
        }
        const winerieMainFound=await Winerie.findById(winerieFound?.associated_winery).populate('inventory.item','associated_winery');
        const valueItemWinerieMainFound=winerieMainFound?.inventory.find((dataItem)=>dataItem?.item?._id.toString()===idItem);
        const valueItemWinerieFound=winerieFound?.inventory.find((dataItem)=>dataItem?.item?._id.toString()===idItem);
        if(!winerieFound){
            return next(new Error('Winerie does not exist'));
        }
        if(valueItemWinerieMainFound && valueItemWinerieFound){
            const restoredAmount=valueItemWinerieMainFound?.amount+valueItemWinerieFound?.amount;
            valueItemWinerieMainFound.amount=restoredAmount;
            winerieMainFound?.save();
            await  Winerie.updateOne({_id:winerieFound._id}, { $pull: { inventory: {item: valueItemWinerieFound?.item?._id} } });
            return res.status(200).json({message:"Item removed from inventory secundary"})
        }
        return res.status(200).json({message:"Could not remove item from secondary inventory"})
    }catch(error){
        next(error);
    }
}

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
        const winerie = await Winerie.findById(id).populate(['inventory.item','associated_winery.inventory.item']);
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
        const update = req.body;
        const {wineries}=config.CONFIGS;
        const id = req.params.id;
        const winerieFound=await Winerie.findById(id);
        if(winerieFound?.type===wineries.types[0]){
            await Winerie.findByIdAndUpdate(id,update);
            const winerieUpdated=await Winerie.findById(id);
            return res.status(200).json({
                data: winerieUpdated,
                message: 'Winerie has been updated'
            });
        }
        const idWinerieMain=update.winerie.associated_winery._id;
        await Winerie.updateOne({_id:idWinerieMain},{$set:{inventory:update.inventoryWinerieMain}});
        await Winerie.findByIdAndUpdate(id,update.winerie);
        return res.status(200).json({
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