const ExcelJS = require('exceljs');

export const createExcel = async function (columNames, listKey, jsonData) {
  // Crear un nuevo libro de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Agregar las columnas al libro
  const headerRow = worksheet.addRow(columNames);
  headerRow.eachCell((cell) => {
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '87CEEB' } };
  });
  // Agregar los datos al libro con estilos de borde
  jsonData.forEach((data) => {
    const specialFields = ['photo_url', 'footprint_url', 'id_front', 'id_back', 'fosiga_url', 'sisben_url', 'registry_doc_url'];
    const dataRow = worksheet.addRow(listKey.map(column => {
      const cellValue = typeof data[column] === 'object' && data[column] !== null ? data[column]?.name || data[column] : data[column];
      return specialFields.includes(column) ? cellValue ? 'TIENE' : 'NO TIENE' : cellValue;
    }));
    dataRow.eachCell((cell) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // Ajustar automáticamente el ancho de las columnas al contenido más largo
  worksheet.columns.forEach((column, colNumber) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const contentLength = cell.value ? cell.value.toString().length : 0;
      maxLength = Math.max(maxLength, contentLength);
    });

    column.width = maxLength + 2; // Añadir un pequeño espacio adicional
  });

  return workbook;
}
