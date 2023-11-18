// reports.ts Controller
import Event from "../models/event";
import Beneficiary from "../models/beneficiary";
import * as excelCreator from "../services/xlsxCreator"


const generateReportAssistance = async (event_id) => {

  const eventFound = await Event.findById(event_id).populate(
    {
      path: 'attendees', populate: [
        { path: 'community', select: '-_id name' },
        { path: 'association', select: '-_id name' },
        { path: 'activity', select: '-_id name' }],
    }
  );

  const attendees = eventFound.toObject().attendees;
  const listKey = Object.keys(Beneficiary.schema.paths);
  const excel = await excelCreator.createExcel(listKey, listKey, attendees);

  return excel;

}

const generateReportDelivery = async (event_id) => { }
const generateReportWorkshops = async (event_id) => { }
const generateReportRatings = async (event_id) => { }
const generateReportActivities = async (event_id) => { }



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
    const { type, event_id } = data;
    const reportMethod = CHART_FACTORY_DICTIONARY[type];
    const response = await reportMethod(event_id);

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


export enum REPORT_TYPE {
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
};

export const CHART_FACTORY_DICTIONARY = {
  [REPORT_TYPE.EVENT_ASSISTANCE]: generateReportAssistance,
  [REPORT_TYPE.DELIVERY_ACT]: generateReportDelivery,
  [REPORT_TYPE.ACTIVITY_ASSISTANCE]: generateReportWorkshops,
  [REPORT_TYPE.WORKSHOPS_LIST]: generateReportRatings,
  [REPORT_TYPE.RATINGS_LIST]: generateReportActivities,
};