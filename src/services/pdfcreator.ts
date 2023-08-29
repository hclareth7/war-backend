import express from 'express';
import PDFDocument from 'pdfkit-table';

const router = express.Router();

/* GET home page. */
export const createPDf = async function (req, res, next) {
  const fs = require("fs");
   // Datos de ejemplo (puedes obtener estos datos desde una base de datos)
   const attendanceData = [
    // ... más datos ...
  ];

  // Company Name
  const companyName = 'CONSORCIO PARA LA ATENCION INTEGRAL Y PSICOSOCIAL DEL ADULTO MAYOR';
  // path image 
  const pathImage = ''
  // Title document
  const titleDocument = 'Lista de Valores de Fisioterapia'
  // start date
  const starDate = '2023-08-01'
  // end Date
  const endDate = '2023-08-31'
  // Encabezados de la tabla
  const tableHeaders = ['Nombre', 'Cedula', 'Asociación', 'Taller', 'Fecha'];

  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  doc.pipe(fs.createWriteStream("./attendance_list.pdf"));

  doc.image(pathImage, 60,30,{width: 100 })
 
  doc.font('Helvetica').fontSize(13).text(companyName, 150, 60,{
    width: 310, 
    align: 'center' }
    );
  
    doc.moveDown(4)
  doc.font('Helvetica').fontSize(14).text(titleDocument, 50, 150 ,{ align: 'center' });

    // Datos adicionales
    const additionalData = [
      { title: 'Desde:', value: starDate },
      { title: 'Hasta:', value: endDate },
      { title: 'Total:', value: `${attendanceData.length}` },
    ];
  
  const pageWidth = doc.page.width;
  const spacing = 20; // Espacio entre los textos
  const textWidth = (pageWidth - 4 * spacing) / 3; // Ancho de cada texto

  
    additionalData.forEach((data, index) => {
      const xPos = index * (textWidth + spacing) + spacing * 2; // Calcular posición X
      const yPos = 200;
      doc.font('Helvetica-Bold').fontSize(12).text(data.title, xPos+50, yPos, { width: textWidth});
      doc.font('Helvetica').fontSize(12).text(data.value, xPos+50, yPos+ 20, { width: textWidth});
    });
  
  const table = { 
    title: '',
    headers: tableHeaders,
    datas: [ /* complex data */ ],
    rows: attendanceData,
  };

  
  doc.moveDown(3).font('Helvetica-Bold').fontSize(12);
  doc.table(table, {
    x: 30,
    y: 260, 
    columnSpacing: 10,
    divider: {
    header: { disabled: true, width: 2, opacity: 1 },
    horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
  },
    prepareHeader: () => doc.font('Helvetica-Bold'),
    prepareRow: (row, i) => doc.font('Helvetica').fontSize(10),
  });

  doc.pipe(res);
  doc.end();
};


