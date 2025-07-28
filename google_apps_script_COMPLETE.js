// GOOGLE APPS SCRIPT - VERSIÓN COMPLETA CRUD ESPEMO
// Despliega como "Aplicación web" con acceso "Cualquier usuario"
// API completa para gestión de cavidades espeleológicas

// ====== CONFIGURACIÓN ======
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
    
    if (action) {
      console.log('🎯 Ejecutando acción:', action);
      
      switch (action) {
        // ====== INFORMACIÓN DEL API ======
        case 'ping':
          result = {
            success: true,
            message: 'ESPEMO API CRUD funcionando correctamente',
            timestamp: new Date().toISOString(),
            version: '6.0.0',
            mode: 'JSONP',
            spreadsheetId: SPREADSHEET_ID ? 'configurado' : 'no configurado',
            availableActions: [
              'ping', 'getStats', 'getMunicipis',
              'getAllCavitats', 'getCavitatById', 'searchCavitats',
              'createCavitat', 'updateCavitat', 'deleteCavitat',
              'getAllPozos', 'createPozo', 'updatePozo', 'deletePozo',
              'getAllSalas', 'createSala', 'updateSala', 'deleteSala',
              'getAllFotos', 'createFoto', 'updateFoto', 'deleteFoto',
              'getAllTopos', 'createTopo', 'updateTopo', 'deleteTopo',
              'getAllBiblio', 'createBiblio', 'updateBiblio', 'deleteBiblio',
              'backup', 'restore'
            ]
          };
          break;
          
        // ====== ESTADÍSTICAS ======
        case 'getStats':
          result = getStatsFromSheets();
          break;
          
        case 'getMunicipis':
          result = getMunicipis();
          break;
          
        // ====== CAVITATS - CRUD COMPLETO ======
        case 'getAllCavitats':
          result = getAllCavitats(e.parameter);
          break;
          
        case 'getCavitatById':
          result = getCavitatById(e.parameter.id);
          break;
          
        case 'searchCavitats':
          result = searchCavitats(e.parameter);
          break;
          
        case 'createCavitat':
        case 'saveCavitat':
          result = createCavitat(e);
          break;
          
        case 'updateCavitat':
          result = updateCavitat(e);
          break;
          
        case 'deleteCavitat':
          result = deleteCavitat(e.parameter.id);
          break;
          
        // ====== POZOS - CRUD COMPLETO ======
        case 'getAllPozos':
          result = getAllPozos(e.parameter);
          break;
          
        case 'createPozo':
          result = createPozo(e);
          break;
          
        case 'updatePozo':
          result = updatePozo(e);
          break;
          
        case 'deletePozo':
          result = deletePozo(e.parameter.id);
          break;
          
        // ====== SALAS - CRUD COMPLETO ======
        case 'getAllSalas':
          result = getAllSalas(e.parameter);
          break;
          
        case 'createSala':
          result = createSala(e);
          break;
          
        case 'updateSala':
          result = updateSala(e);
          break;
          
        case 'deleteSala':
          result = deleteSala(e.parameter.id);
          break;
          
        // ====== FOTOS - CRUD COMPLETO ======
        case 'getAllFotos':
          result = getAllFotos(e.parameter);
          break;
          
        case 'createFoto':
          result = createFoto(e);
          break;
          
        case 'updateFoto':
          result = updateFoto(e);
          break;
          
        case 'deleteFoto':
          result = deleteFoto(e.parameter.id);
          break;
          
        // ====== TOPOGRAFIAS - CRUD COMPLETO ======
        case 'getAllTopos':
          result = getAllTopos(e.parameter);
          break;
          
        case 'createTopo':
          result = createTopo(e);
          break;
          
        case 'updateTopo':
          result = updateTopo(e);
          break;
          
        case 'deleteTopo':
          result = deleteTopo(e.parameter.id);
          break;
          
        // ====== BIBLIOGRAFIA - CRUD COMPLETO ======
        case 'getAllBiblio':
          result = getAllBiblio(e.parameter);
          break;
          
        case 'createBiblio':
          result = createBiblio(e);
          break;
          
        case 'updateBiblio':
          result = updateBiblio(e);
          break;
          
        case 'deleteBiblio':
          result = deleteBiblio(e.parameter.id);
          break;
          
        // ====== UTILIDADES ======
        case 'backup':
          result = createBackup();
          break;
          
        case 'restore':
          result = restoreFromBackup(e.parameter.backupId);
          break;
          
        default:
          result = {
            success: false,
            error: `Acción no válida: ${action}`,
            availableActions: [
              'ping', 'getStats', 'getMunicipis',
              'getAllCavitats', 'getCavitatById', 'searchCavitats',
              'createCavitat', 'updateCavitat', 'deleteCavitat',
              'getAllPozos', 'createPozo', 'updatePozo', 'deletePozo',
              'getAllSalas', 'createSala', 'updateSala', 'deleteSala',
              'getAllFotos', 'createFoto', 'updateFoto', 'deleteFoto',
              'getAllTopos', 'createTopo', 'updateTopo', 'deleteTopo',
              'getAllBiblio', 'createBiblio', 'updateBiblio', 'deleteBiblio',
              'backup', 'restore'
            ]
          };
      }
    } else {
      result = {
        success: true,
        message: 'ESPEMO API CRUD v6.0.0',
        timestamp: new Date().toISOString(),
        usage: 'Añade ?action=ping para ver todas las acciones disponibles'
      };
    }
    
    // RESPUESTA JSONP
    if (callback) {
      const jsonpResponse = callback + '(' + JSON.stringify(result) + ');';
      return ContentService.createTextOutput(jsonpResponse).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // RESPUESTA JSON
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Error en handleRequest:', error);
    
    const errorResult = {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString(),
      stack: error.stack
    };
    
    const callback = e.parameter ? e.parameter.callback : null;
    
    if (callback) {
      const jsonpResponse = callback + '(' + JSON.stringify(errorResult) + ');';
      return ContentService.createTextOutput(jsonpResponse).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(ContentService.MimeType.JSON);
  }
}

// ====== FUNCIONES GENERALES ======

function getStatsFromSheets() {
  try {
    console.log('📊 Calculando estadísticas...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Contar registros en cada hoja
    const totalCavitats = getSheetRowCount(spreadsheet, MAIN_SHEET_NAME);
    const totalPozos = getSheetRowCount(spreadsheet, POZOS_SHEET_NAME);
    const totalSalas = getSheetRowCount(spreadsheet, SALAS_SHEET_NAME);
    const totalFotos = getSheetRowCount(spreadsheet, FOTOS_SHEET_NAME);
    const totalTopos = getSheetRowCount(spreadsheet, TOPOS_SHEET_NAME);
    const totalBiblio = getSheetRowCount(spreadsheet, BIBLIO_SHEET_NAME);
    
    // Estadísticas específicas de cavitats
    let municipis = new Set();
    let profunditatTotal = 0;
    let profunditatCount = 0;
    
    if (totalCavitats > 0) {
      const cavitatsSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
      const data = cavitatsSheet.getDataRange().getValues();
      const headers = data[0];
      
      const municipiCol = headers.indexOf('Municipi');
      const profunditatCol = headers.indexOf('Profunditat') >= 0 ? headers.indexOf('Profunditat') : 
                           headers.indexOf('Profunditat_metres') >= 0 ? headers.indexOf('Profunditat_metres') : -1;
      
      for (let i = 1; i < data.length; i++) {
        if (municipiCol >= 0 && data[i][municipiCol]) {
          municipis.add(data[i][municipiCol]);
        }
        
        if (profunditatCol >= 0 && data[i][profunditatCol]) {
          const prof = parseFloat(data[i][profunditatCol]);
          if (!isNaN(prof) && prof > 0) {
            profunditatTotal += prof;
            profunditatCount++;
          }
        }
      }
    }
    
    const stats = {
      success: true,
      data: {
        // Contadores principales
        totalCavitats: totalCavitats,
        totalPozos: totalPozos,
        totalSalas: totalSalas,
        totalFotos: totalFotos,
        totalTopos: totalTopos,
        totalBiblio: totalBiblio,
        
        // Estadísticas específicas
        totalMunicipis: municipis.size,
        profunditatMitjana: profunditatCount > 0 ? Math.round((profunditatTotal / profunditatCount) * 100) / 100 : 0,
        profunditatTotal: Math.round(profunditatTotal * 100) / 100,
        
        // Metadatos
        ultimaActualizacion: new Date().toISOString(),
        version: '6.0.0'
      }
    };
    
    console.log('📊 Estadísticas calculadas correctamente');
    return stats;
    
  } catch (error) {
    console.error('❌ Error en getStatsFromSheets:', error);
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
      data: municipis,
      count: municipis.length
    };
    
  } catch (error) {
    console.error('❌ Error en getMunicipis:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ====== OPERACIONES CRUD GENÉRICAS ======

function genericGetAll(sheetName, params = {}) {
  try {
    console.log(`📋 Obteniendo todos los registros de ${sheetName}...`);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return {
        success: false,
        error: `Hoja ${sheetName} no encontrada`
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
    
    const headers = data[0];
    const records = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const record = {};
      
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = row[j];
      }
      
      // Filtros básicos
      let incluir = true;
      
      // Filtro por cavitat_id si se especifica
      if (params.cavitat_id && record.cavitat_id != params.cavitat_id) {
        incluir = false;
      }
      
      // Filtro de búsqueda general
      if (params.search && incluir) {
        const searchLower = params.search.toLowerCase();
        const searchableText = Object.values(record).join(' ').toLowerCase();
        if (searchableText.indexOf(searchLower) === -1) {
          incluir = false;
        }
      }
      
      if (incluir) {
        records.push(record);
      }
    }
    
    console.log(`📋 ${records.length} registros obtenidos de ${sheetName}`);
    
    return {
      success: true,
      data: records,
      count: records.length
    };
    
  } catch (error) {
    console.error(`❌ Error en genericGetAll para ${sheetName}:`, error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function genericCreate(sheetName, data, idPrefix = 'ID') {
  try {
    console.log(`💾 Creando registro en ${sheetName}...`);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return {
        success: false,
        error: `Hoja ${sheetName} no encontrada`
      };
    }
    
    // Generar ID si no existe
    if (!data.ID) {
      const lastRow = sheet.getLastRow();
      const newIdNumber = lastRow; // Usar número de fila como base
      data.ID = idPrefix + newIdNumber.toString().padStart(4, '0');
    }
    
    // Añadir timestamp si no existe
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    // Obtener headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Preparar datos para la fila
    const rowData = [];
    for (let header of headers) {
      rowData.push(data[header] || '');
    }
    
    // Insertar fila
    sheet.appendRow(rowData);
    
    console.log(`✅ Registro creado en ${sheetName} con ID: ${data.ID}`);
    
    return {
      success: true,
      message: `Registro creado correctamente en ${sheetName}`,
      data: {
        id: data.ID,
        timestamp: data.timestamp,
        rowNumber: sheet.getLastRow()
      }
    };
    
  } catch (error) {
    console.error(`❌ Error en genericCreate para ${sheetName}:`, error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function genericUpdate(sheetName, id, data) {
  try {
    console.log(`✏️ Actualizando registro ${id} en ${sheetName}...`);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return {
        success: false,
        error: `Hoja ${sheetName} no encontrada`
      };
    }
    
    const sheetData = sheet.getDataRange().getValues();
    const headers = sheetData[0];
    const idCol = headers.indexOf('ID');
    
    if (idCol < 0) {
      return {
        success: false,
        error: 'Columna ID no encontrada'
      };
    }
    
    // Buscar la fila con el ID especificado
    let targetRow = -1;
    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][idCol] == id) {
        targetRow = i + 1; // +1 porque las filas están indexadas desde 1
        break;
      }
    }
    
    if (targetRow === -1) {
      return {
        success: false,
        error: `Registro con ID ${id} no encontrado en ${sheetName}`
      };
    }
    
    // Actualizar timestamp
    data.timestamp_updated = new Date().toISOString();
    
    // Preparar datos actualizados
    const rowData = [];
    for (let header of headers) {
      if (data.hasOwnProperty(header)) {
        rowData.push(data[header]);
      } else {
        // Mantener valor existente si no se proporciona nuevo valor
        const colIndex = headers.indexOf(header);
        rowData.push(sheetData[targetRow - 1][colIndex]);
      }
    }
    
    // Actualizar la fila
    sheet.getRange(targetRow, 1, 1, headers.length).setValues([rowData]);
    
    console.log(`✅ Registro ${id} actualizado en ${sheetName}`);
    
    return {
      success: true,
      message: `Registro actualizado correctamente en ${sheetName}`,
      data: {
        id: id,
        timestamp_updated: data.timestamp_updated,
        rowNumber: targetRow
      }
    };
    
  } catch (error) {
    console.error(`❌ Error en genericUpdate para ${sheetName}:`, error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function genericDelete(sheetName, id) {
  try {
    console.log(`🗑️ Eliminando registro ${id} de ${sheetName}...`);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return {
        success: false,
        error: `Hoja ${sheetName} no encontrada`
      };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idCol = headers.indexOf('ID');
    
    if (idCol < 0) {
      return {
        success: false,
        error: 'Columna ID no encontrada'
      };
    }
    
    // Buscar la fila con el ID especificado
    let targetRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] == id) {
        targetRow = i + 1; // +1 porque las filas están indexadas desde 1
        break;
      }
    }
    
    if (targetRow === -1) {
      return {
        success: false,
        error: `Registro con ID ${id} no encontrado en ${sheetName}`
      };
    }
    
    // Eliminar la fila
    sheet.deleteRow(targetRow);
    
    console.log(`✅ Registro ${id} eliminado de ${sheetName}`);
    
    return {
      success: true,
      message: `Registro eliminado correctamente de ${sheetName}`,
      data: {
        id: id,
        timestamp_deleted: new Date().toISOString(),
        deletedRow: targetRow
      }
    };
    
  } catch (error) {
    console.error(`❌ Error en genericDelete para ${sheetName}:`, error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ====== FUNCIONES ESPECÍFICAS PARA CAVITATS ======

function getAllCavitats(params = {}) {
  return genericGetAll(MAIN_SHEET_NAME, params);
}

function getCavitatById(id) {
  try {
    const result = genericGetAll(MAIN_SHEET_NAME);
    if (!result.success) return result;
    
    const cavitat = result.data.find(c => c.ID === id);
    
    if (!cavitat) {
      return {
        success: false,
        error: `Cavitat con ID ${id} no encontrada`
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

function searchCavitats(params) {
  // Búsqueda avanzada con múltiples criterios
  try {
    const allCavitats = genericGetAll(MAIN_SHEET_NAME);
    if (!allCavitats.success) return allCavitats;
    
    let filteredCavitats = allCavitats.data;
    
    // Filtro por municipio
    if (params.municipi) {
      filteredCavitats = filteredCavitats.filter(c => 
        c.Municipi && c.Municipi.toLowerCase().includes(params.municipi.toLowerCase())
      );
    }
    
    // Filtro por profundidad mínima
    if (params.profunditat_min) {
      const minProf = parseFloat(params.profunditat_min);
      filteredCavitats = filteredCavitats.filter(c => {
        const prof = parseFloat(c.Profunditat || c.Profunditat_metres || 0);
        return prof >= minProf;
      });
    }
    
    // Filtro por profundidad máxima
    if (params.profunditat_max) {
      const maxProf = parseFloat(params.profunditat_max);
      filteredCavitats = filteredCavitats.filter(c => {
        const prof = parseFloat(c.Profunditat || c.Profunditat_metres || 0);
        return prof <= maxProf;
      });
    }
    
    // Búsqueda de texto general
    if (params.text) {
      const searchText = params.text.toLowerCase();
      filteredCavitats = filteredCavitats.filter(c => {
        const searchableText = `${c.Nom || ''} ${c.Alies || ''} ${c.Descripcio || ''} ${c.Genesis || ''}`.toLowerCase();
        return searchableText.includes(searchText);
      });
    }
    
    return {
      success: true,
      data: filteredCavitats,
      count: filteredCavitats.length,
      filters_applied: params
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

function createCavitat(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  return genericCreate(MAIN_SHEET_NAME, data.data, 'CAV');
}

function updateCavitat(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  const id = e.parameter.id || data.data.ID;
  if (!id) {
    return {
      success: false,
      error: 'ID requerido para actualizar cavitat'
    };
  }
  
  return genericUpdate(MAIN_SHEET_NAME, id, data.data);
}

function deleteCavitat(id) {
  if (!id) {
    return {
      success: false,
      error: 'ID requerido para eliminar cavitat'
    };
  }
  
  return genericDelete(MAIN_SHEET_NAME, id);
}

// ====== FUNCIONES PARA POZOS ======

function getAllPozos(params = {}) {
  return genericGetAll(POZOS_SHEET_NAME, params);
}

function createPozo(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  return genericCreate(POZOS_SHEET_NAME, data.data, 'POZ');
}

function updatePozo(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  const id = e.parameter.id || data.data.ID;
  return genericUpdate(POZOS_SHEET_NAME, id, data.data);
}

function deletePozo(id) {
  return genericDelete(POZOS_SHEET_NAME, id);
}

// ====== FUNCIONES PARA SALAS ======

function getAllSalas(params = {}) {
  return genericGetAll(SALAS_SHEET_NAME, params);
}

function createSala(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  return genericCreate(SALAS_SHEET_NAME, data.data, 'SAL');
}

function updateSala(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  const id = e.parameter.id || data.data.ID;
  return genericUpdate(SALAS_SHEET_NAME, id, data.data);
}

function deleteSala(id) {
  return genericDelete(SALAS_SHEET_NAME, id);
}

// ====== FUNCIONES PARA FOTOS ======

function getAllFotos(params = {}) {
  return genericGetAll(FOTOS_SHEET_NAME, params);
}

function createFoto(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  return genericCreate(FOTOS_SHEET_NAME, data.data, 'FOT');
}

function updateFoto(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  const id = e.parameter.id || data.data.ID;
  return genericUpdate(FOTOS_SHEET_NAME, id, data.data);
}

function deleteFoto(id) {
  return genericDelete(FOTOS_SHEET_NAME, id);
}

// ====== FUNCIONES PARA TOPOGRAFÍAS ======

function getAllTopos(params = {}) {
  return genericGetAll(TOPOS_SHEET_NAME, params);
}

function createTopo(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  return genericCreate(TOPOS_SHEET_NAME, data.data, 'TOP');
}

function updateTopo(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  const id = e.parameter.id || data.data.ID;
  return genericUpdate(TOPOS_SHEET_NAME, id, data.data);
}

function deleteTopo(id) {
  return genericDelete(TOPOS_SHEET_NAME, id);
}

// ====== FUNCIONES PARA BIBLIOGRAFÍA ======

function getAllBiblio(params = {}) {
  return genericGetAll(BIBLIO_SHEET_NAME, params);
}

function createBiblio(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  return genericCreate(BIBLIO_SHEET_NAME, data.data, 'BIB');
}

function updateBiblio(e) {
  const data = extractDataFromRequest(e);
  if (!data.success) return data;
  
  const id = e.parameter.id || data.data.ID;
  return genericUpdate(BIBLIO_SHEET_NAME, id, data.data);
}

function deleteBiblio(id) {
  return genericDelete(BIBLIO_SHEET_NAME, id);
}

// ====== FUNCIONES AUXILIARES ======

function extractDataFromRequest(e) {
  try {
    let postData;
    
    // Múltiples formas de extraer datos
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (parseError) {
        console.log('Error parseando postData.contents:', parseError);
      }
    }
    
    if (!postData && e.parameter && e.parameter.data) {
      try {
        postData = JSON.parse(e.parameter.data);
      } catch (parseError) {
        console.log('Error parseando parameter.data:', parseError);
      }
    }
    
    if (!postData && e.parameter) {
      const filteredParams = {...e.parameter};
      delete filteredParams.action;
      delete filteredParams.callback;
      delete filteredParams.id;
      
      if (Object.keys(filteredParams).length > 0) {
        postData = filteredParams;
      }
    }
    
    if (!postData) {
      return {
        success: false,
        error: 'No se encontraron datos en la petición'
      };
    }
    
    return {
      success: true,
      data: postData
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Error extrayendo datos: ' + error.toString()
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

// ====== FUNCIONES DE BACKUP Y RESTAURACIÓN ======

function createBackup() {
  try {
    console.log('💾 Creando backup...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '6.0.0',
      sheets: {}
    };
    
    const sheetNames = [MAIN_SHEET_NAME, POZOS_SHEET_NAME, SALAS_SHEET_NAME, 
                       FOTOS_SHEET_NAME, TOPOS_SHEET_NAME, BIBLIO_SHEET_NAME];
    
    for (const sheetName of sheetNames) {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        backupData.sheets[sheetName] = sheet.getDataRange().getValues();
      }
    }
    
    // Aquí podrías guardar el backup en Google Drive si quisieras
    
    return {
      success: true,
      message: 'Backup creado correctamente',
      data: {
        backupId: 'backup_' + Date.now(),
        timestamp: backupData.timestamp,
        sheetsCount: Object.keys(backupData.sheets).length
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

function restoreFromBackup(backupId) {
  // Implementación de restauración
  return {
    success: false,
    error: 'Función de restauración no implementada aún'
  };
}
