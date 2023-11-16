// eventController.js
import Event from "../models/event";
import Delivery from "../models/delivery";
import * as config from "../config/config";
import * as mutil from "../helpers/modelUtilities";
import Beneficiary from "../models/beneficiary";
import Item from "../models/item";
import mongoose from "mongoose";
import Inventory from "../models/inventory";

const modelName = Event.modelName;
export const save = async (req, res, next) => {
  // #swagger.tags = ['Events']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const data = req.body;
    const newEvent = new Event({ ...data });
    await newEvent.save();
    res.json({ message: "Event created successfully." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  // #swagger.tags = ['Events']
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
      Event,
      [
        "associated_winery",
        "participatingAssociations",
        { path: "participatingAssociations", populate: { path: "community" } },
        "attendees"],
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
  // #swagger.tags = ['Events']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const id = req.params.id;
    const eventFound = await Event.findById(id).populate([
      "associated_winery",
      "participatingAssociations",
      { path: "participatingAssociations", populate: { path: "community" } },
    ]);
    if (!eventFound) {
      return res.status(400).json({ mensaje: "Event not found" });
    }
    res.status(200).json({
      data: eventFound,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  // #swagger.tags = ['Events']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const update = req.body;
    const id = req.params.id;
    const event: any = await Event.findById(id);
    if (update?.attendees?.length > 0) {
        const isAttendee = await event.attendees.some((attendee) => new mongoose.Types.ObjectId(update?.attendees[0]).equals(attendee._id));
        if (isAttendee) {
        return res
          .status(400)
          .json({ mensaje: "The attendee is already register" });
        }

      const defaultProducts = await Item.aggregate([
        {
          $match: {
            isDefault: true,
          },
        },
        {
          $project: {
            item: "$_id",
            amount: 1,
          },
        },
        {
          $addFields: {
            amount: 1,
          },
        },
        {
          $unset: ["_id", "code", "value", "isDefault", "associationItem", "timestamps"],
        },
      ]);
      for (const product of defaultProducts) {
        const inventory = await Inventory.findOne({
          winerie: event.associated_winery,
          item: product.item,
        });
        if (!inventory || inventory.amount < product.amount) {
          return res.status(400).json({ mensaje: `Invalid amount, or item: ${product.item} not found ` });
        }
        const newAmount = inventory.amount - product.amount;
        inventory.amount = newAmount;
        await inventory.save();
      }
      const dataDefaultDelivery = {
        beneficiary: update.attendees[0],
        type: "beneficiary",
        event: event._id,
        itemList: defaultProducts,
        author: res.locals.loggedInUser._id,
      };
      const generatedDefaultDelivery = new Delivery(dataDefaultDelivery);
      generatedDefaultDelivery.save();

      update.attendees = [...event.attendees, ...update.attendees];
    }
    await Event.findByIdAndUpdate(id, update);
    const eventUpdated = await Event.findById(id);

    res.status(200).json({
      data: eventUpdated,
      message: "Event has been updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  // #swagger.tags = ['Events']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const id = req.params.id;
    const updatedModel = await Event.findByIdAndUpdate(id, {
      status: "disabled",
    });
    if (!updatedModel) {
      return res.status(404).json({ error: `${modelName} not found` });
    }
    return res.status(200).json({
      message: "Event has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  // #swagger.tags = ['Events']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const id = req.params.id;
    const eventFound = await Event.findById(id).populate([
      "associated_winery",
      "participatingAssociations",
      "attendees",
    ]);

    if (!eventFound) {
      return next(new Error("Event does not exist"));
    }

    const aggregateOptions = [
      {
        $match: {
          event: eventFound._id,
        },
      },
      {
        $unwind: "$itemList",
      },
      {
        $group: {
          _id: "$itemList.item",
          totalAmount: { $sum: "$itemList.amount" },
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $unwind: "$itemDetails",
      },
    ];


    const numberOfAttendees = eventFound?.attendees.length;
    const aggregateNdelivery =[
      {
        $match: {
          event: eventFound._id
        }
      },
      {
        $unwind: "$itemList"
      },
      {
        $lookup: {
          from: "items", // Reemplaza "items" con el nombre real de tu colección de items
          localField: "itemList.item",
          foreignField: "_id",
          as: "item"
        }
      },
      {
        $match: {
          "item.isDefault": false
        }
      },
      {
        $group: {
          _id: "$_id",
          beneficiary: { $first: "$beneficiary" },
          representant: { $first: "$representant" },
          type: { $first: "$type" },
          event: { $first: "$event" },
          itemList: { $push: "$itemList" },
          author: { $first: "$author" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      }
    ];
    const numberOfDelivery = await (await Delivery.aggregate(aggregateNdelivery)).length;
    const deliveredItems = await Delivery.aggregate(aggregateOptions);
    const result = {
      event: eventFound,
      numberOfAttendees,
      numberOfDelivery,
      deliveredItems
    }


    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
