// Configuración de entorno para el formulario ESPEMO
// Este archivo contiene configuraciones que pueden ser públicas

const CONFIG = {
    // Configuración de desarrollo (para pruebas locales) - TEMPORAL CON GOOGLE HABILITADO
    development: {
        GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwhFkJ9MpAKgi2dKrT0e59KfN7DpzrlTuJnaPRsloEIDD0At0_axxZhh0MLCjRDuexHlA/exec',
        ENABLE_GOOGLE_INTEGRATION: true,
        DEBUG_MODE: true
    },
    
    // Configuración de producción (para GitHub Pages)
    production: {
        GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwhFkJ9MpAKgi2dKrT0e59KfN7DpzrlTuJnaPRsloEIDD0At0_axxZhh0MLCjRDuexHlA/exec',
        ENABLE_GOOGLE_INTEGRATION: true,
        DEBUG_MODE: false
    },
    
    // Configuración general (siempre pública)
    general: {
        APP_NAME: 'Formulari ESPEMO',
        VERSION: '1.0.8',
        AUTHOR: 'ESPEMO',
        CONTACT: 'tonisoler@espemo.org'
    }
};

// Detectar entorno automáticamente
const isGitHubPages = window.location.hostname.includes('github.io');
const currentConfig = isGitHubPages ? CONFIG.production : CONFIG.development;

// Debug información
console.log('ESPEMO Config Debug:', {
    hostname: window.location.hostname,
    isGitHubPages: isGitHubPages,
    environment: isGitHubPages ? 'production' : 'development',
    currentConfig: currentConfig
});

// Exportar configuración actual
window.ESPEMO_CONFIG = {
    ...CONFIG.general,
    ...currentConfig
};
