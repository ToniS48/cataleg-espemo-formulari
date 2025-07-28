// GOOGLE APPS SCRIPT - VERSIÓN CORREGIDA PARA JSONP
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

function doGet(e) {
  try {
    // Log para debugging
    console.log('📥 doGet - Parámetros recibidos:', e.parameter);
    
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
            message: 'Google Apps Script funcionando correctamente',
            timestamp: new Date().toISOString(),
            version: '4.0.0',
            mode: 'JSONP',
            parameters: e.parameter
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
          
        default:
          result = {
            success: false,
            error: `Acción no válida: ${action}`,
            availableActions: ['ping', 'getStats', 'getAllCavitats', 'getCavitatById', 'getMunicipis']
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
    
    // RESPUESTA JSONP
    if (callback) {
      console.log('📡 Generando respuesta JSONP para callback:', callback);
      const jsonpResponse = callback + '(' + JSON.stringify(result) + ');';
      
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/javascript'
        });
    }
    
    // RESPUESTA JSON NORMAL
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
      
  } catch (error) {
    console.error('❌ Error en doGet:', error);
    
    const errorResult = {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    };
    
    const callback = e.parameter ? e.parameter.callback : null;
    
    if (callback) {
      const jsonpResponse = callback + '(' + JSON.stringify(errorResult) + ');';
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // Redirigir POST a GET para simplificar
  return doGet(e);
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
    
    const stats = {
      success: true,
      data: {
        totalCavitats: totalCavitats,
        totalMunicipis: 0,
        totalFotos: 0,
        totalTopos: 0,
        totalPozos: 0,
        totalSalas: 0,
        profunditatMitjana: 0,
        lastUpdate: new Date().toISOString()
      }
    };
    
    if (totalCavitats > 0) {
      try {
        const data = cavitatsSheet.getDataRange().getValues();
        const municipis = new Set();
        let sumProfunditat = 0;
        let countProfunditat = 0;
        
        for (let i = 1; i < data.length; i++) {
          const municipi = data[i][4];
          const profunditat = parseFloat(data[i][21]) || 0;
          
          if (municipi) municipis.add(municipi);
          if (profunditat > 0) {
            sumProfunditat += profunditat;
            countProfunditat++;
          }
        }
        
        stats.data.totalMunicipis = municipis.size;
        stats.data.profunditatMitjana = countProfunditat > 0 ? Math.round((sumProfunditat / countProfunditat) * 100) / 100 : 0;
        
        // Contar otras hojas
        stats.data.totalPozos = getSheetRowCount(spreadsheet, POZOS_SHEET_NAME);
        stats.data.totalSalas = getSheetRowCount(spreadsheet, SALAS_SHEET_NAME);
        stats.data.totalFotos = getSheetRowCount(spreadsheet, FOTOS_SHEET_NAME);
        stats.data.totalTopos = getSheetRowCount(spreadsheet, TOPOS_SHEET_NAME);
      } catch (dataError) {
        console.error('Error procesando datos:', dataError);
        // Continuar con stats básicas
      }
    }
    
    console.log('📊 Stats calculadas:', stats.data);
    return stats;
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getAllCavitatsFromSheets(params = {}) {
  try {
    console.log('🗃️ Obteniendo cavitats...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Hoja Cavitats no encontrada'
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: true,
        data: [],
        count: 0
      };
    }
    
    const cavitats = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cavitat = {
        id: row[1] || `cavitat_${i}`,
        nom: row[2] || '',
        alies: row[3] || '',
        municipi: row[4] || '',
        latitud: row[5] || '',
        longitud: row[6] || '',
        altitud: row[9] || '',
        genesis: row[16] || '',
        interes: row[17] || '',
        descripcio: row[18] || '',
        profunditat: parseFloat(row[21]) || 0,
        timestamp: row[0] || ''
      };
      
      // Filtros básicos
      let incluir = true;
      
      if (params.municipi && cavitat.municipi.toLowerCase().indexOf(params.municipi.toLowerCase()) === -1) {
        incluir = false;
      }
      
      if (params.searchText) {
        const searchLower = params.searchText.toLowerCase();
        const searchableText = `${cavitat.nom} ${cavitat.alies} ${cavitat.municipi} ${cavitat.descripcio}`.toLowerCase();
        if (searchableText.indexOf(searchLower) === -1) {
          incluir = false;
        }
      }
      
      if (incluir) {
        cavitats.push(cavitat);
      }
    }
    
    return {
      success: true,
      data: cavitats,
      count: cavitats.length
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo cavitats:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getCavitatByIdFromSheets(id) {
  try {
    const allCavitats = getAllCavitatsFromSheets();
    
    if (!allCavitats.success) {
      return allCavitats;
    }
    
    const cavitat = allCavitats.data.find(c => c.id === id);
    
    if (!cavitat) {
      return {
        success: false,
        error: `Cavitat ${id} no encontrada`
      };
    }
    
    return {
      success: true,
      data: cavitat
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getMunicipis() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Hoja Cavitats no encontrada'
      };
    }
    
    const data = sheet.getDataRange().getValues();
    const municipis = new Set();
    
    for (let i = 1; i < data.length; i++) {
      const municipi = data[i][4];
      if (municipi) {
        municipis.add(municipi);
      }
    }
    
    const municipisList = Array.from(municipis).sort();
    
    return {
      success: true,
      data: municipisList,
      count: municipisList.length
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
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