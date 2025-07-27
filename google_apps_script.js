// GOOGLE APPS SCRIPT - VERSIÓN COMPLETA CON GOOGLE SHEETS
// Despliega como "Cualquier usuario"

// CONFIGURACIÓN - CAMBIA ESTOS VALORES
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI'; // Cambia por tu ID de Google Sheets
const SHEET_NAME = 'Cavitats'; // Nombre de la hoja donde guardar los datos
const DRIVE_FOLDER_ID = 'TU_DRIVE_FOLDER_ID_AQUI'; // Cambia por tu ID de carpeta de Google Drive

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    let result = {};
    
    if (e.postData) {
      // Manejar FormData desde el formulario
      if (e.parameter && e.parameter.data) {
        // Datos enviados como FormData
        const data = JSON.parse(e.parameter.data);
        result = saveToSheet(data);
      } else if (e.postData.contents) {
        // Datos enviados como JSON (fallback)
        const data = JSON.parse(e.postData.contents);
        result = saveToSheet(data);
      }
    } else {
      // Petición GET de prueba
      result = {
        success: true,
        message: 'Google Apps Script funcionando - Listo para guardar en Sheets y Drive',
        timestamp: new Date().toISOString(),
        method: 'GET',
        spreadsheetConfigured: SPREADSHEET_ID !== 'TU_SPREADSHEET_ID_AQUI',
        driveConfigured: DRIVE_FOLDER_ID !== 'TU_DRIVE_FOLDER_ID_AQUI'
      };
    }
    
    // Crear respuesta con tipo JSON
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(data) {
  try {
    // Verificar configuración
    if (SPREADSHEET_ID === 'TU_SPREADSHEET_ID_AQUI') {
      return {
        success: false,
        error: 'Google Sheets no configurado. Contacta con el administrador.',
        timestamp: new Date().toISOString()
      };
    }
    
    if (DRIVE_FOLDER_ID === 'TU_DRIVE_FOLDER_ID_AQUI') {
      return {
        success: false,
        error: 'Google Drive no configurado. Contacta con el administrador.',
        timestamp: new Date().toISOString()
      };
    }
    
    // Guardar archivos en Google Drive primero
    const fileResults = saveFilesToDrive(data);
    
    // Obtener o crear la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, crearla con encabezados
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    }
    
    // Verificar si ya existen encabezados
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      setupHeaders(sheet);
    }
    
    // Preparar los datos para insertar (incluyendo enlaces a archivos)
    const rowData = prepareRowData(data, fileResults);
    
    // Insertar nueva fila
    sheet.appendRow(rowData);
    
    // Formatear la fila recién insertada
    const newRowIndex = sheet.getLastRow();
    formatNewRow(sheet, newRowIndex);
    
    return {
      success: true,
      message: 'Cavitat guardada correctament en Google Sheets',
      codiId: data.codi_id || 'No assignat',
      timestamp: new Date().toISOString(),
      rowNumber: newRowIndex,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
      fotosSubides: fileResults.fotosCount,
      toposSubides: fileResults.toposCount,
      driveFolder: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Error al guardar en Google Sheets: ${error.toString()}`,
      timestamp: new Date().toISOString()
    };
  }
}

function setupHeaders(sheet) {
  const headers = [
    // Información básica
    'Timestamp', 'Codi ID', 'Nom', 'Municipi', 'Latitud', 'Longitud', 
    'Latitud GMS', 'Longitud GMS', 'Altitud', 'Precisió GPS',
    
    // Características
    'Desenvolupament', 'Desnivell', 'Temperatura', 'Interès', 
    'Estat Conservació', 'Accessibilitat', 'Risc', 'Observacions',
    
    // Contextualització
    'Context Geològic', 'Context Hidrològic', 'Context Espeleològic',
    
    // Pous (camps dinàmics - màxim 5)
    'Pou 1 Nom', 'Pou 1 Profunditat', 'Pou 1 Amplada', 'Pou 1 Observacions',
    'Pou 2 Nom', 'Pou 2 Profunditat', 'Pou 2 Amplada', 'Pou 2 Observacions',
    'Pou 3 Nom', 'Pou 3 Profunditat', 'Pou 3 Amplada', 'Pou 3 Observacions',
    
    // Sales (camps dinàmics - màxim 5)
    'Sala 1 Nom', 'Sala 1 Descripció', 'Sala 1 Llargària', 'Sala 1 Amplària', 'Sala 1 Altura', 'Sala 1 Superfície', 'Sala 1 Volum', 'Sala 1 Observacions',
    'Sala 2 Nom', 'Sala 2 Descripció', 'Sala 2 Llargària', 'Sala 2 Amplària', 'Sala 2 Altura', 'Sala 2 Superfície', 'Sala 2 Volum', 'Sala 2 Observacions',
    'Sala 3 Nom', 'Sala 3 Descripció', 'Sala 3 Llargària', 'Sala 3 Amplària', 'Sala 3 Altura', 'Sala 3 Superfície', 'Sala 3 Volum', 'Sala 3 Observacions',
    
    // Archivos
    'Topografies (count)', 'Fotos (count)', 'Arxius', 'Drive Links'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#E8F4F8');
  headerRange.setWrap(true);
  
  // Ajustar ancho de columnas
  sheet.autoResizeColumns(1, headers.length);
}

function prepareRowData(data, fileResults = null) {
  const now = new Date();
  
  // Procesar intereses múltiples
  let interesText = '';
  if (data.interes_multiple) {
    interesText = data.interes_multiple;
  } else if (data.interes) {
    interesText = data.interes;
  }
  
  const rowData = [
    // Información básica
    now.toLocaleString('es-ES'),
    data.codi_id || '',
    data.nom || '',
    data.municipi || '',
    data.latitud || '',
    data.longitud || '',
    data.latitud_gms || '',
    data.longitud_gms || '',
    data.altitud || '',
    data.precisio_gps || '',
    
    // Características
    data.desenvolupament || '',
    data.desnivell || '',
    data.temperatura || '',
    interesText,
    data.estat_conservacio || '',
    data.accessibilitat || '',
    data.risc || '',
    data.observacions || '',
    
    // Contextualització
    data.context_geologic || '',
    data.context_hidrologic || '',
    data.context_espeleologic || ''
  ];
  
  // Añadir datos de pous (máximo 3)
  for (let i = 1; i <= 3; i++) {
    rowData.push(
      data[`pou_nom_${i}`] || '',
      data[`pou_profunditat_${i}`] || '',
      data[`pou_amplada_${i}`] || '',
      data[`pou_observacions_${i}`] || ''
    );
  }
  
  // Añadir datos de sales (máximo 3)
  for (let i = 1; i <= 3; i++) {
    rowData.push(
      data[`sala_nom_${i}`] || '',
      data[`sala_descripcio_${i}`] || '',
      data[`sala_llargaria_${i}`] || '',
      data[`sala_amplaria_${i}`] || '',
      data[`sala_altura_${i}`] || '',
      data[`sala_superficie_${i}`] || '',
      data[`sala_volum_${i}`] || '',
      data[`sala_observacions_${i}`] || ''
    );
  }
  
  // Contar archivos y añadir enlaces
  const toposCount = fileResults ? fileResults.toposCount : (data.topos_arxius ? data.topos_arxius.length : 0);
  const fotosCount = fileResults ? fileResults.fotosCount : (data.fotos_arxius ? data.fotos_arxius.length : 0);
  
  let arxiusInfo = '';
  if (toposCount > 0) arxiusInfo += `Topografies: ${toposCount}`;
  if (fotosCount > 0) {
    if (arxiusInfo) arxiusInfo += ', ';
    arxiusInfo += `Fotos: ${fotosCount}`;
  }
  
  // Enlaces a Drive
  let driveLinks = '';
  if (fileResults && fileResults.driveLinks.length > 0) {
    driveLinks = fileResults.driveLinks.join('\n');
  }
  
  rowData.push(toposCount, fotosCount, arxiusInfo, driveLinks);
  
  return rowData;
}

function formatNewRow(sheet, rowIndex) {
  const range = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn());
  
  // Alternar colores de fila
  if (rowIndex % 2 === 0) {
    range.setBackground('#F8F9FA');
  }
  
  // Formatear números
  const numericColumns = [5, 6, 9, 11, 12, 13]; // Latitud, Longitud, Altitud, etc.
  numericColumns.forEach(col => {
    if (col <= sheet.getLastColumn()) {
      const cell = sheet.getRange(rowIndex, col);
      if (cell.getValue() !== '') {
        cell.setNumberFormat('0.000000');
      }
    }
  });
}

// Función para obtener estadísticas (opcional)
function getStats() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return { error: 'Hoja no encontrada' };
    }
    
    const totalRows = sheet.getLastRow() - 1; // Excluir encabezados
    
    return {
      totalCavitats: totalRows,
      lastUpdate: new Date().toISOString(),
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
    };
  } catch (error) {
    return { error: error.toString() };
  }
}

// Función para guardar archivos en Google Drive
function saveFilesToDrive(data) {
  const results = {
    toposCount: 0,
    fotosCount: 0,
    driveLinks: [],
    errors: []
  };
  
  try {
    // Obtener la carpeta de Drive
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Crear subcarpeta para esta cavitat
    const cavitatFolder = folder.createFolder(`${data.codi_id || 'SenseID'}_${data.nom || 'SenseNom'}_${new Date().getTime()}`);
    
    // Guardar topografías
    if (data.topos_arxius && data.topos_arxius.length > 0) {
      const toposFolder = cavitatFolder.createFolder('Topografies');
      
      data.topos_arxius.forEach((file, index) => {
        try {
          const blob = Utilities.newBlob(
            Utilities.base64Decode(file.data),
            file.type,
            file.name
          );
          
          const driveFile = toposFolder.createFile(blob);
          results.toposCount++;
          results.driveLinks.push(`Topo ${index + 1}: ${driveFile.getUrl()}`);
        } catch (fileError) {
          results.errors.push(`Error guardando topografía ${file.name}: ${fileError.toString()}`);
        }
      });
    }
    
    // Guardar fotos
    if (data.fotos_arxius && data.fotos_arxius.length > 0) {
      const fotosFolder = cavitatFolder.createFolder('Fotos');
      
      data.fotos_arxius.forEach((file, index) => {
        try {
          const blob = Utilities.newBlob(
            Utilities.base64Decode(file.data),
            file.type,
            file.name
          );
          
          const driveFile = fotosFolder.createFile(blob);
          results.fotosCount++;
          results.driveLinks.push(`Foto ${index + 1}: ${driveFile.getUrl()}`);
        } catch (fileError) {
          results.errors.push(`Error guardando foto ${file.name}: ${fileError.toString()}`);
        }
      });
    }
    
    // Añadir enlace a la carpeta principal
    results.driveLinks.unshift(`Carpeta: ${cavitatFolder.getUrl()}`);
    
  } catch (error) {
    results.errors.push(`Error general en Drive: ${error.toString()}`);
  }
  
  return results;
}