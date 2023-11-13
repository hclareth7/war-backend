// eventController.js
import Delivery from "../models/delivery";
import Event from "../models/event";

import Winerie from "../models/winerie";
import * as config from "../config/config";
import * as mutil from "../helpers/modelUtilities";
import { Document } from "mongoose";
import Inventory from "../models/inventory";

export const save = async (req, res, next) => {
  // #swagger.tags = ['Delivery']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Adding new Delivery.',
        schema: { $ref: '#/definitions/delivery' }
    } */

  try {
    const data = req.body;
    data.author = res.locals.loggedInUser._id;

    //if (winerie?.inventory) {
    for (const product of data.itemList) {
      const inventory = await Inventory.findOne({
        winerie: data.associated_winery,
        item: product.item,
      });

      if (!inventory || inventory.amount >= product.amount || product.amount <= 0) {
        return res.status(400).json({ mensaje: "Invalid amount." });
      }

      const newAmount = inventory.amount - product.amount;
      inventory.amount = newAmount;
      await inventory.save();
    }

    res.json({
      message: "Delivery created successfully.",
      //   data: deliverySaved,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  // #swagger.tags = ['Delivery']
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
        searchableFields: config.CONFIGS.searchableFields.events,
      };
    }
    const getAllModel = await mutil.getTunnedDocument(
      Delivery,
      ["beneficiary", "representant", "event", "itemsList", "author"],
      page,
      perPage,
      searchOptions
    );
    res.status(200).json({
      data: getAllModel,
    });
  } catch (error) {
    next(error);
  }
};

export const get = async (req, res, next) => {
  // #swagger.tags = ['Delivery']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const id = req.params.id;
    const deliveryFound = await Delivery.findById(id).populate([
      "beneficiary",
      "representant",
      "event",
      "itemsList",
      "author",
    ]);
    if (!deliveryFound) {
      return next(new Error("Delivery does not exist"));
    }
    res.status(200).json({
      data: deliveryFound,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  // #swagger.tags = ['Delivery']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const update = req.body;
    const id = req.params.id;
    await Delivery.findByIdAndUpdate(id, update);
    const delivery = await Delivery.findById(id);
    res.status(200).json({
      data: delivery,
      message: "Delivery has been updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  // #swagger.tags = ['Delivery']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const id = req.params.id;
    await Delivery.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Event has been deleted",
    });
  } catch (error) {
    next(error);
  }
};
