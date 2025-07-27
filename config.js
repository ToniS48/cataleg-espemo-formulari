// Configuración de entorno para el formulario ESPEMO
// Este archivo contiene configuraciones que pueden ser públicas

const CONFIG = {
    // Configuración de desarrollo (para pruebas locales)
    development: {
        GOOGLE_SCRIPT_URL: null, // Usa fallback JSON
        ENABLE_GOOGLE_INTEGRATION: false,
        DEBUG_MODE: true
    },
    
    // Configuración de producción (para GitHub Pages)
    production: {
        GOOGLE_SCRIPT_URL: 'URL_SERA_CONFIGURADA_POR_ADMINISTRADOR',
        ENABLE_GOOGLE_INTEGRATION: true,
        DEBUG_MODE: false
    },
    
    // Configuración general (siempre pública)
    general: {
        APP_NAME: 'Formulari ESPEMO',
        VERSION: '1.0.0',
        AUTHOR: 'ESPEMO',
        CONTACT: 'tonisoler@espemo.org'
    }
};

// Detectar entorno automáticamente
const isGitHubPages = window.location.hostname.includes('github.io');
const currentConfig = isGitHubPages ? CONFIG.production : CONFIG.development;

// Exportar configuración actual
window.ESPEMO_CONFIG = {
    ...CONFIG.general,
    ...currentConfig
};
