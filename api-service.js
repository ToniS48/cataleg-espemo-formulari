// API SERVICE - ESPEMO
// Servicio para manejar llamadas al API de Google Apps Script y datos mock

class ApiService {
    constructor() {
        console.log(`🔧 ApiService iniciado en modo: ${isDevMode() ? 'DESARROLLO (mock)' : 'PRODUCCIÓN (real)'}`);
    }
    
    // Obtener URL base dinámicamente
    getBaseUrl() {
        return getApiUrl();
    }

    // ====== MÉTODO JSONP PARA EVITAR CORS ======
    async jsonpRequest(url) {
        return new Promise((resolve, reject) => {
            // Crear nombre único para el callback
            const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Añadir parámetro de callback a la URL
            const jsonpUrl = url + (url.includes('?') ? '&' : '?') + `callback=${callbackName}`;
            console.log('📡 JSONP URL:', jsonpUrl);
            
            let scriptElement = null;
            let timeoutId = null;
            let resolved = false;
            
            // Función de limpieza
            const cleanup = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                if (scriptElement && scriptElement.parentNode) {
                    scriptElement.parentNode.removeChild(scriptElement);
                }
                if (window[callbackName]) {
                    delete window[callbackName];
                }
            };
            
            // Crear función de callback global
            window[callbackName] = function(data) {
                if (resolved) return; // Evitar múltiples callbacks
                resolved = true;
                
                console.log('✅ JSONP callback recibido:', data);
                cleanup();
                resolve(data);
            };
            
            // Crear script tag
            scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.async = true;
            scriptElement.src = jsonpUrl;
            
            scriptElement.onload = function() {
                console.log('📄 Script JSONP cargado exitosamente');
                // No hacer nada aquí, esperar al callback
                // Si después de 5 segundos no hay callback, considerar como error
                setTimeout(() => {
                    if (!resolved) {
                        console.warn('⚠️ Script cargado pero callback no ejecutado después de 5s');
                        if (!resolved) {
                            resolved = true;
                            cleanup();
                            reject(new Error('JSONP callback not executed after script load'));
                        }
                    }
                }, 5000);
            };
            
            scriptElement.onerror = function(error) {
                if (resolved) return;
                resolved = true;
                
                console.error('❌ JSONP script error:', error);
                console.error('❌ Error details:', {
                    url: jsonpUrl,
                    error: error,
                    script: scriptElement,
                    readyState: scriptElement.readyState,
                    type: error.type,
                    message: error.message
                });
                
                cleanup();
                reject(new Error(`JSONP script load failed: ${error.message || error.type || 'Unknown error'}`));
            };
            
            // Timeout extendido para depurar
            timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    console.warn('⚠️ JSONP timeout después de 30 segundos');
                    console.warn('⚠️ Script state:', {
                        exists: !!scriptElement,
                        parentNode: scriptElement?.parentNode,
                        src: scriptElement?.src,
                        readyState: scriptElement?.readyState,
                        callbackExists: !!window[callbackName]
                    });
                    
                    cleanup();
                    reject(new Error('JSONP request timeout (30s)'));
                }
            }, 30000); // 30 segundos para depurar
            
            // Añadir script al DOM para ejecutar la petición
            console.log('📤 Añadiendo script JSONP al DOM...');
            document.head.appendChild(scriptElement);
        });
    }

    // ====== MÉTODO FETCH CON TIMEOUT (FALLBACK) ======
    async makeApiCall(endpoint, params = {}, method = 'GET') {
        // Verificar modo actual dinámicamente
        const currentDevMode = isDevMode(); // Llamar a la función global cada vez
        console.log(`🔍 makeApiCall - endpoint: ${endpoint}, devMode: ${currentDevMode}, DEV_MODE: ${API_CONFIG.DEV_MODE}`);
        
        // Si estamos en modo desarrollo, usar datos mock
        if (currentDevMode) {
            return this.handleMockCall(endpoint, params, method);
        }

        // Modo producción: SOLO JSONP (NO FETCH) para evitar CORS completamente
        try {
            console.log(`🌐 Llamada API real (SOLO JSONP): ${endpoint}`, params);
            
            const baseUrl = this.getBaseUrl();
            if (!baseUrl) {
                throw new Error('URL del API no configurada');
            }
            
            // Crear URL con parámetros GET
            const url = new URL(baseUrl);
            url.searchParams.append('action', endpoint);
            
            // Añadir parámetros como GET
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    url.searchParams.append(key, params[key]);
                }
            });
            
            console.log('📡 URL completa JSONP:', url.toString());
            
            // Usar ÚNICAMENTE JSONP
            const data = await this.jsonpRequest(url.toString());
            console.log(`✅ Respuesta API JSONP exitosa:`, data);
            
            return data;

        } catch (error) {
            console.error(`❌ Error en llamada API ${endpoint}:`, error);
            throw error;
        }
    }

    // ====== MANEJO DE DATOS MOCK PARA DESARROLLO ======
    async handleMockCall(endpoint, params = {}, method = 'GET') {
        console.log(`🎭 Mock call: ${endpoint}`, params);
        
        // Simular delay de red
        await this.simulateNetworkDelay(300, 800);

        switch (endpoint) {
            case API_CONFIG.ENDPOINTS.GET_ALL_CAVITATS:
                return {
                    success: true,
                    data: MOCK_DATA.cavitats,
                    count: MOCK_DATA.cavitats.length
                };

            case API_CONFIG.ENDPOINTS.GET_CAVITAT_BY_ID:
                const cavitat = MOCK_DATA.getCavitatById(params.id);
                return {
                    success: true,
                    data: cavitat,
                    found: !!cavitat
                };

            case API_CONFIG.ENDPOINTS.GET_STATS:
                return {
                    success: true,
                    data: MOCK_DATA.getStats()
                };

            case API_CONFIG.ENDPOINTS.GET_MUNICIPIS:
                return {
                    success: true,
                    data: MOCK_DATA.getMunicipis()
                };

            case API_CONFIG.ENDPOINTS.CREATE_CAVITAT:
                // Simular creación
                console.log('🎭 Mock: Creando cavitat', params);
                return {
                    success: true,
                    data: { id: 'NEW-' + Date.now(), ...params },
                    message: 'Cavitat creada correctamente (mock)'
                };

            case API_CONFIG.ENDPOINTS.UPDATE_CAVITAT:
                // Simular actualización
                console.log('🎭 Mock: Actualizando cavitat', params);
                return {
                    success: true,
                    data: { id: params.id, ...params },
                    message: 'Cavitat actualizada correctamente (mock)'
                };

            default:
                throw new Error(`Endpoint mock no implementado: ${endpoint}`);
        }
    }

    // ====== MÉTODOS ESPECÍFICOS PARA CAVITATS ======
    async getAllCavitats(filters = {}) {
        try {
            const response = await this.makeApiCall(API_CONFIG.ENDPOINTS.GET_ALL_CAVITATS, filters);
            
            if (!response.success) {
                throw new Error(response.error || 'Error obteniendo cavitats');
            }

            return response.data || [];
        } catch (error) {
            console.error('❌ Error obteniendo todas las cavitats:', error);
            throw error;
        }
    }

    async getCavitatById(id) {
        try {
            const response = await this.makeApiCall(API_CONFIG.ENDPOINTS.GET_CAVITAT_BY_ID, { id });
            
            if (!response.success) {
                throw new Error(response.error || 'Error obteniendo cavitat');
            }

            return response.data;
        } catch (error) {
            console.error(`❌ Error obteniendo cavitat ${id}:`, error);
            throw error;
        }
    }

    async getStats() {
        try {
            const response = await this.makeApiCall(API_CONFIG.ENDPOINTS.GET_STATS);
            
            if (!response.success) {
                throw new Error(response.error || 'Error obteniendo estadísticas');
            }

            return response.data;
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    async getMunicipis() {
        try {
            const response = await this.makeApiCall(API_CONFIG.ENDPOINTS.GET_MUNICIPIS);
            
            if (!response.success) {
                throw new Error(response.error || 'Error obteniendo municipios');
            }

            return response.data;
        } catch (error) {
            console.error('❌ Error obteniendo municipios:', error);
            throw error;
        }
    }

    async createCavitat(cavitatData) {
        try {
            const response = await this.makeApiCall(API_CONFIG.ENDPOINTS.CREATE_CAVITAT, cavitatData, 'POST');
            
            if (!response.success) {
                throw new Error(response.error || 'Error creando cavitat');
            }

            return response.data;
        } catch (error) {
            console.error('❌ Error creando cavitat:', error);
            throw error;
        }
    }

    async updateCavitat(id, cavitatData) {
        try {
            const response = await this.makeApiCall(API_CONFIG.ENDPOINTS.UPDATE_CAVITAT, { id, ...cavitatData }, 'POST');
            
            if (!response.success) {
                throw new Error(response.error || 'Error actualizando cavitat');
            }

            return response.data;
        } catch (error) {
            console.error(`❌ Error actualizando cavitat ${id}:`, error);
            throw error;
        }
    }

    // ====== UTILIDADES ======
    async fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    async simulateNetworkDelay(min = 300, max = 800) {
        const delay = Math.random() * (max - min) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // ====== VERIFICACIÓN DE CONECTIVIDAD ======
    async testConnection() {
        try {
            console.log('🔌 Probando conexión con el API...');
            
            if (isDevMode()) {
                console.log('✅ Conexión OK (modo desarrollo - datos mock)');
                return { success: true, mode: 'development' };
            }

            const response = await this.makeApiCall('ping');
            console.log('✅ Conexión con Google Apps Script OK');
            return { success: true, mode: 'production' };
            
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            return { success: false, error: error.message, mode: 'offline' };
        }
    }
}

// ====== INSTANCIA GLOBAL ======
// Crear instancia global del servicio
let apiService;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    apiService = new ApiService();
    console.log('🚀 ApiService disponible globalmente');
});
