// winerieController.js
import Winerie from "../models/winerie";
import Inventory from "../models/inventory";
import { Document } from "mongoose";

import * as config from "../config/config";
import * as mutil from "../helpers/modelUtilities";

export const save = async (req, res, next) => {
  // #swagger.tags = ['Wineries']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const data = req.body;
    const { wineries } = config.CONFIGS;

    const winerie = {
      name: data.name,
      type: data.type,
      associated_winery: data.associated_winery,
    };

    const newWinerie = new Winerie({ ...winerie });
    await newWinerie.save();
    let winerie_id = newWinerie._id;

    //if the winerie is main type
    if (data.type == wineries.types[0]) {
      for (const item of data.inventory) {
        item.winerie = winerie_id;
        const inventory = new Inventory(item);
        await inventory.save();
      }
      return res.status(201).json({
        message: "Winerie main created successfully.",
        data: newWinerie,
      });
    }
    const mainWineryFound = await Winerie.findById({
      _id: data.associated_winery,
    });
    if (mainWineryFound) {
      for (const product of data.inventory) {
        const mainInventory = await Inventory.findOne({
          winerie: mainWineryFound._id,
          item: product.item,
        });
        if (!mainInventory || mainInventory.amount < product.amount) {
          return res.status(400).json({ mensaje: "Invalid amount." });
        }
        const newAmount = mainInventory.amount - product.amount;
        mainInventory.amount = newAmount;
        await mainInventory.save(); //updating main winerie

        product.winerie = winerie_id;
        const newInventory = new Inventory(product);

        await newInventory.save();
      }
      return res.status(201).json({
        message: "Winerie secundary created successfully.",
        data: newWinerie,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteItemWinerieInventary = async (req, res, next) => {
  try {
    const { idWinerie, idItem } = req.params;
    const { wineries } = config.CONFIGS;
    const winerieFound = await Winerie.findById(idWinerie).populate(
      "inventory.item",
      "associated_winery"
    );
    if (winerieFound && winerieFound?.type === wineries.types[0]) {
      // const valueFound=winerieFound?.inventory.find((dataItem)=>dataItem?.item?._id.toString()===idItem);
      // if(valueFound){
      //    await  Winerie.updateOne(
      //         {_id:winerieFound._id},
      //         { $pull: { inventory: {item: valueFound?.item?._id} } }
      //     );
      //    await  Winerie.updateMany(
      //         {associated_winery:winerieFound._id,type:wineries.types[1]},
      //         { $pull: { inventory: {item: valueFound?.item?._id} } }
      //     );
      // }else{
      //     return next(new Error('Item does not exist'));
      // }
      return res
        .status(200)
        .json({ message: "Item removed from inventory main" });
    }
    // const winerieMainFound=await Winerie.findById(winerieFound?.associated_winery).populate('inventory.item','associated_winery');
    // const valueItemWinerieMainFound=winerieMainFound?.inventory.find((dataItem)=>dataItem?.item?._id.toString()===idItem);
    // const valueItemWinerieFound=winerieFound?.inventory.find((dataItem)=>dataItem?.item?._id.toString()===idItem);
    if (!winerieFound) {
      return next(new Error("Winerie does not exist"));
    }
    // if(valueItemWinerieMainFound && valueItemWinerieFound){
    //     // const restoredAmount=valueItemWinerieMainFound?.amount+valueItemWinerieFound?.amount;
    //     // valueItemWinerieMainFound.amount=restoredAmount;
    //     // winerieMainFound?.save();
    //     // await  Winerie.updateOne({_id:winerieFound._id}, { $pull: { inventory: {item: valueItemWinerieFound?.item?._id} } });
    //     // return res.status(200).json({message:"Item removed from inventory secundary"})
    // }
    return res
      .status(200)
      .json({ message: "Could not remove item from secondary inventory" });
  } catch (error) {
    next(error);
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
    const page = req.query.page;
    const perPage = req.query.perPage;
    let searchOptions = {};

    if (req.query.queryString) {
      searchOptions = {
        queryString: req.query.queryString,
        searchableFields: config.CONFIGS.searchableFields.winerie,
      };
    }

    const wineries: any = await mutil.getTunnedDocument(
      Winerie,
      ["associated_winery"],
      page,
      perPage,
      searchOptions
    );


    if (!wineries) {
      return next(new Error("Winerie does not exist"));
    }
    const allData: any[] = [];
    let result: any = {};
    result.currentPage = wineries.wineries;
    result.itemsPerPage = wineries.itemsPerPage;
    result.totalItems = wineries.totalItems;
    result.totalPages = wineries.totalPages;
    console.log(wineries);
    
    for (const winerie of wineries.data) {
      const relatedInventory = await Inventory.find({
        winerie: winerie._id,
      }).populate([
        { path: "winerie", populate: { path: "associated_winery" } },
        "item",
      ]);

      const data = winerie.toObject();
      data.inventory = relatedInventory || [];
      allData.push(data);
    }
    result.data = allData;
    res.status(200).json({ data: result });

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
    const winerie: any = await Winerie.findById(id).populate([
      "associated_winery",
    ]);
    if (!winerie) {
      return next(new Error("Winerie does not exist"));
    }
    const relatedInventory = await Inventory.find({
      winerie: id,
    }).populate([
      { path: "winerie", populate: { path: "associated_winery" } },
      "item",
    ]);

    const data = winerie.toObject();
    data.inventory = relatedInventory || [];

    res.status(200).json({
      data: data,
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
    const data = req.body;
    const { wineries } = config.CONFIGS;

    const id = req.params.id;

    const winerie: any = await Winerie.findById(id).populate([
      "associated_winery",
    ]);

    if (data.type == wineries.types[0]) {
      const idsToDelete = data.winerie.inventory.map((item) => item._id);
      if (idsToDelete.length > 0) {
        return res
          .status(400)
          .json({ mensaje: "You can not remove items from the main winierie" });
      }
      for (const product of data.inventory) {
        const inventory = await Inventory.findOne({
          winerie: winerie._id,
          item: product.item,
        });
        if (inventory) {
          inventory.amount < product.amount
            ? ((inventory.amount = product.amount), await inventory.save())
            : res.status(400).json({ mensaje: "Invalid amount." });
        } else {
          product.winerie = winerie._id;
          const newInventory = new Inventory(product);
          await newInventory.save();
        }
      }

      return res.status(201).json({
        message: "Winerie main updated successfully.",
        data: winerie,
      });
    }

    const idsToDelete = data.winerie.inventory.map((item) => item._id);

    if (idsToDelete.length > 0) {
      const removetItems = await Inventory.find({
        _id: { $nin: idsToDelete },
        winerie: data.winerie._id,
      });
      for (const productToRemove of removetItems) {
        const mainInventory = await Inventory.findOne({
          winerie: data.winerie.associated_winery._id,
          item: productToRemove.item,
        });
        if (mainInventory) {
          const newAmount = mainInventory.amount + productToRemove.amount;
          mainInventory.amount = newAmount;
          await mainInventory.save();
        }
      }
      await Inventory.deleteMany({
        _id: { $nin: idsToDelete },
        winerie: data.winerie._id,
      });
    }

    for (const currentProduct of data.winerie.inventory) {
      const mainInventory = await Inventory.findOne({
        winerie: data.winerie.associated_winery._id,
        item: currentProduct.item._id
      });

      console.log(currentProduct);

      console.log("ID_ITEM: ", currentProduct._id);


      console.log("MAIN", mainInventory);

      const SecondOldProduct = await Inventory.findOne({
        winerie: data.winerie._id,
        item: currentProduct.item._id
      });

      console.log("SECOND", SecondOldProduct);
      /*
      if (mainInventory) {
        if (mainInventory.total >= currentProduct.amount) {
          if (SecondOldProduct) {
            if (SecondOldProduct.amount > currentProduct.amount) {
              //bodInit + (bodSecOld - bodSecNew)
              console.log(mainInventory.amount);
              console.log(SecondOldProduct.amount);
              console.log(currentProduct.amount);

              
              let newAmount = mainInventory.amount + (SecondOldProduct.amount - currentProduct.amount);
              mainInventory.amount = newAmount;
              await mainInventory.save();
            } else if (SecondOldProduct.amount < currentProduct.amount) {
              console.log(mainInventory.amount);
              console.log(SecondOldProduct.amount);
              console.log(currentProduct.amount);
              //bodInit - (bodSecNew - bodSecOld) 
              let newAmount = mainInventory.amount - (currentProduct.amount - SecondOldProduct.amount ); //50 + (- 50) 
              mainInventory.amount = newAmount;
              await mainInventory.save();
            }
            SecondOldProduct.amount = currentProduct.amount;
            await SecondOldProduct.save();
          }else {
            currentProduct.winerie = winerie._id;
            const newInventory = new Inventory(currentProduct);
            await newInventory.save();
          }
        } 
      } 
      */
    }
    return res.status(201).json({
      message: "Winerie secundary updated successfully.",
      data: winerie,
    });
  } catch (error) {
    console.log(error);
    next(error);
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
    const winerieFound = await Winerie.findById(id);
    if (!winerieFound) {
      return res.status(404).json({
        message: "Winery not found",
      });
    }
    const { wineries } = config.CONFIGS;
    if (winerieFound && winerieFound?.type === wineries.types[0]) {
      await Winerie.deleteMany({
        type: wineries.types[1],
        associated_winery: winerieFound._id.toString(),
      });
      await Winerie.findByIdAndDelete(id);
      return res.status(200).json({
        message:
          "Winery main has been deleted and also the wineries associated",
      });
    }

    return res.status(200).json({
      message: "Winery secundary has been deleted ",
    });
  } catch (error) {
    next(error);
  }
};


export const close = async (req, res, next) => {
   // #swagger.tags = ['Wineries']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  const { wineries } = config.CONFIGS;

  const id = req.params.id;
  const winerie: any = await Winerie.findById(id).populate([
    "associated_winery",
  ]);

  if (winerie.type == wineries.types[0]) {
    return res.status(400).json({ mensaje: "You can not close main wineries" });
  }

  const inventory = await Inventory.find({
    winerie: winerie._id,
  });

  for (const product of inventory) {
    const mainInventory = await Inventory.findOne({
      winerie: winerie.associated_winery._id,
      item: product.item?._id
    });

    if (mainInventory) {
      const newAmount = mainInventory.amount + product.amount;
      mainInventory.amount = newAmount;
      await mainInventory.save();
    }
  }

  winerie.status = "disabled";
  winerie.save();
  
  return res.status(201).json({
    message: "Winerie closed successfully.",
    data: winerie,
  });
};