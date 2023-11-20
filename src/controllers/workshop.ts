import Model from "../models/workshop";
import * as pdf from "../services/pdfcreator";
import * as config from "../config/config";
import {
  jsonDataConvertToArray,
  organizeDate,
} from "../helpers/modelUtilities";
import Permisions from "../models/permissions";
import * as mutil from '../helpers/modelUtilities';


const modelName = Model.modelName;

export const save = async (req, res, next) => {
  // #swagger.tags = ['Workshop']
  /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new workshop.',
                schema: { $ref: '#/definitions/workshop' }
    } */
  try {
    const bodydata = req.body;
    bodydata.author = res.locals.loggedInUser._id;
    const saveModel = new Model(bodydata);
    await saveModel.save();
    const data = {
      message: `${modelName} successfully created`,
      data: saveModel,
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  // #swagger.tags = ['Workshop']
  /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
  try {
    const userLogged = res.locals.loggedInUser;

    const rolUser: any = await Permisions.findOne({
      _id: userLogged.role.toString(),
    });

    let condition = {};
    !config.CONFIGS.specialRoles.includes(rolUser?.role)
      ? (condition = { author: userLogged._id })
      : (condition = {});

      const page = req.query.page
        const perPage = req.query.perPage
        let searchOptions = { queryString: "",
        searchableFields: config.CONFIGS.searchableFields.workshop,
          isLoggedUser: condition};

        if (req.query.queryString) {
            searchOptions = {
                queryString: req.query.queryString,
                searchableFields: config.CONFIGS.searchableFields.workshop,
                isLoggedUser: condition
            };
        };

    const getAllModel = await mutil.getTunnedDocument(Model, ["activity","attendees","author",], page, perPage, searchOptions);
    /*Model.find(condition).populate([
      "activity",
      "attendees",
      "author",
    ]).sort({ createdAt: -1 });*/

    res.status(200).json(getAllModel);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const get = async (req, res, next) => {
  // #swagger.tags = ['Workshop']
  /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
  try {
    const id = req.params.id;
    const getModel = await Model.findById(id).populate([
      "activity",
      "attendees",
      "author",
    ]);
    if (!getModel) {
      return next(new Error(`${modelName} does not exist`));
    }
    res.status(200).json({
      data: getModel,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  // #swagger.tags = ['Workshop']
  /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
  try {
    let update = req.body;
    const id = req.params.id;

    await Model.findByIdAndUpdate(id, update);
    const updatedModel = await Model.findById(id);
    res.status(200).json({
      data: updatedModel,
      message: `${modelName} has been updated`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  // #swagger.tags = ['Workshop']
  /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
  try {
    const id = req.params.id;
    await Model.findByIdAndDelete(id);
    res.status(200).json({
      data: null,
      message: `${modelName} has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

export const generateFilePdf = async (req, res, next) => {
  try {
    const idWorkShop = req.params.id;
    const { configFilePdf } = config.CONFIGS;
    const getModel = await Model.findById(idWorkShop).populate([
      "activity",
      "attendees",
      "author",
    ]);
    const act = getModel?.activity;
    const dataTablePdf = await jsonDataConvertToArray(
      getModel?.attendees,
      configFilePdf.propertiesAttendeesPdf
    );
    if (dataTablePdf.length === 0) {
      return next(new Error("There are no records"));
    }
    pdf.generateFilePdf(
      res,
      null,
      {
        directionLogo: configFilePdf.logoPdfDirection,
        titleMain: `LISTADO DE ASISTENTES AL TALLER ${getModel?.name.toUpperCase()}`,
      },
      null,
      {
        headers: configFilePdf.headersContentBeforeTableAttendees,
        values: [
          act?.toJSON()["name"],
          organizeDate(getModel?.toJSON()["execution_date"], null),
          dataTablePdf.length,
        ],
      },
      {
        headersTable: configFilePdf.headersTableAttendees,
        valuesTable: dataTablePdf,
      },
      configFilePdf.infoContentFooterPdf
    );
  } catch (error) {
    next(error);
  }
};

export const generatePdf = async (req, res, next) => {
  // #swagger.tags = ['Workshop']
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
      data: activities,
    };
    const filterCondition = { start: starDate, end: endDate };
    pdf.createPDf(filterCondition, data, res);

    res.status(200).json({
      message: `successfully`,
    });
  } catch (error) {
    console.log(error);
  }
};