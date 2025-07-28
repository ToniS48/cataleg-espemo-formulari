// API SERVICE COMPLETO - ESPEMO
// Servicio para manejar llamadas al API de Google Apps Script con CRUD completo

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
            
            // Crear elemento script
            scriptElement = document.createElement('script');
            scriptElement.src = jsonpUrl;
            scriptElement.async = true;
            
            // Manejar errores de carga del script
            scriptElement.onerror = function(error) {
                if (resolved) return;
                resolved = true;
                
                console.error('❌ Error cargando script JSONP:', {
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
            
            // Timeout extendido
            timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    console.warn('⚠️ JSONP timeout después de 30 segundos');
                    cleanup();
                    reject(new Error('JSONP request timeout (30s)'));
                }
            }, 30000);
            
            // Añadir script al DOM para ejecutar la petición
            console.log('📤 Añadiendo script JSONP al DOM...');
            document.head.appendChild(scriptElement);
        });
    }

    // ====== MÉTODO PRINCIPAL PARA HACER PETICIONES ======
    async makeRequest(action, params = {}) {
        try {
            const baseUrl = this.getBaseUrl();
            const urlParams = new URLSearchParams({
                action: action,
                ...params
            });
            
            const fullUrl = `${baseUrl}?${urlParams.toString()}`;
            console.log(`📡 Petición a: ${action} | URL: ${fullUrl}`);
            
            const result = await this.jsonpRequest(fullUrl);
            
            if (result && result.success) {
                console.log(`✅ ${action} exitoso:`, result);
                return result;
            } else {
                console.warn(`⚠️ ${action} con errores:`, result);
                return result || { success: false, error: 'Sin respuesta del servidor' };
            }
            
        } catch (error) {
            console.error(`❌ Error en ${action}:`, error);
            throw error;
        }
    }

    // ====== MÉTODO PARA FORMDATA (LEGACY) ======
    async makeFormDataRequest(action, formData) {
        try {
            const baseUrl = this.getBaseUrl();
            
            // Añadir action al FormData
            formData.append('action', action);
            
            // Convertir FormData a parámetros URL para JSONP
            const params = {};
            for (let [key, value] of formData.entries()) {
                params[key] = value;
            }
            
            return await this.makeRequest(action, params);
            
        } catch (error) {
            console.error(`❌ Error en FormData request ${action}:`, error);
            throw error;
        }
    }

    // ====== MÉTODOS PRINCIPALES ======
    
    async ping() {
        console.log('🏓 Enviando ping al API...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'ESPEMO API CRUD funcionando correctamente (MOCK)',
                    timestamp: new Date().toISOString(),
                    version: '6.0.0-mock',
                    mode: 'DESARROLLO',
                    availableActions: ['ping', 'getStats', 'getAllCavitats', 'createCavitat', 'updateCavitat', 'deleteCavitat']
                };
            }
            
            const result = await this.makeRequest('ping');
            console.log('🏓 Ping exitoso:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Error en ping:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }
    
    async getStats() {
        console.log('📊 Obteniendo estadísticas...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: {
                        totalCavitats: 25,
                        totalMunicipis: 8,
                        totalFotos: 45,
                        totalTopos: 12,
                        totalPozos: 38,
                        totalSalas: 67,
                        profunditatMitjana: 28.5,
                        profunditatTotal: 712.5,
                        ultimaActualizacion: new Date().toISOString(),
                        version: '6.0.0'
                    }
                };
            }
            
            const result = await this.makeRequest('getStats');
            console.log('📊 Estadísticas obtenidas:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return {
                success: true,
                data: {
                    totalCavitats: 0,
                    totalMunicipis: 0,
                    totalFotos: 0,
                    totalTopos: 0,
                    totalPozos: 0,
                    totalSalas: 0,
                    ultimaActualizacion: new Date().toISOString()
                }
            };
        }
    }
    
    async getAllCavitats(params = {}) {
        console.log('📋 Obteniendo todas las cavitats...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: [
                        {
                            ID: 'CAV0001',
                            Nom: 'Cueva del Diablo',
                            Municipi: 'Barcelona',
                            Profunditat: 45,
                            Coordenades_UTM_X: 431234,
                            Coordenades_UTM_Y: 4612345,
                            Descripcio: 'Cavidad vertical con múltiples salas'
                        },
                        {
                            ID: 'CAV0002',
                            Nom: 'Avenc de la Roca',
                            Municipi: 'Girona',
                            Profunditat: 28,
                            Coordenades_UTM_X: 445678,
                            Coordenades_UTM_Y: 4623456,
                            Descripcio: 'Sima con características geológicas únicas'
                        }
                    ],
                    count: 2
                };
            }
            
            const result = await this.makeRequest('getAllCavitats', params);
            console.log(`📋 ${result.data?.length || 0} cavitats obtenidas`);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo cavitats:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    async getCavitatById(id) {
        console.log(`🔍 Obteniendo cavitat ID: ${id}...`);
        
        try {
            if (isDevMode()) {
                const mockData = await this.getAllCavitats();
                const cavitat = mockData.data.find(c => c.ID === id);
                return {
                    success: true,
                    data: cavitat || null
                };
            }
            
            const result = await this.makeRequest('getCavitatById', { id });
            console.log('🔍 Cavitat obtenida:', result.data?.Nom || 'No encontrada');
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo cavitat:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async searchCavitats(params) {
        console.log('🔍 Buscando cavitats con filtros...', params);
        
        try {
            if (isDevMode()) {
                const allCavitats = await this.getAllCavitats();
                let filtered = allCavitats.data;
                
                if (params.municipi) {
                    filtered = filtered.filter(c => c.Municipi && c.Municipi.toLowerCase().includes(params.municipi.toLowerCase()));
                }
                if (params.text) {
                    const searchText = params.text.toLowerCase();
                    filtered = filtered.filter(c => 
                        (c.Nom && c.Nom.toLowerCase().includes(searchText)) ||
                        (c.Descripcio && c.Descripcio.toLowerCase().includes(searchText))
                    );
                }
                if (params.profunditat_min) {
                    filtered = filtered.filter(c => (c.Profunditat || 0) >= parseFloat(params.profunditat_min));
                }
                if (params.profunditat_max) {
                    filtered = filtered.filter(c => (c.Profunditat || 0) <= parseFloat(params.profunditat_max));
                }
                
                return {
                    success: true,
                    data: filtered,
                    count: filtered.length,
                    filters_applied: params
                };
            }
            
            const result = await this.makeRequest('searchCavitats', params);
            console.log(`🔍 ${result.data?.length || 0} cavitats encontradas`);
            return result;
            
        } catch (error) {
            console.error('❌ Error buscando cavitats:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    async getMunicipis() {
        console.log('🏘️ Obteniendo municipios...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: ['Barcelona', 'Girona', 'Lleida', 'Tarragona', 'Vallès', 'Maresme'],
                    count: 6
                };
            }
            
            const result = await this.makeRequest('getMunicipis');
            console.log(`🏘️ ${result.data?.length || 0} municipios obtenidos`);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo municipios:', error);
            return {
                success: true,
                data: ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
                count: 4
            };
        }
    }
    
    // ====== CAVITATS - CRUD COMPLETO ======
    
    async createCavitat(data) {
        console.log('💾 Creando nueva cavitat...');
        
        try {
            if (isDevMode()) {
                console.log('🔧 Modo desarrollo - simulando creación...');
                return {
                    success: true,
                    message: 'Cavitat creada en modo desarrollo',
                    data: {
                        id: 'CAV' + Date.now(),
                        timestamp: new Date().toISOString()
                    }
                };
            }
            
            const result = await this.makeRequest('createCavitat', { data: JSON.stringify(data) });
            console.log('💾 Cavitat creada:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Error creando cavitat:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async saveCavitat(formData) {
        console.log('💾 Guardando cavitat (legacy)...');
        
        try {
            if (isDevMode()) {
                console.log('🔧 Modo desarrollo - simulando guardado...');
                return {
                    success: true,
                    message: 'Cavitat guardada en modo desarrollo',
                    data: {
                        id: 'CAV' + Date.now(),
                        timestamp: new Date().toISOString()
                    }
                };
            }
            
            // Modo producción - usar FormData real
            const result = await this.makeFormDataRequest('saveCavitat', formData);
            console.log('💾 Cavitat guardada:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Error guardando cavitat:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async updateCavitat(id, data) {
        console.log(`✏️ Actualizando cavitat ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Cavitat actualizada en modo desarrollo',
                    data: { id, timestamp_updated: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('updateCavitat', { id, data: JSON.stringify(data) });
            console.log('✏️ Cavitat actualizada:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Error actualizando cavitat:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async deleteCavitat(id) {
        console.log(`🗑️ Eliminando cavitat ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Cavitat eliminada en modo desarrollo',
                    data: { id, timestamp_deleted: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('deleteCavitat', { id });
            console.log('🗑️ Cavitat eliminada:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Error eliminando cavitat:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ====== POZOS - CRUD COMPLETO ======
    
    async getAllPozos(params = {}) {
        console.log('🕳️ Obteniendo pozos...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: [
                        { ID: 'POZ0001', cavitat_id: 'CAV0001', Nom: 'Pozo Principal', Profunditat: 15, Diametro: 2.5 },
                        { ID: 'POZ0002', cavitat_id: 'CAV0001', Nom: 'Pozo Secundario', Profunditat: 8, Diametro: 1.8 }
                    ],
                    count: 2
                };
            }
            
            const result = await this.makeRequest('getAllPozos', params);
            console.log(`🕳️ ${result.data?.length || 0} pozos obtenidos`);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo pozos:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    async createPozo(data) {
        console.log('🕳️ Creando nuevo pozo...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Pozo creado en modo desarrollo',
                    data: { id: 'POZ' + Date.now(), timestamp: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('createPozo', { data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error creando pozo:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updatePozo(id, data) {
        console.log(`🕳️ Actualizando pozo ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Pozo actualizado en modo desarrollo',
                    data: { id, timestamp_updated: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('updatePozo', { id, data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error actualizando pozo:', error);
            return { success: false, error: error.message };
        }
    }
    
    async deletePozo(id) {
        console.log(`🕳️ Eliminando pozo ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Pozo eliminado en modo desarrollo',
                    data: { id, timestamp_deleted: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('deletePozo', { id });
            return result;
            
        } catch (error) {
            console.error('❌ Error eliminando pozo:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ====== SALAS - CRUD COMPLETO ======
    
    async getAllSalas(params = {}) {
        console.log('🏛️ Obteniendo salas...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: [
                        { ID: 'SAL0001', cavitat_id: 'CAV0001', Nom: 'Sala Principal', Longitud: 20, Amplada: 15, Alçada: 8 },
                        { ID: 'SAL0002', cavitat_id: 'CAV0001', Nom: 'Sala Lateral', Longitud: 12, Amplada: 8, Alçada: 5 }
                    ],
                    count: 2
                };
            }
            
            const result = await this.makeRequest('getAllSalas', params);
            console.log(`🏛️ ${result.data?.length || 0} salas obtenidas`);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo salas:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    async createSala(data) {
        console.log('🏛️ Creando nueva sala...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Sala creada en modo desarrollo',
                    data: { id: 'SAL' + Date.now(), timestamp: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('createSala', { data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error creando sala:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updateSala(id, data) {
        console.log(`🏛️ Actualizando sala ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Sala actualizada en modo desarrollo',
                    data: { id, timestamp_updated: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('updateSala', { id, data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error actualizando sala:', error);
            return { success: false, error: error.message };
        }
    }
    
    async deleteSala(id) {
        console.log(`🏛️ Eliminando sala ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Sala eliminada en modo desarrollo',
                    data: { id, timestamp_deleted: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('deleteSala', { id });
            return result;
            
        } catch (error) {
            console.error('❌ Error eliminando sala:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ====== FOTOS - CRUD COMPLETO ======
    
    async getAllFotos(params = {}) {
        console.log('📸 Obteniendo fotos...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: [
                        { ID: 'FOT0001', cavitat_id: 'CAV0001', Nom: 'Entrada principal', URL: 'https://example.com/foto1.jpg', Descripcio: 'Vista de la entrada' },
                        { ID: 'FOT0002', cavitat_id: 'CAV0001', Nom: 'Interior', URL: 'https://example.com/foto2.jpg', Descripcio: 'Sala principal' }
                    ],
                    count: 2
                };
            }
            
            const result = await this.makeRequest('getAllFotos', params);
            console.log(`📸 ${result.data?.length || 0} fotos obtenidas`);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo fotos:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    async createFoto(data) {
        console.log('📸 Creando referencia de foto...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Foto creada en modo desarrollo',
                    data: { id: 'FOT' + Date.now(), timestamp: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('createFoto', { data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error creando foto:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updateFoto(id, data) {
        console.log(`📸 Actualizando foto ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Foto actualizada en modo desarrollo',
                    data: { id, timestamp_updated: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('updateFoto', { id, data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error actualizando foto:', error);
            return { success: false, error: error.message };
        }
    }
    
    async deleteFoto(id) {
        console.log(`📸 Eliminando foto ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Foto eliminada en modo desarrollo',
                    data: { id, timestamp_deleted: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('deleteFoto', { id });
            return result;
            
        } catch (error) {
            console.error('❌ Error eliminando foto:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ====== TOPOGRAFÍAS - CRUD COMPLETO ======
    
    async getAllTopos(params = {}) {
        console.log('🗺️ Obteniendo topografías...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: [
                        { ID: 'TOP0001', cavitat_id: 'CAV0001', Nom: 'Planta general', Tipus: 'Planta', URL: 'https://example.com/topo1.pdf' },
                        { ID: 'TOP0002', cavitat_id: 'CAV0001', Nom: 'Sección longitudinal', Tipus: 'Sección', URL: 'https://example.com/topo2.pdf' }
                    ],
                    count: 2
                };
            }
            
            const result = await this.makeRequest('getAllTopos', params);
            console.log(`🗺️ ${result.data?.length || 0} topografías obtenidas`);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo topografías:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    async createTopo(data) {
        console.log('🗺️ Creando nueva topografía...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Topografía creada en modo desarrollo',
                    data: { id: 'TOP' + Date.now(), timestamp: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('createTopo', { data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error creando topografía:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updateTopo(id, data) {
        console.log(`🗺️ Actualizando topografía ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Topografía actualizada en modo desarrollo',
                    data: { id, timestamp_updated: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('updateTopo', { id, data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error actualizando topografía:', error);
            return { success: false, error: error.message };
        }
    }
    
    async deleteTopo(id) {
        console.log(`🗺️ Eliminando topografía ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Topografía eliminada en modo desarrollo',
                    data: { id, timestamp_deleted: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('deleteTopo', { id });
            return result;
            
        } catch (error) {
            console.error('❌ Error eliminando topografía:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ====== BIBLIOGRAFÍA - CRUD COMPLETO ======
    
    async getAllBiblio(params = {}) {
        console.log('📚 Obteniendo bibliografía...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    data: [
                        { ID: 'BIB0001', cavitat_id: 'CAV0001', Titol: 'Estudio espeleológico', Autor: 'J. García', Any: 2020 },
                        { ID: 'BIB0002', cavitat_id: 'CAV0001', Titol: 'Análisis geológico', Autor: 'M. López', Any: 2021 }
                    ],
                    count: 2
                };
            }
            
            const result = await this.makeRequest('getAllBiblio', params);
            console.log(`📚 ${result.data?.length || 0} referencias bibliográficas obtenidas`);
            return result;
            
        } catch (error) {
            console.error('❌ Error obteniendo bibliografía:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    
    async createBiblio(data) {
        console.log('📚 Creando nueva referencia bibliográfica...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Bibliografía creada en modo desarrollo',
                    data: { id: 'BIB' + Date.now(), timestamp: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('createBiblio', { data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error creando bibliografía:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updateBiblio(id, data) {
        console.log(`📚 Actualizando bibliografía ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Bibliografía actualizada en modo desarrollo',
                    data: { id, timestamp_updated: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('updateBiblio', { id, data: JSON.stringify(data) });
            return result;
            
        } catch (error) {
            console.error('❌ Error actualizando bibliografía:', error);
            return { success: false, error: error.message };
        }
    }
    
    async deleteBiblio(id) {
        console.log(`📚 Eliminando bibliografía ${id}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Bibliografía eliminada en modo desarrollo',
                    data: { id, timestamp_deleted: new Date().toISOString() }
                };
            }
            
            const result = await this.makeRequest('deleteBiblio', { id });
            return result;
            
        } catch (error) {
            console.error('❌ Error eliminando bibliografía:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ====== UTILIDADES ======
    
    async backup() {
        console.log('💾 Creando backup...');
        
        try {
            if (isDevMode()) {
                return {
                    success: true,
                    message: 'Backup simulado en modo desarrollo',
                    data: {
                        backupId: 'backup_' + Date.now(),
                        timestamp: new Date().toISOString(),
                        sheetsCount: 6
                    }
                };
            }
            
            const result = await this.makeRequest('backup');
            return result;
            
        } catch (error) {
            console.error('❌ Error creando backup:', error);
            return { success: false, error: error.message };
        }
    }
    
    async restore(backupId) {
        console.log(`🔄 Restaurando backup ${backupId}...`);
        
        try {
            if (isDevMode()) {
                return {
                    success: false,
                    error: 'Restauración no disponible en modo desarrollo'
                };
            }
            
            const result = await this.makeRequest('restore', { backupId });
            return result;
            
        } catch (error) {
            console.error('❌ Error restaurando backup:', error);
            return { success: false, error: error.message };
        }
    }
}

// Crear instancia global
const apiService = new ApiService();
