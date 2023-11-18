// reports.ts Controller
import Event from "../models/event";
import Beneficiary  from "../models/beneficiary";
import * as excelCreator from "../services/xlsxCreator"


  const generateReportAssistance = async (event_id) => {

    const eventFound = await Event.findById(event_id).populate(
        {
            path: 'attendees', populate: {path: 'community association activity'},
        }
      );  

      const attendees = eventFound.toObject().attendees;
      const listKey = Object.keys(Beneficiary.schema.paths);
      const excel = await excelCreator.createExcel(listKey, listKey, attendees);

      return excel;

  }

   const generateReportDelivery= async (event_id) => {}
   const generateReportWorkshops= async (event_id) => {}
   const generateReportRatings= async (event_id) => {}
   const generateReportActivities= async (event_id) => {}

  
  
  export const generateReports= async (req, res, next)=> {
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

    try{
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
    }catch(error){
      console.error('Error al generar el archivo Excel:', error);
      res.status(500).send('Error interno del servidor');
    }
  }
  

  export enum REPORT_TYPE {
    ASSISTANCE = 'EVENT_ASSISTANCE',
    DELIVERY = 'EVENT_DELIVERY',
    WORKSHOPS = 'EVENT_WORKSHOPS',
    RATINGS = 'EVENT_RATINGS',
    ACTIVITIES = 'EVENT_ACTIVITIES',
  };
  
  export const CHART_FACTORY_DICTIONARY = {
    [REPORT_TYPE.ASSISTANCE]: generateReportAssistance,
    [REPORT_TYPE.DELIVERY]: generateReportDelivery,
    [REPORT_TYPE.WORKSHOPS]: generateReportWorkshops,
    [REPORT_TYPE.RATINGS]: generateReportRatings,
    [REPORT_TYPE.ACTIVITIES]: generateReportActivities,
  };