// reports.ts Controller
import Event from "../models/event";
import Beneficiary from "../models/beneficiary";
import * as excelCreator from "../services/xlsxCreator"
import * as config from '../config/config';
import mongoose from "mongoose";
import Activity from "../models/activity";
import Delivery from "../models/delivery";
import Item from "../models/item";


const generateReportEventAssistance = async (configObject) => {
  const { event_id } = configObject;
  const eventFound = await Event.findById(event_id).populate(
    {
      path: 'attendees', populate: [
        { path: 'community', select: '-_id name' },
        { path: 'association', select: '-_id name' },
        { path: 'activity', select: '-_id name' },
        { path: 'author', select: '-_id name' }],
    }
  );

  const aggregateNdelivery = [
    {
      $match: {
        event: eventFound._id,
        $or: [
          { status: 'enabled' },
          { status: { $exists: false } }
        ]
      }
    },
    {
      $unwind: "$itemList"
    },
    {
      $lookup: {
        from: "items",
        localField: "itemList.item",
        foreignField: "_id",
        as: "item"
      }
    },
    {
      $unwind: "$item"
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
        updatedAt: { $first: "$updatedAt" },
        beneficiaryDetails: { $first: "$beneficiaryDetails" }, // Puedes agregar más campos si es necesario
        itemListDetails: { $push: "$item" } // Puedes agregar más campos si es necesario
      }
    }
  ];

  const allItems = await Item.find({
    $or: [
      { associationItem: false },
      { associationItem: { $exists: false } }
    ]
  });
  const eventDeliveries = await Delivery.aggregate(aggregateNdelivery);
  const attendees = eventFound.toObject().attendees;
  let newInfo: any = {};
  const newHeads = allItems.map(item => item.name);
  const newKeys = allItems.map(item => item._id.toString());
  const finalAttends = attendees.map(attend => {
    newInfo = {};
    const attendDevs: any = eventDeliveries.filter(dev => dev.beneficiary,toString() === attend._id.toString());
    let attendItems: any = [];
    if ( attendDevs && attendDevs.length > 0) {
      attendDevs.forEach(aDev => {
        const devItems: any = aDev.itemList.map(item => item.item.toString());
        attendItems = [...attendItems, ...devItems];
      });
    }
    allItems.forEach(item => {
      newInfo = {
        ...newInfo,
        [item._id]: attendItems.includes(item._id.toString()) ? "ENTREGADO" : "NO ENTREGADO" 
      }
    })
    return {...attend, ...newInfo};
  });

  const confiAssistance = config.CONFIGS.reportColumNames.beneficiary;
  const listKey = Object.keys(confiAssistance);
  const columNames = Object.values(confiAssistance);
  const excel = await excelCreator.createExcel([...columNames, ...newHeads], [...listKey, ...newKeys], finalAttends);

  return excel;
}

const generateReportActivityAssistance = async (configObject) => {
  const { act_id } = configObject; 
  const assistList = await Beneficiary.find({ activity: new mongoose.Types.ObjectId(act_id) })
    .populate(['community', 'association', 'activity', 'author']);
  const confiAssistance = config.CONFIGS.reportColumNames.beneficiary;
  const listKey = Object.keys(confiAssistance);
  const columNames = Object.values(confiAssistance);
  const excel = await excelCreator.createExcel(columNames, listKey, assistList);

  return excel;
}

const generateReportBeneficiaryList = async (_) => {
  const benList = await Beneficiary.find().populate(['community', 'association', 'activity', 'author']);
  const beneficiaryConfig = config.CONFIGS.reportColumNames.beneficiary;
  const listKey = Object.keys(beneficiaryConfig);
  const columNames = Object.values(beneficiaryConfig);
  const excel = await excelCreator.createExcel(columNames, listKey, benList);

  return excel;
}

const generateReportWithoutSupports = async (_) => {
  const benList = await Beneficiary.find({
    $or: [
      { photo_url: { $exists: false } },
      { footprint_url: { $exists: false } },
      { id_front: { $exists: false } },
      { id_back: { $exists: false } },
      { fosiga_url: { $exists: false } },
      { sisben_url: { $exists: false } },
      { registry_doc_url: { $exists: false } },
    ],
  }).populate(['community', 'association', 'activity', 'author']);

  const beneficiaryConfig = config.CONFIGS.reportColumNames.benWithSupports;
  const listKey = Object.keys(beneficiaryConfig);
  const columNames = Object.values(beneficiaryConfig);
  const excel = await excelCreator.createExcel(columNames, listKey, benList);

  return excel;
}

const generateReportActivityEvent = async (configObject) => {
  const { act_id, event_id } = configObject; 
  const assistList = await Beneficiary.find({ activity: new mongoose.Types.ObjectId(act_id) })
    .populate(['community', 'association', 'activity', 'author']);
  
  const eventFound = await Event.findById(event_id).populate(
    {
      path: 'attendees', populate: [
        { path: 'community', select: '-_id name' },
        { path: 'association', select: '-_id name' },
        { path: 'activity', select: '-_id name' },
        { path: 'author', select: '-_id name' }],
    }
  );
  const attendees = eventFound.toObject().attendees;
  const differenceList = assistList.filter(item => !attendees.some(elemt => elemt._id.toString() === item._id.toString()));
  const confiAssistance = config.CONFIGS.reportColumNames.beneficiary;
  const listKey = Object.keys(confiAssistance);
  const columNames = Object.values(confiAssistance);
  const excel = await excelCreator.createExcel(columNames, listKey, differenceList);

  return excel;
}

const generateReportActivities = async(configObject) => {
  const { startDate, endDate } = configObject;
  const dataFilter = {
    execution_date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
    },
  }
  const activities = await Activity.find(dataFilter);
  const actData = activities;
  for (let i = 0; i < activities.length; i++) {
    const response = await Beneficiary.find({ activity: activities[i]._id });
    actData[i].attending_beneficiary = response.length;
  }
  const configActivities = config.CONFIGS.reportColumNames.activities;
  const listKey = Object.keys(configActivities);
  const columNames = Object.values(configActivities);
  const excel = await excelCreator.createExcel(columNames, listKey, actData);

  return excel;
}

export const generateReports = async (req, res, next) => {
  // #swagger.tags = ['Reports']
  /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Generate new excel',
                schema: { $ref: '#/definitions/report' }
    }
     */

  try {
    const data = req.body;
    const { type, configObject } = data;
    const reportMethod = CHART_FACTORY_DICTIONARY[type];
    const response = await reportMethod(configObject);

    // Configurar la respuesta HTTP
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=excel.xlsx');

    response.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    res.status(500).send('Error interno del servidor');
  }
}


export const enum REPORT_TYPE {
  EVENT_ASSISTANCE = 'EVENT_ASSISTANCE',
  DELIVERY_ACT = 'DELIVERY_ACT',
  ACTIVITY_ASSISTANCE = 'ACTIVITY_ASSISTANCE',
  WORKSHOPS_LIST = 'WORKSHOPS_LIST',
  RATINGS_LIST = 'RATINGS_LIST',
  DELIVERY_LIST = 'DELIVERY_LIST',
  ACTIVITY_LIST = 'ACTIVITY_LIST',
  WORKSHOP_DETAIL = 'WORKSHOP_DETAIL',
  RATINGS_DETAIL = 'RATINGS_DETAIL',
  EVENT_ASSISTANCE_BY_ASSOCIATION = 'EVENT_ASSISTANCE_BY_ASSOCIATION',
  ACTIVITY_ASSISTANCE_BY_ASSOCIATION = 'ACTIVITY_ASSISTANCE_BY_ASSOCIATION',
  BENEFICIARY_LIST = 'BENEFICIARY_LIST',
  WITHOUT_SUPPORTS = 'WITHOUT_SUPPORTS',
  BENEFICIARY_SUMMARY = 'BENEFICIARY_SUMMARY',
  RATINGS_SUMMARY = 'RATINGS_SUMMARY',
  GENERAL_RATINGS_SUMMARY = 'GENERAL_RATINGS_SUMMARY',
  WORKSHOPS_SUMMARY = 'WORKSHOPS_SUMMARY',
  GENERAL_WORKSHOPS_SUMMARY = 'GENERAL_WORKSHOPS_SUMMARY',
  EVENT_SUMMARY = 'EVENT_SUMMARY',
  EVENT_ASSISTANCE_DIFF = 'EVENT_ASSISTANCE_DIFF',
  BENEFICIARIES_BY_USER = "BENEFICIARIES_BY_USER",
  ACTIVITIES_LIST = "ACTIVITIES_LIST",
}

export const CHART_FACTORY_DICTIONARY = {
  [REPORT_TYPE.EVENT_ASSISTANCE]: generateReportEventAssistance,
  [REPORT_TYPE.ACTIVITY_ASSISTANCE]: generateReportActivityAssistance,
  [REPORT_TYPE.BENEFICIARY_LIST]: generateReportBeneficiaryList,
  [REPORT_TYPE.WITHOUT_SUPPORTS]: generateReportWithoutSupports,
  [REPORT_TYPE.EVENT_ASSISTANCE_DIFF]: generateReportActivityEvent,
  [REPORT_TYPE.ACTIVITIES_LIST]: generateReportActivities,
};