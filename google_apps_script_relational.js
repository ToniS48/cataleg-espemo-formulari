// GOOGLE APPS SCRIPT - VERSIÓN RELACIONAL CON MÚLTIPLES HOJAS
// Despliega como "Cualquier usuario"

// CONFIGURACIÓN - CAMBIA ESTOS VALORES
const SPREADSHEET_ID = '1OyYPUnq74qMmR4YwuuI1a78SeBO_QYprl3lIv4z5jFU'; // ID del Google Sheets que compartiste
const MAIN_SHEET_NAME = 'Cavitats'; // Hoja principal de cavitats
const POZOS_SHEET_NAME = 'Pozos'; // Hoja de pozos relacionados
const SALAS_SHEET_NAME = 'Salas'; // Hoja de salas relacionadas
const FOTOS_SHEET_NAME = 'Fotos'; // Hoja de fotos relacionadas
const TOPOS_SHEET_NAME = 'Topografias'; // Hoja de topografías relacionadas
const BIBLIO_SHEET_NAME = 'Bibliografia'; // Hoja de bibliografía relacionada
const DRIVE_FOLDER_ID = '1wTlhB0mMTF7BOahw2uFaNE2iKqQlO-Qo'; // Cambia por tu ID de carpeta de Google Drive

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    let result = {};
    
    // Debug: Log de toda la petición
    console.log('📥 Petición recibida:', {
      postData: e.postData,
      parameter: e.parameter,
      parameters: e.parameters,
      contentLength: e.contentLength
    });
    
    // Intentar múltiples formas de obtener los datos POST
    let data = null;
    
    if (e.postData && e.postData.contents) {
      console.log('📋 Datos POST detectados vía contents:', {
        type: e.postData.type,
        length: e.postData.length,
        contents: e.postData.contents.substring(0, 100) + '...'
      });
      
      try {
        // Datos enviados como JSON directo
        data = JSON.parse(e.postData.contents);
        console.log('✅ JSON directo parseado correctamente');
      } catch (parseError) {
        console.log('❌ Error parseando JSON directo:', parseError.toString());
      }
    }
    
    // Fallback: intentar FormData
    if (!data && e.parameter && e.parameter.data) {
      console.log('📋 Intentando FormData...');
      try {
        data = JSON.parse(e.parameter.data);
        console.log('✅ FormData parseado correctamente');
      } catch (parseError) {
        console.log('❌ Error parseando FormData:', parseError.toString());
      }
    }
    
    // Si encontramos datos, procesarlos
    if (data) {
      console.log('📄 Procesando datos de cavitat:', {
        codi_id: data.codi_id,
        nom: data.nom,
        municipi: data.municipi,
        totalKeys: Object.keys(data).length
      });
      result = saveToSheet(data);
    } else {
      console.log('📄 No se encontraron datos POST válidos - Respuesta GET');
      // Petición GET de prueba
      result = {
        success: true,
        message: 'Google Apps Script funcionando - Listo para guardar en Sheets y Drive',
        timestamp: new Date().toISOString(),
        method: 'GET',
        spreadsheetConfigured: SPREADSHEET_ID !== 'TU_SPREADSHEET_ID_AQUI',
        driveConfigured: DRIVE_FOLDER_ID !== 'TU_DRIVE_FOLDER_ID_AQUI',
        architecture: 'relational'
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
    
    // Obtener el spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Configurar todas las hojas necesarias
    setupAllSheets(spreadsheet);
    
    // Generar ID único para esta cavitat si no existe
    const cavitatId = data.codi_id || generateCavitatId(data.municipi);
    
    // Guardar en la hoja principal de cavitats
    const mainResult = saveToCavitatsSheet(spreadsheet, data, cavitatId, fileResults);
    
    // Guardar datos relacionados en hojas separadas
    const relatedResults = saveRelatedData(spreadsheet, data, cavitatId, fileResults);
    
    return {
      success: true,
      message: 'Cavitat i dades relacionades guardades correctament',
      codiId: cavitatId,
      timestamp: new Date().toISOString(),
      rowNumber: mainResult.rowNumber,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
      fotosSubides: fileResults.fotosCount,
      toposSubides: fileResults.toposCount,
      driveFolder: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`,
      relatedDataSaved: relatedResults,
      architecture: 'relational'
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Error al guardar en Google Sheets: ${error.toString()}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Función para configurar todas las hojas necesarias
function setupAllSheets(spreadsheet) {
  // Configurar hoja principal de cavitats
  let cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
  if (!cavitatsSheet) {
    cavitatsSheet = spreadsheet.insertSheet(MAIN_SHEET_NAME);
  }
  if (cavitatsSheet.getLastRow() === 0) {
    setupCavitatsHeaders(cavitatsSheet);
  }
  
  // Configurar hoja de pozos
  let pozosSheet = spreadsheet.getSheetByName(POZOS_SHEET_NAME);
  if (!pozosSheet) {
    pozosSheet = spreadsheet.insertSheet(POZOS_SHEET_NAME);
  }
  if (pozosSheet.getLastRow() === 0) {
    setupPozosHeaders(pozosSheet);
  }
  
  // Configurar hoja de salas
  let salasSheet = spreadsheet.getSheetByName(SALAS_SHEET_NAME);
  if (!salasSheet) {
    salasSheet = spreadsheet.insertSheet(SALAS_SHEET_NAME);
  }
  if (salasSheet.getLastRow() === 0) {
    setupSalasHeaders(salasSheet);
  }
  
  // Configurar hoja de fotos
  let fotosSheet = spreadsheet.getSheetByName(FOTOS_SHEET_NAME);
  if (!fotosSheet) {
    fotosSheet = spreadsheet.insertSheet(FOTOS_SHEET_NAME);
  }
  if (fotosSheet.getLastRow() === 0) {
    setupFotosHeaders(fotosSheet);
  }
  
  // Configurar hoja de topografías
  let toposSheet = spreadsheet.getSheetByName(TOPOS_SHEET_NAME);
  if (!toposSheet) {
    toposSheet = spreadsheet.insertSheet(TOPOS_SHEET_NAME);
  }
  if (toposSheet.getLastRow() === 0) {
    setupToposHeaders(toposSheet);
  }
  
  // Configurar hoja de bibliografía
  let biblioSheet = spreadsheet.getSheetByName(BIBLIO_SHEET_NAME);
  if (!biblioSheet) {
    biblioSheet = spreadsheet.insertSheet(BIBLIO_SHEET_NAME);
  }
  if (biblioSheet.getLastRow() === 0) {
    setupBiblioHeaders(biblioSheet);
  }
}

// Configurar encabezados de la hoja principal de cavitats
function setupCavitatsHeaders(sheet) {
  const headers = [
    // Información básica
    'Timestamp', 'Codi ID', 'Nom', 'Àlies', 'Municipi', 'Latitud', 'Longitud', 
    'Latitud GMS', 'Longitud GMS', 'Altitud', 'Precisió GPS',
    
    // Coordenades UTM
    'Zona UTM', 'Datum', 'Est (X)', 'Nort (Y)', 'Z',
    
    // Classificació
    'Gènesi', 'Interès', 'Descripció',
    
    // Dimensions
    'Recorregut Real', 'Recorregut Planta', 'Profunditat',
    
    // Contextualització
    'Context Geològic', 'Context Hidrològic', 'Context Espeleològic',
    
    // Resum de dades relacionades
    'Total Pozos', 'Total Salas', 'Total Fotos', 'Total Topografias',
    
    // Arxius Drive
    'Drive Folder URL'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaders(sheet, headers.length);
}

// Configurar encabezados de la hoja de pozos
function setupPozosHeaders(sheet) {
  const headers = [
    'Timestamp', 'Cavitat ID', 'Pou Nom', 'Profunditat (m)', 'Amplada (m)', 'Observacions'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaders(sheet, headers.length);
}

// Configurar encabezados de la hoja de salas
function setupSalasHeaders(sheet) {
  const headers = [
    'Timestamp', 'Cavitat ID', 'Sala Nom', 'Descripció', 'Llargària (m)', 
    'Amplària (m)', 'Altura (m)', 'Superfície (m²)', 'Volum (m³)', 'Observacions'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaders(sheet, headers.length);
}

// Configurar encabezados de la hoja de fotos
function setupFotosHeaders(sheet) {
  const headers = [
    'Timestamp', 'Cavitat ID', 'Foto Nom', 'Drive URL', 'Tipus', 'Mida (bytes)', 'Comentari'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaders(sheet, headers.length);
}

// Configurar encabezados de la hoja de topografías
function setupToposHeaders(sheet) {
  const headers = [
    'Timestamp', 'Cavitat ID', 'Topo Nom', 'Drive URL', 'Tipus', 'Mida (bytes)', 'Comentari'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaders(sheet, headers.length);
}

// Configurar encabezados de la hoja de bibliografía
function setupBiblioHeaders(sheet) {
  const headers = [
    'Timestamp', 'Cavitat ID', 'Article', 'Autor', 'Llibre', 'Editorial', 
    'ISBN', 'Data', 'Tema', 'Tipus', 'Observacions'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeaders(sheet, headers.length);
}

// Función auxiliar para formatear encabezados
function formatHeaders(sheet, columnsCount) {
  const headerRange = sheet.getRange(1, 1, 1, columnsCount);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#E8F4F8');
  headerRange.setWrap(true);
  sheet.autoResizeColumns(1, columnsCount);
}

// Función para generar un ID único de cavitat
function generateCavitatId(municipi) {
  const timestamp = new Date().getTime();
  const municipiCode = municipi ? municipi.substring(0, 3).toUpperCase() : 'XXX';
  return `${municipiCode}-${timestamp}`;
}

// Guardar en la hoja principal de cavitats
function saveToCavitatsSheet(spreadsheet, data, cavitatId, fileResults) {
  const sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
  const now = new Date();
  
  // Procesar intereses múltiples
  let interesText = '';
  if (data.interes_multiple) {
    interesText = data.interes_multiple;
  } else if (data.interes) {
    interesText = data.interes;
  }
  
  // Contar elementos relacionados
  const totalPozos = contarElementos(data, 'pou_nom_');
  const totalSalas = contarElementos(data, 'sala_nom_');
  
  const rowData = [
    // Información básica
    now.toLocaleString('es-ES'),
    cavitatId,
    data.nom || '',
    data.alies || '',
    data.municipi || '',
    data.latitud || '',
    data.longitud || '',
    data.latitud_gms || '',
    data.longitud_gms || '',
    data.altitud || '',
    data.precisio || '',
    
    // Coordenades UTM
    data.zona_utm || '',
    data.datum || '',
    data.est_x || '',
    data.nort_y || '',
    data.z || '',
    
    // Classificació
    data.genesis || '',
    interesText,
    data.descripcio || '',
    
    // Dimensions
    data.recorregut_real || '',
    data.recorregut_planta || '',
    data.profunditat || '',
    
    // Contextualització
    data.context_geologic || '',
    data.context_hidrologic || '',
    data.context_espeleologic || '',
    
    // Resum relacionats
    totalPozos,
    totalSalas,
    fileResults.fotosCount,
    fileResults.toposCount,
    
    // Drive
    fileResults.driveLinks.length > 0 ? fileResults.driveLinks[0] : ''
  ];
  
  sheet.appendRow(rowData);
  const newRowIndex = sheet.getLastRow();
  formatNewRow(sheet, newRowIndex);
  
  return { rowNumber: newRowIndex };
}

// Guardar datos relacionados en hojas separadas
function saveRelatedData(spreadsheet, data, cavitatId, fileResults) {
  const results = {
    pozos: 0,
    salas: 0,
    fotos: 0,
    topografias: 0,
    bibliografia: 0
  };
  
  // Guardar pozos
  results.pozos = savePozosData(spreadsheet, data, cavitatId);
  
  // Guardar salas
  results.salas = saveSalasData(spreadsheet, data, cavitatId);
  
  // Guardar fotos
  results.fotos = saveFotosData(spreadsheet, data, cavitatId, fileResults);
  
  // Guardar topografías
  results.topografias = saveToposData(spreadsheet, data, cavitatId, fileResults);
  
  // Guardar bibliografía
  results.bibliografia = saveBiblioData(spreadsheet, data, cavitatId);
  
  return results;
}

// Guardar pozos en hoja separada
function savePozosData(spreadsheet, data, cavitatId) {
  const sheet = spreadsheet.getSheetByName(POZOS_SHEET_NAME);
  const now = new Date();
  let count = 0;
  
  // Buscar todos los pozos dinámicos
  for (let i = 1; i <= 50; i++) { // Buscar hasta 50 pozos
    const pouNom = data[`pou_nom_${i}`];
    if (pouNom) {
      const rowData = [
        now.toLocaleString('es-ES'),
        cavitatId,
        pouNom,
        data[`pou_profunditat_${i}`] || '',
        data[`pou_amplada_${i}`] || '',
        data[`pou_observacions_${i}`] || ''
      ];
      
      sheet.appendRow(rowData);
      count++;
    }
  }
  
  return count;
}

// Guardar salas en hoja separada
function saveSalasData(spreadsheet, data, cavitatId) {
  const sheet = spreadsheet.getSheetByName(SALAS_SHEET_NAME);
  const now = new Date();
  let count = 0;
  
  // Buscar todas las salas dinámicas
  for (let i = 1; i <= 50; i++) { // Buscar hasta 50 salas
    const salaNom = data[`sala_nom_${i}`];
    if (salaNom) {
      const rowData = [
        now.toLocaleString('es-ES'),
        cavitatId,
        salaNom,
        data[`sala_descripcio_${i}`] || '',
        data[`sala_llargaria_${i}`] || '',
        data[`sala_amplaria_${i}`] || '',
        data[`sala_altura_${i}`] || '',
        data[`sala_superficie_${i}`] || '',
        data[`sala_volum_${i}`] || '',
        data[`sala_observacions_${i}`] || ''
      ];
      
      sheet.appendRow(rowData);
      count++;
    }
  }
  
  return count;
}

// Guardar fotos en hoja separada
function saveFotosData(spreadsheet, data, cavitatId, fileResults) {
  const sheet = spreadsheet.getSheetByName(FOTOS_SHEET_NAME);
  const now = new Date();
  let count = 0;
  
  if (data.fotos_arxius && data.fotos_arxius.length > 0) {
    data.fotos_arxius.forEach((file, index) => {
      const driveUrl = fileResults.driveLinks.find(link => link.includes(`Foto ${index + 1}`)) || '';
      
      const rowData = [
        now.toLocaleString('es-ES'),
        cavitatId,
        file.name,
        driveUrl,
        file.type,
        file.size || '',
        data.fotos_comentari || ''
      ];
      
      sheet.appendRow(rowData);
      count++;
    });
  }
  
  return count;
}

// Guardar topografías en hoja separada
function saveToposData(spreadsheet, data, cavitatId, fileResults) {
  const sheet = spreadsheet.getSheetByName(TOPOS_SHEET_NAME);
  const now = new Date();
  let count = 0;
  
  if (data.topos_arxius && data.topos_arxius.length > 0) {
    data.topos_arxius.forEach((file, index) => {
      const driveUrl = fileResults.driveLinks.find(link => link.includes(`Topo ${index + 1}`)) || '';
      
      const rowData = [
        now.toLocaleString('es-ES'),
        cavitatId,
        file.name,
        driveUrl,
        file.type,
        file.size || '',
        data.topos_comentari || ''
      ];
      
      sheet.appendRow(rowData);
      count++;
    });
  }
  
  return count;
}

// Guardar bibliografía en hoja separada
function saveBiblioData(spreadsheet, data, cavitatId) {
  const sheet = spreadsheet.getSheetByName(BIBLIO_SHEET_NAME);
  const now = new Date();
  
  // Solo guardar si hay datos de bibliografía
  if (data.biblio_article || data.biblio_autor || data.biblio_llibre) {
    const rowData = [
      now.toLocaleString('es-ES'),
      cavitatId,
      data.biblio_article || '',
      data.biblio_autor || '',
      data.biblio_llibre || '',
      data.biblio_editorial || '',
      data.biblio_isbn || '',
      data.biblio_data || '',
      data.biblio_tema || '',
      data.biblio_tipus || '',
      data.biblio_observacions || ''
    ];
    
    sheet.appendRow(rowData);
    return 1;
  }
  
  return 0;
}

// Función auxiliar para contar elementos dinámicos
function contarElementos(data, prefix) {
  let count = 0;
  for (let i = 1; i <= 50; i++) {
    if (data[`${prefix}${i}`]) {
      count++;
    }
  }
  return count;
}

function formatNewRow(sheet, rowIndex) {
  const range = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn());
  
  // Alternar colores de fila
  if (rowIndex % 2 === 0) {
    range.setBackground('#F8F9FA');
  }
  
  // Formatear números
  const numericColumns = [6, 7, 10, 15, 16, 17, 22, 23, 24]; // Coordenadas y dimensiones
  numericColumns.forEach(col => {
    if (col <= sheet.getLastColumn()) {
      const cell = sheet.getRange(rowIndex, col);
      if (cell.getValue() !== '') {
        cell.setNumberFormat('0.000000');
      }
    }
  });
}

// Función para obtener estadísticas
function getStats() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!cavitatsSheet) {
      return { error: 'Hoja de cavitats no encontrada' };
    }
    
    const totalCavitats = cavitatsSheet.getLastRow() - 1; // Excluir encabezados
    
    // Obtener estadísticas de todas las hojas
    const stats = {
      totalCavitats: totalCavitats,
      totalPozos: getSheetRowCount(spreadsheet, POZOS_SHEET_NAME),
      totalSalas: getSheetRowCount(spreadsheet, SALAS_SHEET_NAME),
      totalFotos: getSheetRowCount(spreadsheet, FOTOS_SHEET_NAME),
      totalTopografias: getSheetRowCount(spreadsheet, TOPOS_SHEET_NAME),
      totalBibliografia: getSheetRowCount(spreadsheet, BIBLIO_SHEET_NAME),
      lastUpdate: new Date().toISOString(),
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
      architecture: 'relational'
    };
    
    return stats;
  } catch (error) {
    return { error: error.toString() };
  }
}

// Función auxiliar para contar filas en una hoja
function getSheetRowCount(spreadsheet, sheetName) {
  try {
    const sheet = spreadsheet.getSheetByName(sheetName);
    return sheet ? Math.max(0, sheet.getLastRow() - 1) : 0; // Excluir encabezados
  } catch (error) {
    return 0;
  }
}

// Función para guardar archivos en Google Drive organizados por municipios
function saveFilesToDrive(data) {
  const results = {
    toposCount: 0,
    fotosCount: 0,
    driveLinks: [],
    errors: []
  };
  
  // Si no hay archivos, no crear carpetas
  const hasFiles = (data.topos_arxius && data.topos_arxius.length > 0) || 
                   (data.fotos_arxius && data.fotos_arxius.length > 0);
  
  if (!hasFiles) {
    return results; // Retornar sin crear carpetas si no hay archivos
  }
  
  try {
    // Obtener la carpeta principal de Drive
    const mainFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Crear o obtener carpeta del municipio
    const municipiName = data.municipi || 'Sense Municipi';
    let municipiFolder = null;
    
    // Buscar si ya existe la carpeta del municipio
    const municipiFolders = mainFolder.getFoldersByName(municipiName);
    if (municipiFolders.hasNext()) {
      municipiFolder = municipiFolders.next();
    } else {
      // Crear nueva carpeta para el municipio
      municipiFolder = mainFolder.createFolder(municipiName);
    }
    
    // Crear subcarpeta para esta cavitat dentro del municipio
    const cavitatFolderName = `${data.codi_id || 'SenseID'}_${data.nom || 'SenseNom'}_${new Date().getTime()}`;
    const cavitatFolder = municipiFolder.createFolder(cavitatFolderName);
    
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
    
    // Añadir enlaces a las carpetas
    results.driveLinks.unshift(`Carpeta Cavitat: ${cavitatFolder.getUrl()}`);
    results.driveLinks.unshift(`Carpeta Municipi (${municipiName}): ${municipiFolder.getUrl()}`);
    
  } catch (error) {
    results.errors.push(`Error general en Drive: ${error.toString()}`);
  }
  
  return results;
}
