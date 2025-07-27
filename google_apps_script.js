// Script para Google Apps Script - Integración con el formulario HTML
// Copiar este código en Google Apps Script para integrar el formulario con Google Sheets y Drive

/**
 * Configuración de carpetas en Google Drive
 */
const CONFIG = {
  SHEET_ID: 'TU_GOOGLE_SHEET_ID_AQUI', // ID de tu Google Sheet
  DRIVE_FOLDER_ID: 'TU_CARPETA_DRIVE_ID_AQUI', // ID de la carpeta raíz en Drive
  FOTOS_FOLDER_NAME: 'Fotos_Cavitats',
  TOPOS_FOLDER_NAME: 'Topografies_Cavitats'
};

/**
 * Función para crear carpetas en Google Drive si no existen
 */
function crearCarpetasSiNoExisten() {
  try {
    const carpetaRaiz = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    
    // Crear carpeta de fotos si no existe
    let carpetaFotos;
    const carpetasFotos = carpetaRaiz.getFoldersByName(CONFIG.FOTOS_FOLDER_NAME);
    if (carpetasFotos.hasNext()) {
      carpetaFotos = carpetasFotos.next();
    } else {
      carpetaFotos = carpetaRaiz.createFolder(CONFIG.FOTOS_FOLDER_NAME);
    }
    
    // Crear carpeta de topografías si no existe
    let carpetaTopos;
    const carpetasTopos = carpetaRaiz.getFoldersByName(CONFIG.TOPOS_FOLDER_NAME);
    if (carpetasTopos.hasNext()) {
      carpetaTopos = carpetasTopos.next();
    } else {
      carpetaTopos = carpetaRaiz.createFolder(CONFIG.TOPOS_FOLDER_NAME);
    }
    
    return {
      fotosId: carpetaFotos.getId(),
      toposId: carpetaTopos.getId()
    };
  } catch (error) {
    console.error('Error al crear carpetas:', error);
    throw error;
  }
}

/**
 * Función para subir archivos a Google Drive
 */
function subirArxiu(arxiuBase64, nomArxiu, carpetaId, codiCavitat) {
  try {
    // Decodificar base64
    const arxiuBlob = Utilities.newBlob(
      Utilities.base64Decode(arxiuBase64),
      'application/octet-stream',
      nomArxiu
    );
    
    // Obtener carpeta de destino
    const carpeta = DriveApp.getFolderById(carpetaId);
    
    // Crear subcarpeta para la cavitat si no existe
    const nomSubcarpeta = codiCavitat;
    let subcarpeta;
    const subcarpetesExistents = carpeta.getFoldersByName(nomSubcarpeta);
    if (subcarpetesExistents.hasNext()) {
      subcarpeta = subcarpetesExistents.next();
    } else {
      subcarpeta = carpeta.createFolder(nomSubcarpeta);
    }
    
    // Subir archivo
    const arxiu = subcarpeta.createFile(arxiuBlob);
    
    // Hacer el archivo público para visualización
    arxiu.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      fileId: arxiu.getId(),
      fileName: nomArxiu,
      url: arxiu.getUrl(),
      downloadUrl: `https://drive.google.com/uc?id=${arxiu.getId()}`
    };
    
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
/**
 * Función para recibir datos del formulario HTML y guardarlos en Google Sheets y Drive
 */
function guardarDadesCavitat(dades) {
  try {
    // Crear carpetas si no existen
    const carpetes = crearCarpetasSiNoExisten();
    
    // Abrir el Google Sheet
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    
    // Obtener las hojas
    const hojaMain = spreadsheet.getSheetByName('Dades') || spreadsheet.insertSheet('Dades');
    const hojaPous = spreadsheet.getSheetByName('Pous') || spreadsheet.insertSheet('Pous');
    const hojaSales = spreadsheet.getSheetByName('Sales') || spreadsheet.insertSheet('Sales');
    const hojaTopos = spreadsheet.getSheetByName('Topos') || spreadsheet.insertSheet('Topos');
    const hojaFotos = spreadsheet.getSheetByName('Fotos') || spreadsheet.insertSheet('Fotos');
    const hojaBiblio = spreadsheet.getSheetByName('Bibliografia') || spreadsheet.insertSheet('Bibliografia');
    
    // Procesar archivos subidos
    let urlsTopos = [];
    let urlsFotos = [];
    
    // Subir topografías si existen
    if (dades.topos_arxius && dades.topos_arxius.length > 0) {
      for (let i = 0; i < dades.topos_arxius.length; i++) {
        const arxiu = dades.topos_arxius[i];
        const resultat = subirArxiu(arxiu.data, arxiu.name, carpetes.toposId, dades.codi_id);
        if (resultat.success) {
          urlsTopos.push(resultat.url);
        }
      }
    }
    
    // Subir fotos si existen
    if (dades.fotos_arxius && dades.fotos_arxius.length > 0) {
      for (let i = 0; i < dades.fotos_arxius.length; i++) {
        const arxiu = dades.fotos_arxius[i];
        const resultat = subirArxiu(arxiu.data, arxiu.name, carpetes.fotosId, dades.codi_id);
        if (resultat.success) {
          urlsFotos.push(resultat.url);
        }
      }
    }
    
    // Preparar datos para la hoja principal 'Dades'
    const dadesMain = [
      dades.codi_id || '',
      dades.nom || '',
      dades.alies || '',
      dades.municipi || '',
      dades.zona_utm || '',
      dades.datum || '',
      dades.precisio || '',
      parseFloat(dades.est_x) || '',
      parseFloat(dades.nort_y) || '',
      parseFloat(dades.z) || '',
      parseFloat(dades.latitud) || '',
      parseFloat(dades.longitud) || '',
      dades.latitud_gms || '',
      dades.longitud_gms || '',
      parseFloat(dades.recorregut_real) || '',
      parseFloat(dades.recorregut_planta) || '',
      parseFloat(dades.profunditat) || '',
      dades.genesis || '',
      dades.interes_multiple || dades.interes || '',
      dades.descripcio || '',
      new Date() // Data de creació
    ];
    
    // Crear encabezados si la hoja está vacía
    if (hojaMain.getLastRow() === 0) {
      const encabezadosMain = [
        'Codi ID', 'Nom', 'Àlies', 'Municipi', 'Zona UTM', 'Datum', 'Precisió',
        'Est(X)', 'Nort(Y)', 'Z', 'Latitud', 'Longitud', 'Latitud GMS', 'Longitud GMS',
        'Recorregut Real', 'Recorregut Planta', 'Profunditat',
        'Gènesi', 'Interès', 'Descripció', 'Data Creació'
      ];
      hojaMain.getRange(1, 1, 1, encabezadosMain.length).setValues([encabezadosMain]);
    }
    
    // Agregar datos a la hoja principal
    hojaMain.appendRow(dadesMain);
    
    // Guardar datos dinámicos de Pous
    if (hojaPous.getLastRow() === 0) {
      hojaPous.getRange(1, 1, 1, 6).setValues([['Codi ID', 'Nom Cavitat', 'Nom Pou', 'Profunditat', 'Amplada', 'Observacions']]);
    }
    
    // Procesar todos los pozos dinámicos
    Object.keys(dades).forEach(key => {
      if (key.startsWith('pou_nom_')) {
        const pouNumber = key.split('_')[2];
        const dadesPou = [
          dades.codi_id || '',
          dades.nom || '',
          dades[`pou_nom_${pouNumber}`] || '',
          parseFloat(dades[`pou_profunditat_${pouNumber}`]) || '',
          parseFloat(dades[`pou_amplada_${pouNumber}`]) || '',
          dades[`pou_observacions_${pouNumber}`] || ''
        ];
        hojaPous.appendRow(dadesPou);
      }
    });

    // Guardar datos dinámicos de Sales
    if (hojaSales.getLastRow() === 0) {
      hojaSales.getRange(1, 1, 1, 10).setValues([['Codi ID', 'Nom Cavitat', 'Nom Sala', 'Descripció', 'Llargaria', 'Amplaria', 'Altura', 'Superficie', 'Volum', 'Observacions']]);
    }
    
    // Procesar todas las salas dinámicas
    Object.keys(dades).forEach(key => {
      if (key.startsWith('sala_nom_')) {
        const salaNumber = key.split('_')[2];
        const dadesSala = [
          dades.codi_id || '',
          dades.nom || '',
          dades[`sala_nom_${salaNumber}`] || '',
          dades[`sala_descripcio_${salaNumber}`] || '',
          parseFloat(dades[`sala_llargaria_${salaNumber}`]) || '',
          parseFloat(dades[`sala_amplaria_${salaNumber}`]) || '',
          parseFloat(dades[`sala_altura_${salaNumber}`]) || '',
          parseFloat(dades[`sala_superficie_${salaNumber}`]) || '',
          parseFloat(dades[`sala_volum_${salaNumber}`]) || '',
          dades[`sala_observacions_${salaNumber}`] || ''
        ];
        hojaSales.appendRow(dadesSala);
      }
    });
    
    // Guardar datos de topografía con enlaces a Drive
    if (urlsTopos.length > 0 || dades.topos_comentari) {
      if (hojaTopos.getLastRow() === 0) {
        hojaTopos.getRange(1, 1, 1, 4).setValues([['Codi ID', 'Nom Cavitat', 'Enllaços Drive', 'Comentari']]);
      }
      
      const dadesTopos = [
        dades.codi_id || '',
        dades.nom || '',
        urlsTopos.join(', '),
        dades.topos_comentari || ''
      ];
      hojaTopos.appendRow(dadesTopos);
    }
    
    // Guardar datos de fotografías con enlaces a Drive
    if (urlsFotos.length > 0 || dades.fotos_comentari) {
      if (hojaFotos.getLastRow() === 0) {
        hojaFotos.getRange(1, 1, 1, 4).setValues([['Codi ID', 'Nom Cavitat', 'Enllaços Drive', 'Comentari']]);
      }
      
      const dadesFotos = [
        dades.codi_id || '',
        dades.nom || '',
        urlsFotos.join(', '),
        dades.fotos_comentari || ''
      ];
      hojaFotos.appendRow(dadesFotos);
    }
    
    // Guardar datos bibliográficos si existen
    if (dades.biblio_article || dades.biblio_autor || dades.biblio_llibre) {
      if (hojaBiblio.getLastRow() === 0) {
        hojaBiblio.getRange(1, 1, 1, 10).setValues([['Codi id', 'Article', 'Autor', 'Llibre', 'Editorial', 'ISBN', 'Data', 'Tema', 'Tipus', 'Enllaç']]);
      }
      
      const dadesBiblio = [
        dades.codi_id || '',
        dades.biblio_article || '',
        dades.biblio_autor || '',
        dades.biblio_llibre || '',
        dades.biblio_editorial || '',
        dades.biblio_isbn || '',
        dades.biblio_data || '',
        dades.biblio_tema || '',
        dades.biblio_tipus || '',
        dades.biblio_enllac || ''
      ];
      hojaBiblio.appendRow(dadesBiblio);
    }
    
    return {
      success: true,
      message: 'Dades guardades correctament a Google Sheets i Drive',
      codiId: dades.codi_id,
      fotosSubides: urlsFotos.length,
      toposSubides: urlsTopos.length
    };
    
  } catch (error) {
    console.error('Error al guardar dades:', error);
    return {
      success: false,
      message: 'Error al guardar les dades: ' + error.toString()
    };
  }
}

/**
 * Función para obtener la lista de municipios desde la hoja Metadata
 */
function obtenirMunicipis() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const hojaMetadata = spreadsheet.getSheetByName('Metadata');
    
    if (!hojaMetadata) {
      return { success: false, message: 'No s\'ha trobat la hoja Metadata' };
    }
    
    const dades = hojaMetadata.getDataRange().getValues();
    const municipis = {};
    
    for (let i = 1; i < dades.length; i++) {
      const municipi = dades[i][4]; // Columna Municipis
      const codi = dades[i][5];     // Columna amb codi
      
      if (municipi && codi) {
        municipis[municipi] = codi;
      }
    }
    
    return { success: true, municipis: municipis };
    
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * Función para obtener el siguiente ID disponible para un municipio
 */
function obtenirSeguentId(codiMunicipi) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const hojaDades = spreadsheet.getSheetByName('Dades');
    
    if (!hojaDades || hojaDades.getLastRow() <= 1) {
      return 1; // Primer ID
    }
    
    const codisExistents = hojaDades.getRange(2, 1, hojaDades.getLastRow() - 1, 1).getValues();
    let maxId = 0;
    
    codisExistents.forEach(row => {
      const codi = row[0].toString();
      if (codi.startsWith(codiMunicipi + '-')) {
        const numero = parseInt(codi.split('-')[1]);
        if (numero > maxId) {
          maxId = numero;
        }
      }
    });
    
    return maxId + 1;
    
  } catch (error) {
    console.error('Error al obtenir següent ID:', error);
    return 1;
  }
}

/**
 * Función para crear un servicio web que permita enviar datos desde el formulario HTML
 */
function doPost(e) {
  try {
    const dades = JSON.parse(e.postData.contents);
    const resultat = guardarDadesCavitat(dades);
    
    const response = ContentService
      .createTextOutput(JSON.stringify(resultat))
      .setMimeType(ContentService.MimeType.JSON);
      
    // Añadir headers CORS para permitir peticiones desde GitHub Pages
    return addCorsHeaders(response);
      
  } catch (error) {
    const errorResponse = ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al processar les dades: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
    return addCorsHeaders(errorResponse);
  }
}

/**
 * Función para obtener datos (GET requests)
 */
function doGet(e) {
  const action = e.parameter.action;
  let responseData;
  
  switch (action) {
    case 'municipis':
      const municipis = obtenirMunicipis();
      responseData = municipis;
      break;
        
    case 'nextId':
      const codiMunicipi = e.parameter.codi;
      const nextId = obtenirSeguentId(codiMunicipi);
      responseData = { nextId: nextId };
      break;
        
    default:
      responseData = { error: 'Acció no reconeguda' };
      break;
  }
  
  const response = ContentService
    .createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
    
  return addCorsHeaders(response);
}

/**
 * Función para añadir headers CORS a las respuestas
 */
function addCorsHeaders(response) {
  // Permitir peticiones desde cualquier origen (necesario para GitHub Pages)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Max-Age', '3600');
  
  return response;
}

// Instrucciones de configuración:
// 1. Copia este código en un nuevo proyecto de Google Apps Script
// 2. En CONFIG, reemplaza:
//    - 'TU_GOOGLE_SHEET_ID_AQUI' con el ID real de tu Google Sheet
//    - 'TU_CARPETA_DRIVE_ID_AQUI' con el ID de tu carpeta raíz en Google Drive
// 3. Autoriza los permisos necesarios (Drive, Sheets)
// 4. Despliega el script como aplicación web con acceso a "Anyone"
// 5. Copia la URL generada y úsala en el formulario HTML
// 6. Las carpetas 'Fotos_Cavitats' y 'Topografies_Cavitats' se crearán automáticamente

/*
Estructura de carpetas que se creará en Google Drive:
📁 Carpeta Raíz (CONFIG.DRIVE_FOLDER_ID)
├── 📁 Fotos_Cavitats/
│   ├── 📁 ARM-001/
│   │   ├── 🖼️ foto1.jpg
│   │   └── 🖼️ foto2.jpg
│   └── 📁 MOR-001/
│       └── 🖼️ foto1.jpg
└── 📁 Topografies_Cavitats/
    ├── 📁 ARM-001/
    │   └── 📄 topo1.pdf
    └── 📁 MOR-001/
        └── 📄 topo1.svg
*/
