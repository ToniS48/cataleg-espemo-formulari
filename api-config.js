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
    // MODO INTELIGENTE: Detectar automáticamente el entorno
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
    
    // En local: usar mock para desarrollo rápido
    // En producción (GitHub Pages): intentar Google Apps Script, fallback a mock
    return isLocal || API_CONFIG.DEV_MODE;
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
