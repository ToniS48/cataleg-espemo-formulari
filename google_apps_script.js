// GOOGLE APPS SCRIPT - VERSIÓN FINAL ESPEMO
// Despliega como "Aplicación web" con acceso "Cualquier usuario"

// CONFIGURACIÓN
const SPREADSHEET_ID = '1OyYPUnq74qMmR4YwuuI1a78SeBO_QYprl3lIv4z5jFU';
const MAIN_SHEET_NAME = 'Cavitats';
const POZOS_SHEET_NAME = 'Pozos';
const SALAS_SHEET_NAME = 'Salas';
const FOTOS_SHEET_NAME = 'Fotos';
const TOPOS_SHEET_NAME = 'Topografias';
const BIBLIO_SHEET_NAME = 'Bibliografia';
const DRIVE_FOLDER_ID = '1wTlhB0mMTF7BOahw2uFaNE2iKqQlO-Qo';

// ====== FUNCIONES PRINCIPALES ======

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    console.log('📥 Petición recibida:', JSON.stringify(e.parameter));
    
    const action = e.parameter ? e.parameter.action : null;
    const callback = e.parameter ? e.parameter.callback : null;
    
    let result = {};
    
    // Procesar según la acción
    if (action) {
      console.log('🎯 Procesando acción:', action);
      
      switch (action) {
        case 'ping':
          result = {
            success: true,
            message: 'ESPEMO API funcionando correctamente',
            timestamp: new Date().toISOString(),
            version: '5.0.0',
            mode: 'JSONP',
            spreadsheetId: SPREADSHEET_ID ? 'configurado' : 'no configurado'
          };
          break;
          
        case 'getStats':
          result = getStatsFromSheets();
          break;
          
        case 'getAllCavitats':
          result = getAllCavitatsFromSheets(e.parameter);
          break;
          
        case 'getCavitatById':
          result = getCavitatByIdFromSheets(e.parameter.id);
          break;
          
        case 'getMunicipis':
          result = getMunicipis();
          break;
          
        case 'saveCavitat':
          result = saveCavitat(e);
          break;
          
        default:
          result = {
            success: false,
            error: `Acción no válida: ${action}`,
            availableActions: ['ping', 'getStats', 'getAllCavitats', 'getCavitatById', 'getMunicipis', 'saveCavitat']
          };
      }
    } else {
      // Sin acción específica
      result = {
        success: true,
        message: 'ESPEMO API funcionando',
        timestamp: new Date().toISOString(),
        usage: 'Añade ?action=ping para probar'
      };
    }
    
    // RESPUESTA JSONP si se requiere callback
    if (callback) {
      console.log('📡 Generando respuesta JSONP para callback:', callback);
      const jsonpResponse = callback + '(' + JSON.stringify(result) + ');';
      return ContentService.createTextOutput(jsonpResponse).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // RESPUESTA JSON normal
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Error en handleRequest:', error);
    
    const errorResult = {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    };
    
    const callback = e.parameter ? e.parameter.callback : null;
    
    if (callback) {
      const jsonpResponse = callback + '(' + JSON.stringify(errorResult) + ');';
      return ContentService.createTextOutput(jsonpResponse).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(ContentService.MimeType.JSON);
  }
}

// ====== FUNCIONES DE DATOS ======

function getStatsFromSheets() {
  try {
    console.log('📊 Obteniendo estadísticas...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!cavitatsSheet) {
      return {
        success: false,
        error: 'Hoja Cavitats no encontrada'
      };
    }
    
    const totalCavitats = Math.max(0, cavitatsSheet.getLastRow() - 1);
    
    // Contar municipios únicos
    const data = cavitatsSheet.getDataRange().getValues();
    const headers = data[0];
    const municipiCol = headers.indexOf('Municipi');
    
    let municipisUnicos = new Set();
    if (municipiCol >= 0) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][municipiCol]) {
          municipisUnicos.add(data[i][municipiCol]);
        }
      }
    }
    
    // Contar otras hojas
    const totalPozos = getSheetRowCount(spreadsheet, POZOS_SHEET_NAME);
    const totalSalas = getSheetRowCount(spreadsheet, SALAS_SHEET_NAME);
    const totalFotos = getSheetRowCount(spreadsheet, FOTOS_SHEET_NAME);
    const totalTopos = getSheetRowCount(spreadsheet, TOPOS_SHEET_NAME);
    
    const stats = {
      success: true,
      data: {
        totalCavitats: totalCavitats,
        totalMunicipis: municipisUnicos.size,
        totalFotos: totalFotos,
        totalTopos: totalTopos,
        totalPozos: totalPozos,
        totalSalas: totalSalas,
        ultimaActualizacion: new Date().toISOString()
      }
    };
    
    console.log('📊 Estadísticas calculadas:', stats);
    return stats;
    
  } catch (error) {
    console.error('❌ Error en getStatsFromSheets:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getAllCavitatsFromSheets(params) {
  try {
    console.log('📋 Obteniendo todas las cavitats...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!cavitatsSheet) {
      return {
        success: false,
        error: 'Hoja Cavitats no encontrada'
      };
    }
    
    const data = cavitatsSheet.getDataRange().getValues();
    const headers = data[0];
    
    const cavitats = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cavitat = {};
      
      for (let j = 0; j < headers.length; j++) {
        cavitat[headers[j]] = row[j];
      }
      
      cavitats.push(cavitat);
    }
    
    console.log(`📋 ${cavitats.length} cavitats obtenidas`);
    
    return {
      success: true,
      data: cavitats
    };
    
  } catch (error) {
    console.error('❌ Error en getAllCavitatsFromSheets:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getCavitatByIdFromSheets(id) {
  try {
    console.log('🔍 Buscando cavitat con ID:', id);
    
    if (!id) {
      return {
        success: false,
        error: 'ID de cavitat requerido'
      };
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!cavitatsSheet) {
      return {
        success: false,
        error: 'Hoja Cavitats no encontrada'
      };
    }
    
    const data = cavitatsSheet.getDataRange().getValues();
    const headers = data[0];
    const idCol = headers.indexOf('ID');
    
    if (idCol < 0) {
      return {
        success: false,
        error: 'Columna ID no encontrada'
      };
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] == id) {
        const cavitat = {};
        for (let j = 0; j < headers.length; j++) {
          cavitat[headers[j]] = data[i][j];
        }
        
        console.log('✅ Cavitat encontrada:', cavitat.Nom || 'Sin nombre');
        return {
          success: true,
          data: cavitat
        };
      }
    }
    
    return {
      success: false,
      error: `Cavitat con ID ${id} no encontrada`
    };
    
  } catch (error) {
    console.error('❌ Error en getCavitatByIdFromSheets:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getMunicipis() {
  try {
    console.log('🏘️ Obteniendo municipios...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!cavitatsSheet) {
      return {
        success: false,
        error: 'Hoja Cavitats no encontrada'
      };
    }
    
    const data = cavitatsSheet.getDataRange().getValues();
    const headers = data[0];
    const municipiCol = headers.indexOf('Municipi');
    
    if (municipiCol < 0) {
      return {
        success: false,
        error: 'Columna Municipi no encontrada'
      };
    }
    
    const municipisSet = new Set();
    for (let i = 1; i < data.length; i++) {
      if (data[i][municipiCol]) {
        municipisSet.add(data[i][municipiCol]);
      }
    }
    
    const municipis = Array.from(municipisSet).sort();
    
    console.log(`🏘️ ${municipis.length} municipios encontrados`);
    
    return {
      success: true,
      data: municipis
    };
    
  } catch (error) {
    console.error('❌ Error en getMunicipis:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function saveCavitat(e) {
  try {
    console.log('💾 Iniciando saveCavitat...');
    console.log('📋 Parámetros completos recibidos:', JSON.stringify(e));
    
    // Obtener datos del POST - múltiples formas de recibir datos
    let postData;
    
    // Método 1: Datos en e.postData.contents (JSON directo)
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
        console.log('✅ Datos obtenidos de postData.contents');
      } catch (parseError) {
        console.log('❌ Error parseando postData.contents:', parseError);
      }
    }
    
    // Método 2: Datos en e.parameter.data (parámetro data)
    if (!postData && e.parameter && e.parameter.data) {
      try {
        postData = JSON.parse(e.parameter.data);
        console.log('✅ Datos obtenidos de parameter.data');
      } catch (parseError) {
        console.log('❌ Error parseando parameter.data:', parseError);
      }
    }
    
    // Método 3: Datos directamente en e.parameter (FormData procesado)
    if (!postData && e.parameter) {
      // Filtrar parámetros que no sean parte de los datos del formulario
      const filteredParams = {...e.parameter};
      delete filteredParams.action;
      delete filteredParams.callback;
      
      if (Object.keys(filteredParams).length > 0) {
        postData = filteredParams;
        console.log('✅ Datos obtenidos de parameter directo');
      }
    }
    
    if (!postData) {
      return {
        success: false,
        error: 'No se encontraron datos para guardar',
        debug: {
          hasPostData: !!e.postData,
          hasParameter: !!e.parameter,
          parameterKeys: e.parameter ? Object.keys(e.parameter) : []
        }
      };
    }
    
    console.log('📋 Datos procesados:', JSON.stringify(postData));
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!cavitatsSheet) {
      return {
        success: false,
        error: 'Hoja Cavitats no encontrada'
      };
    }
    
    // Generar ID único si no existe
    if (!postData.ID) {
      const lastRow = cavitatsSheet.getLastRow();
      postData.ID = 'CAV' + (lastRow + 1).toString().padStart(4, '0');
      console.log('🔢 ID generado:', postData.ID);
    }
    
    // Añadir timestamp si no existe
    if (!postData.timestamp) {
      postData.timestamp = new Date().toISOString();
    }
    
    // Obtener headers de la hoja
    const headers = cavitatsSheet.getRange(1, 1, 1, cavitatsSheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers de la hoja:', headers);
    
    // Preparar datos para la fila
    const rowData = [];
    for (let header of headers) {
      const value = postData[header] || '';
      rowData.push(value);
    }
    
    console.log('📝 Datos para insertar:', rowData);
    
    // Añadir fila
    cavitatsSheet.appendRow(rowData);
    
    console.log('✅ Cavitat guardada con ID:', postData.ID);
    
    return {
      success: true,
      message: 'Cavitat guardada correctamente',
      data: {
        id: postData.ID,
        timestamp: postData.timestamp,
        rowNumber: cavitatsSheet.getLastRow()
      }
    };
    
  } catch (error) {
    console.error('❌ Error en saveCavitat:', error);
    return {
      success: false,
      error: error.toString(),
      stack: error.stack
    };
  }
}

function getSheetRowCount(spreadsheet, sheetName) {
  try {
    const sheet = spreadsheet.getSheetByName(sheetName);
    return sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
  } catch (error) {
    return 0;
  }
}