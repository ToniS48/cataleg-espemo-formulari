// API CONFIGURATION - ESPEMO
// Configuración para conexión con Google Apps Script

const API_CONFIG = {
    // URL del Google Apps Script desplegado (NUEVA implementación con CORS y API)
    GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwhFkJ9MpAKgi2dKrT0e59KfN7DpzrlTuJnaPRsloEIDD0At0_axxZhh0MLCjRDuexHlA/exec',
    
    // Endpoints disponibles
    ENDPOINTS: {
        GET_ALL_CAVITATS: 'getAllCavitats',
        GET_CAVITAT_BY_ID: 'getCavitatById',
        CREATE_CAVITAT: 'createCavitat',
        UPDATE_CAVITAT: 'updateCavitat',
        DELETE_CAVITAT: 'deleteCavitat',
        GET_STATS: 'getStats',
        GET_MUNICIPIS: 'getMunicipis'
    },
    
    // Configuración de timeouts
    TIMEOUT: 30000, // 30 segundos
    RETRY_ATTEMPTS: 3,
    
    // Modo de desarrollo (usar datos mock)
    DEV_MODE: false, // Cambiado a false para probar la nueva implementación con CORS
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Función para verificar si estamos en modo desarrollo
function isDevMode() {
    // Detectar hostname actual
    const hostname = window.location.hostname;
    
    // Solo usar modo desarrollo si estamos en localhost
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
    
    // GitHub Pages y otros dominios públicos usan modo producción
    if (hostname.includes('github.io') || hostname.includes('pages.dev') || hostname.includes('netlify.app')) {
        console.log(`🌐 Detectado hosting público: ${hostname} - Modo PRODUCCIÓN`);
        return false; // Forzar modo producción
    }
    
    // Solo localhost usa desarrollo
    if (isLocalhost) {
        console.log(`🏠 Detectado localhost: ${hostname} - Modo DESARROLLO`);
        return true;
    }
    
    // Por defecto, usar producción para cualquier otro dominio
    console.log(`🌐 Dominio: ${hostname} - Modo PRODUCCIÓN por defecto`);
    return false;
}

// Función para obtener la URL base del API
function getApiUrl() {
    const devMode = isDevMode();
    console.log(`🔧 getApiUrl() - DEV_MODE: ${API_CONFIG.DEV_MODE}, isDevMode: ${devMode}`);
    
    if (devMode) {
        console.log('🔧 Modo desarrollo: usando datos mock');
        return null; // Usar datos mock
    }
    
    console.log('🌐 Modo producción: usando Google Apps Script');
    return API_CONFIG.GOOGLE_APPS_SCRIPT_URL;
}

// Añadir método al objeto API_CONFIG
API_CONFIG.isDevelopmentMode = isDevMode;
