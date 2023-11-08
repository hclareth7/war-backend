import PDFDocument from "pdfkit";
import * as config from "../config/config";

import * as fs from "fs";
import { typeContentBeforeBody, typeContentFooter, typeHeader, typeTable } from "../types/typesPdf";
import { Response } from "express";

/* GET home page. */
export const createPDf = async function (
  filterCondition,
  data,
  response,
  options = {
    companyName: config.CONFIGS.company.name,
    image: config.CONFIGS.company.logoUrl,
    title: config.CONFIGS.pdfTitle,
  }
) {
  // Datos de ejemplo (puedes obtener estos datos desde una base de datos)

  // Company Name
  const companyName = options.companyName;
  // path image
  const pathImage = options.image;
  // Title document
  const titleDocument = options.title;
  // start date
  const starDate = filterCondition.start;
  // end Date
  const endDate = filterCondition.end;
  // Encabezados de la tabla
  const tableHeaders = filterHeader(data.headers);

  const dataDocument = data.data;

  const doc = new PDFDocument({ margin: 30, size: "A4" });
  doc.pipe(fs.createWriteStream(`./${titleDocument}.pdf`));

  //doc.image(pathImage, 60,30,{width: 100 })

  doc.font("Helvetica").fontSize(13).text(companyName, 150, 60, {
    width: 310,
    align: "center",
  });

  doc.moveDown(4);
  doc
    .font("Helvetica")
    .fontSize(14)
    .text(titleDocument, 50, 150, { align: "center" });

  // Datos adicionales
  const additionalData = [
    { title: "Desde:", value: starDate },
    { title: "Hasta:", value: endDate },
    { title: "Total:", value: `${dataDocument.length}` },
  ];

  const pageWidth = doc.page.width;
  const spacing = 20; // Espacio entre los textos
  const textWidth = (pageWidth - 4 * spacing) / 3; // Ancho de cada texto

  additionalData.forEach((data, index) => {
    const xPos = index * (textWidth + spacing) + spacing * 2; // Calcular posición X
    const yPos = 200;
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(data.title, xPos + 50, yPos, { width: textWidth });
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(data.value, xPos + 50, yPos + 20, { width: textWidth });
  });

  const table = {
    title: "",
    headers: tableHeaders,
    datas: dataDocument,
    rows: [],
  };

  doc.moveDown(3).font("Helvetica-Bold").fontSize(12);
  doc.table(table, {
    x: 30,
    y: 260,
    columnSpacing: 10,
    divider: {
      header: { disabled: true, width: 2, opacity: 1 },
      horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
    },
    prepareHeader: () => doc.font("Helvetica-Bold"),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
  });

  doc.end();
};

const filterHeader = (headers) => {
  return headers.filter((header) => header !== "createAt");
};

const getLogoPdf=(directionImagen:string)=>{
  return fs.readFileSync(directionImagen).toString("base64");
}

const addContentPrevious=(doc:any,x:number,y:number,header?:typeHeader | null)=>{
  doc.fillOpacity(0.8);
  if(header){
    header.directionLogo && doc.image(`data:image/png;base64,${getLogoPdf(header.directionLogo)}`,100,y, {width:50});
    header.textSmall &&  doc.fontSize(6).text(header.textSmall,500,10,{width: 100 });
    y+=30;
    if(header.titleMain){
      doc.font('Helvetica').fontSize(10).text(header.titleMain, 175,y,{ align: 'center',width: 290 });
      y += 70;
    }
    x=30;
  }else{
    y=30;
    x=30;
  }
  return [x,y];
}

const addContentBeforeBody=(doc:any,x:number,y:number,headerPdf?:typeHeader | null,contentAditional?:typeContentBeforeBody | null)=>{
  if(contentAditional){
    const {headers,values}:any=contentAditional;
    [x,y]=addContent(doc,x,y,headers,values);
  }else{
    return [x,y];
  }
  return [x,y]

}

const validateSize=(list:any[])=>{
  if(list.length <= 3 ){
    return true;
  }
  return false;
}

const incrementX=(currentValue:number,value:number)=>{
  currentValue+=value;
  return [currentValue];
}

const addContent=(doc:any,x:number,y:number,headers?:string [] | null ,values?:string[] | null)=>{
  let aux=0;
  if(headers && values){

    if(headers.length < values.length || values.length < headers.length){
      throw new Error("The number of titles and values ​​must be the same");
    }else{
      if(validateSize(headers)){
        x=100;
      }else{
        x=40
        aux=1;
      }
      headers.map((title)=>{
        doc.fillColor("blue").fillOpacity(0.5);
        doc.font('Helvetica-Bold').fontSize(10).text(title,x,y,{width:250});
        aux > 0 ? [x]=incrementX(x,140) : [x]=incrementX(x,170);
        doc.fillColor("black").fillOpacity(0.8);
      });
      y+=20;
      validateSize(values) ? x=100: x=40;
      values.map((value)=>{
        doc.fillColor("black").fillOpacity(0.8);
        doc.font('Helvetica').fontSize(10).text(value,x,y,{width:250});
        aux > 0 ? [x]=incrementX(x,140) : [x]=incrementX(x,170);
      });
    }
    y+=50;
    x=30;
    return [x,y];

  }else if(headers){
    validateSize(headers) ? x=85: x=15;
    headers.map((title)=>{
      doc.fillColor("blue").fillOpacity(0.5);
      doc.font('Helvetica-Bold').fontSize(12).text(title,x,y,{width:300});
      aux > 0 ? [x]=incrementX(x,100) : x+=200;
      doc.fillColor("black").fillOpacity(0.8);
    });

    y+=40;
    x=30;
  return [x,y];

  }else if(values){
    validateSize(values) ? x=85: x=40 ; aux=1;
    values.map((value)=>{
      doc.fillColor("black").fillOpacity(0.8);
      doc.font('Helvetica').fontSize(12).text(value,x,y,{width:300});
      aux > 0 ? [x]=incrementX(x,100) : x+=200;
    });
    y+=40;
    x=30;
    return [x,y];
  }else{
    return [x,y];
  }
}

const addHeadersTable=(doc:any,x:number,y:number,headers?:string[] | null)=>{
  headers?.map((header,index)=>{
    if(index===1){
      x=65;
      doc.fontSize(10).font('Helvetica-Bold').fillColor("black").text(header, x , y,{width:80});
    }else{
      doc.fontSize(10).font('Helvetica-Bold').fillColor("black").text(header, x , y,{width:85});
    }
    x+=97;
  });
  x=30;

  return [x,y]
}

const addContentBody=(doc:any,x:number,y:number,headerPdf?:typeHeader | null,contentFooter?:typeContentFooter | null,bodyTable?:typeTable | null)=>{
  if(bodyTable){
    const {headersTable,valuesTable}=bodyTable;
    if(headersTable && valuesTable){
      let aux=0;
      let amountRegisterByPage=0;
      [x,y]=addHeadersTable(doc,x,y,headersTable);
      valuesTable.map((item)=>{
        y+=45;
        item.map((value,index)=>{
          if(index===1){
            x=65;
            doc.fontSize(8.5).font('Helvetica').fillColor("black").text(value, x , y,{width:80});
          }else{
            if(index===item.length-1){
              doc.fontSize(8.5).font('Helvetica').fillColor("black").text(value, x , y,{width:70});
            }else{
              doc.fontSize(8.5).font('Helvetica').fillColor("black").text(typeof value === "string" ? value.toUpperCase():value , x , y,{width:85});
            }
          }
          x+=97;
        });
        amountRegisterByPage++;

        x=30;
        if(amountRegisterByPage > 7 && aux===0 ){
          [x,y]=addNextPage(doc,x,y,headerPdf,headersTable,contentFooter);
          aux++;
          amountRegisterByPage=0;
        }
        else if(amountRegisterByPage > 9 && aux > 0 ){
          [x,y]=addNextPage(doc,x,y,headerPdf,headersTable,contentFooter);
          amountRegisterByPage=0;
        }
      });

    }
    return [x,y];
  }else{
    return [x,y];
  }
}

const addNextPage=(doc:any,x:number,y:number,headerPdf?:typeHeader | null,headersTable?:string[],contentFooter?:typeContentFooter | null)=>{
  doc.addPage();
  x=30;
  y=30;
  [x,y]=addContentPrevious(doc,x,y,headerPdf);
  [x,y]=addHeadersTable(doc,x,y,headersTable);
  addContentFooter(doc,x,y,contentFooter);
  return [x,y];
}

const addContentFooter=(doc:any,x:number,y:number,contentFooter?:typeContentFooter | null)=>{
  if(contentFooter){
    const {content,aditional}=contentFooter;
    if(content){
      y=680;
      x=80;
      content.map((item)=>{
        doc.fontSize(7).font('Helvetica-Bold').fillColor("black").text(item.title, x , y);
        if(item.info){
          y+=10;
          item.info.map((valueInfo)=>{
            doc.fontSize(6).font('Helvetica').fillColor("black").text(valueInfo, x , y);
            y+=10
          });
        }
        y=680;
        x+=180;
      });
      if(aditional){
        aditional.map((data)=>{
          doc.fontSize(6).font('Helvetica').fillColor("black").text(data, x , y);
          y+=10
        });
      }
    }
  }
  x=30;
  y=30;
  return [x,y]
}

const nameDocument = (name?:string | null) => {
  const regex = /\.pdf$/i;
  if (name===null || name===undefined ) {
    return "qualty-document.pdf";
  } else if (name.length === 0) {
    return "qualty-documento.pdf";
  } else if (name.endsWith(".pdf".toLowerCase())) {
    if (regex.test(name)) {
      return name;
    } else {
      throw new Error("Not is name valid");
    }
  } else {
    name=`${name}.pdf`;
    if (regex.test(name)) {
      return name;
    } else {
      throw new Error("Not is name valid");
    }
  }
};

export const generateFilePdf=(
    res:Response,
    nameFile:string | null | undefined,
    headerPdf?:typeHeader | null,
    titleAditional?:string | null,
    contentBeforeBodyPdf?:typeContentBeforeBody | null,
    bodyTablePdf?:typeTable | null,
    contentFooter?:typeContentFooter | null
  )=>{
    const doc = new PDFDocument();
    doc.pipe(res);

  doc.fillOpacity(0.8);
  let x = 30;
  let y = 30;
  
  [x,y]=addContentPrevious(doc,x,y,headerPdf);
  titleAditional !==null?  doc.fontSize(11).font('Helvetica').fillColor("black").text(titleAditional, 175 , y,{ align: 'center',width: 290}):"";
  titleAditional !==null? y+=60 :"";

  [x,y]=addContentBeforeBody(doc,x,y,headerPdf,contentBeforeBodyPdf);

  addContentFooter(doc,x,y,contentFooter);
  [x,y]=addContentBody(doc,x,y,headerPdf,contentFooter,bodyTablePdf);

  doc.end();

}
