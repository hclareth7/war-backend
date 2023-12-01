import PDFDocument from "pdfkit";
import * as config from "../config/config";

import * as fs from "fs";
import { typeContentBeforeBody, typeContentFooter, typeHeader, typeTable } from "../types/typesPdf";
import { Response } from "express";
import { calculateAge, formatCurrencyNummber } from "../helpers/helper";

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

    // if(headers.length < values.length || values.length < headers.length){
    //   throw new Error("The number of titles and values ​​must be the same");
    // }
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
    y+=50;
    x=30;
    return [x,y];

  }else if(headers){
    validateSize(headers) ? x=85: x=30;
    headers.map((title)=>{
      doc.fillColor("blue").fillOpacity(0.5);
      doc.font('Helvetica-Bold').fontSize(12).text(title,x,y,{width:300});
      aux > 0 ? [x]=incrementX(x,100) : x+=150;
      doc.fillColor("black").fillOpacity(0.8);
    });

    y+=40;
    x=30;
  return [x,y];

  }else if(values){
    validateSize(values) ? x=85: x=30 ; aux=1;
    values.map((value)=>{
      doc.fillColor("black").fillOpacity(0.8);
      doc.font('Helvetica').fontSize(12).text(value,x,y,{});
      aux > 0 ? [x]=incrementX(x,100) : x+=150;
    });
    y+=40;
    x=30;
    return [x,y];
  }else{
    return [x,y];
  }
}

const addHeadersTable=(doc:any,x:number,y:number,headers?:string[] | null)=>{
  const headWidth = headers?.length === 5 ? 120 : 80;
  let delta=0;
  if(headers){
    if(headers?.length === 5){
      delta=120;
    }else if(headers?.length === 6){
      delta =120;
    }else if(headers?.length >= 6 && headers?.length <=8){
      delta =82;
    }
  }
  if(headers && headers?.length>5){
    x=15;
  }
  headers?.map((header,index)=>{
  let widthHeader=0;
    if(header===headers[3]){
      widthHeader=50;
    }else{
      widthHeader=headWidth;
    }
    if(index===1){
      x=46;
      doc.fontSize(10).font('Helvetica-Bold').fillColor("black").text(header, x , y,{width: widthHeader});
    }else{
      doc.fontSize(10).font('Helvetica-Bold').fillColor("black").text(header, x , y,{width: widthHeader + 5});
    }
    
    x+=delta;
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
      const headWidth = headersTable?.length === 5 ? 120 : 80;
      let delta = 0;
      if(headersTable?.length === 5){
        delta=120;
      }else if(headersTable?.length === 6){
        delta =120;
      }else if(headersTable?.length >= 6 && headersTable?.length <=8){
        delta =82;
      }
      [x,y]=addHeadersTable(doc,x,y,headersTable);
      
      valuesTable.map((item)=>{
        y+=45;
        if(item?.length>5){
          x=15;
        }
        item.map((value,index)=>{
          if(index===1){
            x=46;
            doc.fontSize(8.5).font('Helvetica').fillColor("black").text(value, x , y,{width: headWidth});
          }else{
            if(index===item.length-1){
              doc.fontSize(8.5).font('Helvetica').fillColor("black").text(value, x , y,{width: headWidth - 10});
            }else{
              doc.fontSize(8.5).font('Helvetica').fillColor("black").text(typeof value === "string" ? value.toUpperCase():value , x , y,{width: headWidth + 5});
            }
          }
          x+=delta;
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
      y=677;
      x=210;
      content.map((item)=>{
        doc.fontSize(7).font('Helvetica-Bold').fillColor("black").text(item.title, x , y);
        if(item.info){
          y+=11;
          item.info.map((valueInfo,index)=>{
            if(contentFooter.titleInfo){
              doc.fontSize(8).font('Helvetica-Bold').fillColor("black").text(contentFooter.titleInfo[index], x , y);
              x+=(contentFooter.titleInfo[index].length * 5);

              doc.fontSize(8).font('Helvetica').fillColor("black").text(valueInfo, x , y);
              x=210;
              y+=10;
            }
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

export const generateFilePdfListArticles=(
  res:Response,
  nameFile:string | null | undefined,
  headerPdf?:typeHeader | null,
  titleAditional?:string | null,
  contentBeforeBodyPdf?:typeContentBeforeBody | null,
  bodyTablePdf?:any | null,
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
[x,y]=addContentTableListArticles(doc,x,y,bodyTablePdf,headerPdf,contentFooter);

doc.end();

}

const addContentPrevious=(doc:any,x:number,y:number,header?:typeHeader | null)=>{
  doc.fillOpacity(0.8);
  if(header){
    header.directionLogo && doc.image(getImageBase64(convertUrl(null,header.directionLogo)),95,y, {width:50});
    header.textSmall &&  doc.fontSize(6).text(header.textSmall,500,10,{width: 100 });
    y-=10;
    if(header.titleMain ){
      if(header.titleMain.length < 20){
        y+=40;
        doc.font('Helvetica-Bold').fontSize(15).text(header.titleMain, 155,y,{ align: 'center',width: 290 });
        y += 40;
      }else{
        doc.font('Helvetica-Bold').fontSize(10).text(header.titleMain, 155,y,{ align: 'center',width: 290 });
        y += 40;
      }
    }
    if(header.infoContract){
      doc.font('Helvetica').fontSize(8).text(header.infoContract, 165,y,{ align: 'center',width: 290 });
      y += 40;
    }
    x=60;
    if(header.textAditional){
      doc.font('Helvetica').fontSize(8).text(header.textAditional.toUpperCase(), x,y,{ align: 'center'});
      y += 40;
    }else{
      y+=15;
    }
    x=30;

    doc.lineWidth(.3)
   .moveTo(x, y)
   .lineTo(x + 550, y)
   .strokeColor('black')
   .stroke();

   
    if(header && header?.titleSecundary){
      y+=20;
      x=100;
      doc.font('Helvetica').fontSize(12).text(header?.titleSecundary.toUpperCase(), x,y,{ align: 'center'});

    }

    y+=40;
    x=30;
  }else{
    y=30;
    x=30;
  }
  return [x,y];
}

/**
 FILE PDF DELIVERY
 */

const convertUrl=(url,fileName)=>{
  let stringFile="";
  if(fileName){
    stringFile= `${process.env.LS_STATIC_PATH}/${fileName}`;
  }
  if(url){
    const parts=url.split("/");
    stringFile=`${process.env.LS_STATIC_PATH}/${parts[parts.length-1]}`;
  }
  return stringFile;
}

const getImageBase64=(directionImagen:string)=>{
  return  `data:image/png;base64,${fs.readFileSync(directionImagen).toString("base64")}`;
}

const addContentInfoBeneficiarie=(doc:any,x:number,y:number,beneficiary?:any | null, event?:any | null)=>{
  if(beneficiary){
    doc.font('Helvetica-Bold').fontSize(13).text("Acta de entrega - ", x,y,{ align: 'left' });
    y+=2;
    doc.font('Helvetica-Bold').fontSize(9).text(event?.name, 140,y,{ align: 'left' });

    y+=20;
    doc.font('Helvetica-Bold').fontSize(10).text("Información del beneficiario:", x,y,{ align: 'left' });
    y+=20;
    doc.image(getImageBase64(convertUrl(beneficiary?.photo_url,null)),80,y, {width:120, height:100});

    y-=20;
    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text(`${beneficiary?.first_name ? beneficiary?.first_name: ""} ${beneficiary?.second_name ? beneficiary?.second_name: ""} ${beneficiary?.first_last_name ? beneficiary?.first_last_name: ""}  ${beneficiary?.second_last_name ? beneficiary?.second_last_name: ""}`.toUpperCase(), x,y,{ align: 'left',width:200 });
    y+=20;

    doc.font('Helvetica-Bold').fontSize(10).text("Cédula:", x,y,{ align: 'left'});
    x=350;
    doc.font('Helvetica').fontSize(10).text(beneficiary?.identification, x,y,{ align: 'left' });
    y+=20;

    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text("Fecha de nacimiento:", x,y,{ align: 'left'});
    x=420;
    doc.font('Helvetica').fontSize(10).text(beneficiary?.birthday.toISOString().substring(0, 10), x,y,{ align: 'left' });
    y+=20;


    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text("Edad:", x,y,{ align: 'left'});
    x=350;
    doc.font('Helvetica').fontSize(10).text(calculateAge(beneficiary?.birthday), x,y,{ align: 'left' });
    y+=20;

    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text("Municipio:", x,y,{ align: 'left'});
    x=370;
    doc.font('Helvetica').fontSize(10).text(beneficiary?.municipality, x,y,{ align: 'left' });
    y+=20;

    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text("Asociación:", x,y,{ align: 'left'});
    x=370;
    doc.font('Helvetica').fontSize(10).text(beneficiary?.association.name, x,y,{ align: 'left' });
    y+=20;

    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text("SISBEN:", x,y,{ align: 'left'});
    x=360;
    doc.font('Helvetica').fontSize(10).text(beneficiary?.sisben_score, x,y,{ align: 'left' });
    y+=20;

    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text("ADRES:", x,y,{ align: 'left'});
    x=350;
    doc.font('Helvetica').fontSize(10).text(beneficiary?.health_regimen, x,y,{ align: 'left' });
    y+=20;

    x=310;
    doc.font('Helvetica-Bold').fontSize(10).text("Fecha del evento:", x,y,{ align: 'left'});
    x=400;
    doc.font('Helvetica').fontSize(10).text(event?.execution_date.toISOString().substring(0, 10), x,y,{ align: 'left' });
    y+=10;

    x=30;
    y+=5;

  }
  return [x,y];
}

const addContentTableDelivery=(doc:any,x:number,y:number,itemsList?:any | null)=>{

  if(itemsList){
    doc.font('Helvetica-Bold').fontSize(10).text("Información de entrega:", x,y,{ align: 'left' });
    y+=20;

    doc.font('Helvetica-Bold').fontSize(10).text("Nombre del articulo", x,y,{ align: 'left' });
    x+=200;
    doc.font('Helvetica-Bold').fontSize(10).text("Cantidad", x,y,{ align: 'left' });
    x+=200;
    doc.font('Helvetica-Bold').fontSize(10).text("Precio", x,y,{ align: 'left' });

    y+=10;
    x=30;
    doc.lineWidth(.3)
    .moveTo(x, y)
    .lineTo(x + 550, y)  
    .strokeColor('black')  
    .stroke();

    y+=12;
    itemsList.map((data)=>{
      x=30;
      doc.font('Helvetica-Bold').fontSize(9).text(data?.item?.name.toUpperCase(), x,y,{ align: 'left' });
      x+=200;
      doc.font('Helvetica-Bold').fontSize(9).text(data?.amount, x,y,{ align: 'left' });
      x+=200;
      doc.font('Helvetica-Bold').fontSize(9).text(data?.item?.value >0 ? `$ ${data?.item?.value}`: `$ ${0}`, x,y,{ align: 'left' });
      x=30;
      y+=13;
      
    });
  }
  return [x,y];
}

const addContentTableListArticles=(doc:any,x:number,y:number,itemsList?:any | null,header?:typeHeader | null,contentFooter?:typeContentFooter | null)=>{
  if(itemsList){
    doc.font('Helvetica-Bold').fontSize(10).text("Información de entrega:", x,y,{ align: 'left' });
    y+=20;

    doc.font('Helvetica-Bold').fontSize(10).text("#", x,y,{ align: 'left' });
    x+=26;
    doc.font('Helvetica-Bold').fontSize(10).text("Código", x,y,{ align: 'left' });
    x-=2;
    x+=55;
    doc.font('Helvetica-Bold').fontSize(10).text("Nombre del artículo", x,y,{ align: 'left' });
    x-=2;
    x+=290;
    doc.font('Helvetica-Bold').fontSize(10).text("Cantidad", x,y,{ align: 'left' });
    x-=2;
    x+=65;
    doc.font('Helvetica-Bold').fontSize(10).text("Total", x,y,{with:300});

    y+=10;
    x=30;
    doc.lineWidth(.3)
    .moveTo(x, y)
    .lineTo(x + 550, y)  
    .strokeColor('black')  
    .stroke();

    y+=12;
    let grandTotal=0;
    itemsList.map((data,index)=>{
      x=29;
      doc.font('Helvetica-Bold').fontSize(9).text((index+1), x,y,{ align: 'left' });
      x-=2;
      x+=30;
      doc.font('Helvetica-Bold').fontSize(9).text(data?.code, x,y,{ align: 'left' });
      x-=2;
      x+=55;
      doc.font('Helvetica-Bold').fontSize(9).text(data?.name.toUpperCase(), x,y,{ align: 'left' });
      x-=2;
      x+=290;
      doc.font('Helvetica-Bold').fontSize(9).text(data?.amount, x,y,{ align: 'left' });
      x-=2;
      x+=66;
      const valueTotal=data.value*data.amount;
      grandTotal+=valueTotal;
      doc.font('Helvetica-Bold').fontSize(9).text(formatCurrencyNummber(valueTotal), x,y,{ with:300 });
      x=30;
      y+=20;
      
      if(y>540){
        doc.addPage();
        x=30;
        y=30;
        [x,y]=addContentPrevious(doc,x,y,header);
        addContentFooter(doc,x,y,contentFooter);
      }
      if(itemsList.length-1 ===index){
        x=460;
        y+=20;
        doc.font('Helvetica-Bold').fontSize(12).text("Grand total:", x,y);
        y+=20
        doc.font('Helvetica-Bold').fontSize(9).text(formatCurrencyNummber(grandTotal), x,y);

      }
    });
  }
  return [x,y];
}

const addContentBeforeFooter=(doc:any,x:number,y:number,dataBeforeFooter?:any | null, beneficiary?:any | null, textDataBeforeFooter?:string)=>{
  x=90;
  y=550;
  doc.font('Helvetica').fontSize(8.8).text(textDataBeforeFooter, x,y,{ align: 'center',with:600 });

  y=580;
  x=30;
  doc.image(getImageBase64(convertUrl(null,dataBeforeFooter.replegalprint)),x,y, {width:100, height:60});
  y+=80
  doc.lineWidth(.3)
    .moveTo(x, y)
    .lineTo(x + 150, y)  
    .strokeColor('black')  
    .opacity(0.5)   
    .stroke();

    doc.opacity(1); 
    y+=5; 
    doc.font('Helvetica-Bold').fontSize(8).text(dataBeforeFooter.nameAfterSignature, x,y,{ align: 'left' });
    doc.opacity(.5); 
    y+=10; 

    x=50;
    doc.font('Helvetica').fontSize(8).text("Representante legal", x,y,{ align: 'left' });
    y+=10;
    x=30;
    doc.font('Helvetica').fontSize(7).text(dataBeforeFooter.representantLegal, x,y,{ align: 'left',width:140 });

    doc.opacity(1);

    y=580;
    x=400;
    doc.image(getImageBase64(convertUrl(beneficiary?.footprint_url,null)),x,y, {width:75, height:75});
    y+=78;
    doc.font('Helvetica-Bold').fontSize(8.3).text(`${beneficiary?.first_name ? beneficiary?.first_name: ""} ${beneficiary?.second_name ? beneficiary?.second_name: ""} ${beneficiary?.first_last_name ? beneficiary?.first_last_name: ""}  ${beneficiary?.second_last_name ? beneficiary?.second_last_name: ""}`.toUpperCase(), x,y,{ align: 'left',width:200 });
    y+=13
    doc.font('Helvetica').fontSize(8.3).text("CC: "+beneficiary?.identification, x,y,{ align: 'left' });


    x=30;
    y=30;
    

  return [x,y];
}

 export const generateFilePdfDelivery=(
  res:any,
  headerPdf?:typeHeader | null,
  beneficiary?:any | null,
  event?:any | null,
  itemsList?:any | null,
  textDataBeforeFooter?:string | null,
  dataBeforeFooter?:any | null,
  dataFooter?:typeContentFooter | null
)=>{
  const doc = new PDFDocument({
    margin: {
      top: 50,         // Puedes ajustar estos valores según tus necesidades
      bottom: 50,
      left: 50,
      right: 50,
    },
  });
  doc.pipe(res);

  doc.fillOpacity(0.8);
  let x = 30;
  let y = 30;

  [x,y]=addContentPrevious(doc,x,y,headerPdf);
  [x,y]=addContentInfoBeneficiarie(doc,x,y,beneficiary,event);
  [x,y]=addContentTableDelivery(doc,x,y,itemsList);
  [x,y]=addContentBeforeFooter(doc,x,y,dataBeforeFooter, beneficiary,textDataBeforeFooter as string);
  [x,y]=addContentFooter(doc,x,y,dataFooter);

  doc.addPage();

  [x,y]=addContentPrevious(doc,x,y,headerPdf);
  if(beneficiary?.id_front){
    doc.image(getImageBase64(convertUrl(beneficiary?.id_front,null)),180,150, {width:300,height:230});
    y+=238;
  }
  if(beneficiary?.id_back){
    doc.image(getImageBase64(convertUrl(beneficiary?.id_back,null)),180,y, {width:300,height:230});
  }

  [x,y]=addContentFooter(doc,x,y,dataFooter);

   doc.addPage();
  [x,y]=addContentPrevious(doc,x,y,headerPdf);
    if(beneficiary?.fosiga_url){
      doc.image(getImageBase64(convertUrl(beneficiary?.fosiga_url,null)),40,150, {width:530,height:500});
    }
  [x,y]=addContentFooter(doc,x,y,dataFooter);

  doc.addPage();
  [x,y]=addContentPrevious(doc,x,y,headerPdf);
    if(beneficiary?.sisben_url){
      doc.image(getImageBase64(convertUrl(beneficiary?.sisben_url,null)),40,150, {width:530,height:500});
    }
  [x,y]=addContentFooter(doc,x,y,dataFooter);

  doc.addPage();
  [x,y]=addContentPrevious(doc,x,y,headerPdf);
    if(beneficiary?.registry_doc_url){
      doc.image(getImageBase64(convertUrl(beneficiary?.registry_doc_url,null)),40,150, {width:530,height:500});
    }

  [x,y]=addContentFooter(doc,x,y,dataFooter);

  doc.end();

}