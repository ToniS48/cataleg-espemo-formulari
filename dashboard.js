// DASHBOARD JAVASCRIPT - ESPEMO
// Funcionalidad principal del dashboard

// Variables globales
let currentData = [];
let selectedCavitat = null;
let currentView = 'list';

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Dashboard ESPEMO iniciado');
    initializeDashboard();
});

async function initializeDashboard() {
    try {
        console.log('🎯 Iniciando dashboard...');
        
        // Esperar a que ApiService esté disponible
        if (typeof apiService === 'undefined') {
            console.log('⏳ Esperando ApiService...');
            await new Promise(resolve => {
                const checkService = () => {
                    if (typeof apiService !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkService, 100);
                    }
                };
                checkService();
            });
        }
        
        console.log('🔌 Probando conexión...');
        const connectionTest = await apiService.testConnection();
        console.log('🔌 Estado de conexión:', connectionTest);
        
        // Configurar indicador de modo
        updateDataModeIndicator();
        
        // Mostrar información del modo actual
        showCurrentModeInfo();
        
        // Cargar datos usando ApiService
        await loadRealData();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('✅ Dashboard inicializado correctamente con datos reales');
    } catch (error) {
        console.error('❌ Error inicializando dashboard:', error);
        showError('Error al carregar el dashboard: ' + error.message);
        
        // Fallback a datos mock si falla la conexión
        console.log('� Fallback a datos mock...');
        loadMockData();
    }
}

async function loadRealData() {
    console.log('🌐 Cargando datos reales...');
    
    try {
        // Mostrar indicator de carga
        showLoadingIndicator();
        
        // Cargar estadísticas
        await updateStatsReal();
        
        // Cargar municipios para filtros
        await populateMunicipiFilterReal();
        
        // Cargar cavidades
        await loadCavitatsReal();
        
        // Actualizar timestamp
        updateLastUpdate();
        
        console.log('✅ Datos reales cargados correctamente');
    } catch (error) {
        console.error('❌ Error cargando datos reales:', error);
        throw error;
    } finally {
        hideLoadingIndicator();
    }
}

// ====== ESTADÍSTICAS CON API REAL ======
async function updateStatsReal() {
    console.log('📊 Actualizando estadísticas desde API...');
    
    try {
        const stats = await apiService.getStats();
        console.log('📊 Estadísticas obtenidas:', stats);
        
        document.getElementById('totalCavitats').textContent = stats.totalCavitats;
        document.getElementById('totalPozos').textContent = stats.totalPozos;
        document.getElementById('totalSalas').textContent = stats.totalSalas;
        document.getElementById('totalFotos').textContent = stats.totalFotos;
        document.getElementById('totalTopos').textContent = stats.totalTopos;
        document.getElementById('totalMunicipis').textContent = stats.totalMunicipis;
        
        console.log('✅ Estadísticas reales actualizadas correctamente');
    } catch (error) {
        console.error('❌ Error actualizando estadísticas reales:', error);
        throw error;
    }
}

// ====== FILTROS CON API REAL ======
async function populateMunicipiFilterReal() {
    try {
        const municipis = await apiService.getMunicipis();
        const select = document.getElementById('filterMunicipi');
        
        // Limpiar opciones existentes (mantener la primera)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        municipis.forEach(municipi => {
            const option = document.createElement('option');
            option.value = municipi;
            option.textContent = municipi;
            select.appendChild(option);
        });
        
        console.log(`📍 ${municipis.length} municipios cargados en filtro`);
    } catch (error) {
        console.warn('⚠️ Error cargando municipios:', error);
    }
}

// ====== CARGA DE CAVITATS CON API REAL ======
async function loadCavitatsReal() {
    console.log('🗃️ Cargando cavitats desde API...');
    
    try {
        const container = document.getElementById('cavitatsContainer');
        if (!container) {
            throw new Error('No se encontró el contenedor cavitatsContainer');
        }
        
        // Obtener filtros actuales
        const filters = getCurrentFilters();
        
        const cavitats = await apiService.getAllCavitats(filters);
        console.log('📋 Cavitats obtenidas:', cavitats.length, cavitats);
        
        if (cavitats.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No s'han trobat cavitats</h3>
                    <p>No hi ha cavitats que compleixin els criteris de cerca.</p>
                    <button class="btn btn-primary" onclick="clearFilters()">Netejar Filtres</button>
                </div>
            `;
            return;
        }
        
        const cavitatCards = cavitats.map(cavitat => createCavitatCard(cavitat)).join('');
        container.innerHTML = cavitatCards;
        
        // Actualizar datos globales
        currentData = cavitats;
        
        // Actualizar botón de editar después de cargar
        updateEditButton();
        
        console.log(`✅ ${cavitats.length} cavitats reales cargadas correctamente`);
    } catch (error) {
        console.error('❌ Error cargando cavitats reales:', error);
        throw error;
    }
}

function getCurrentFilters() {
    return {
        municipi: document.getElementById('filterMunicipi')?.value || '',
        genesis: document.getElementById('filterGenesisType')?.value || '',
        minProfunditat: parseFloat(document.getElementById('filterMinProfunditat')?.value) || 0,
        searchText: document.getElementById('searchText')?.value?.toLowerCase() || ''
    };
}

function loadMockData() {
    console.log('📂 Cargando datos mock...');
    
    try {
        // Cargar estadísticas
        updateStats();
        
        // Cargar lista de municipios en filtro (opcional)
        try {
            populateMunicipiFilter();
        } catch (error) {
            console.warn('⚠️ Error cargando municipios:', error);
        }
        
        // Cargar cavidades (prioritario)
        loadCavitats();
        
        // Actualizar timestamp
        updateLastUpdate();
        
        console.log('✅ Datos mock cargados correctamente');
    } catch (error) {
        console.error('❌ Error en loadMockData:', error);
        
        // Cargar datos mínimos de respaldo
        loadFallbackData();
    }
}

function loadFallbackData() {
    console.log('🔄 Cargando datos de respaldo...');
    
    // Cargar cavitats directamente sin filtros
    const container = document.getElementById('cavitatsContainer');
    if (container && MOCK_DATA && MOCK_DATA.cavitats) {
        const cavitats = MOCK_DATA.cavitats;
        const cavitatCards = cavitats.map(cavitat => createCavitatCard(cavitat)).join('');
        container.innerHTML = cavitatCards;
        console.log(`🆘 ${cavitats.length} cavitats cargadas en modo respaldo`);
    }
}

// ====== ESTADÍSTICAS ======
function updateStats() {
    console.log('📊 Actualizando estadísticas...');
    
    try {
        const stats = MOCK_DATA.getStats();
        console.log('📊 Estadísticas obtenidas:', stats);
        
        document.getElementById('totalCavitats').textContent = stats.totalCavitats;
        document.getElementById('totalPozos').textContent = stats.totalPozos;
        document.getElementById('totalSalas').textContent = stats.totalSalas;
        document.getElementById('totalFotos').textContent = stats.totalFotos;
        document.getElementById('totalTopos').textContent = stats.totalTopos;
        document.getElementById('totalMunicipis').textContent = stats.totalMunicipis;
        
        console.log('✅ Estadísticas actualizadas correctamente');
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
    }
}

// ====== FILTROS ======
function populateMunicipiFilter() {
    const municipis = MOCK_DATA.getMunicipis();
    const select = document.getElementById('filterMunicipi');
    
    municipis.forEach(municipi => {
        const option = document.createElement('option');
        option.value = municipi;
        option.textContent = municipi;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    // Event listeners para filtros
    document.getElementById('filterMunicipi').addEventListener('change', applyFilters);
    document.getElementById('filterGenesisType').addEventListener('change', applyFilters);
    document.getElementById('filterMinProfunditat').addEventListener('input', applyFilters);
    document.getElementById('searchText').addEventListener('input', applyFilters);
    
    // Event listeners para vistas
    document.getElementById('viewToggle').addEventListener('click', toggleView);
    
    // Inicializar botón de edición
    updateEditButton();
}

async function applyFilters() {
    try {
        const filters = getCurrentFilters();
        console.log('🔍 Aplicando filtros:', filters);
        
        showLoadingIndicator();
        
        const cavitats = await apiService.getAllCavitats(filters);
        currentData = cavitats;
        
        // Actualizar vista
        const container = document.getElementById('cavitatsContainer');
        
        if (cavitats.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No s'han trobat cavitats</h3>
                    <p>Prova a modificar els filtres de cerca</p>
                    <button class="btn btn-primary" onclick="clearFilters()">Netejar Filtres</button>
                </div>
            `;
        } else {
            const cavitatCards = cavitats.map(cavitat => createCavitatCard(cavitat)).join('');
            container.innerHTML = cavitatCards;
        }
        
        // Actualizar botón de editar
        updateEditButton();
        
        console.log('🔍 Filtros aplicados:', filters, 'Resultados:', cavitats.length);
    } catch (error) {
        console.error('❌ Error aplicando filtros:', error);
        showError('Error aplicando filtros: ' + error.message);
    } finally {
        hideLoadingIndicator();
    }
}

async function clearFilters() {
    document.getElementById('filterMunicipi').value = '';
    document.getElementById('filterGenesisType').value = '';
    document.getElementById('filterMinProfunditat').value = '';
    document.getElementById('searchText').value = '';
    
    try {
        showLoadingIndicator();
        const cavitats = await apiService.getAllCavitats({});
        currentData = cavitats;
        
        const container = document.getElementById('cavitatsContainer');
        const cavitatCards = cavitats.map(cavitat => createCavitatCard(cavitat)).join('');
        container.innerHTML = cavitatCards;
        
        updateEditButton();
        
        console.log('🧹 Filtros limpiados, mostrando todas las cavitats:', cavitats.length);
    } catch (error) {
        console.error('❌ Error limpiando filtros:', error);
        showError('Error limpiando filtros: ' + error.message);
    } finally {
        hideLoadingIndicator();
    }
}

function toggleView() {
    const container = document.getElementById('cavitatsContainer');
    const toggleBtn = document.getElementById('viewToggle');
    
    if (currentView === 'list') {
        currentView = 'grid';
        container.className = 'cavitats-container grid-view';
        toggleBtn.textContent = '📋 Vista Lista';
    } else {
        currentView = 'list';
        container.className = 'cavitats-container list-view';
        toggleBtn.textContent = '⚏ Vista Grid';
    }
    
    console.log('👁️ Vista cambiada a:', currentView);
}

// ====== CARGA DE CAVITATS ======
function loadCavitats() {
    console.log('🗃️ Cargando cavitats...');
    
    try {
        const container = document.getElementById('cavitatsContainer');
        if (!container) {
            throw new Error('No se encontró el contenedor cavitatsContainer');
        }
        
        const cavitats = currentData.length > 0 ? currentData : MOCK_DATA.cavitats;
        console.log('📋 Cavitats a mostrar:', cavitats.length, cavitats);
        
        if (cavitats.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No s'han trobat cavitats</h3>
                    <p>Prova a modificar els filtres de cerca</p>
                    <button class="btn btn-primary" onclick="clearFilters()">Netejar Filtres</button>
                </div>
            `;
            return;
        }
        
        const cavitatCards = cavitats.map(cavitat => createCavitatCard(cavitat)).join('');
        container.innerHTML = cavitatCards;
        
        // Actualizar botón de editar después de cargar
        updateEditButton();
        
        console.log(`✅ ${cavitats.length} cavitats carregades correctamente`);
    } catch (error) {
        console.error('❌ Error cargando cavitats:', error);
    }
}

function createCavitatCard(cavitat) {
    const interesText = Array.isArray(cavitat.interes) ? cavitat.interes.join(', ') : cavitat.interes;
    const shortDescription = cavitat.descripcio.length > 150 
        ? cavitat.descripcio.substring(0, 150) + '...' 
        : cavitat.descripcio;
    
    return `
        <div class="cavitat-card" data-id="${cavitat.codiId}" onclick="selectForEdit('${cavitat.codiId}')">
            <div class="cavitat-info">
                <div class="cavitat-header">
                    <span class="cavitat-code">${cavitat.codiId}</span>
                    <h3 class="cavitat-name">${cavitat.nom}</h3>
                </div>
                
                <div class="cavitat-location">
                    📍 ${cavitat.municipi} • ${cavitat.genesis} • ${cavitat.altitud}m
                </div>
                
                <div class="cavitat-stats">
                    <div class="stat-item">
                        <span class="icon">🏔️</span>
                        <span>${cavitat.totalPozos} pozos</span>
                    </div>
                    <div class="stat-item">
                        <span class="icon">🏛️</span>
                        <span>${cavitat.totalSalas} salas</span>
                    </div>
                    <div class="stat-item">
                        <span class="icon">📷</span>
                        <span>${cavitat.totalFotos} fotos</span>
                    </div>
                    <div class="stat-item">
                        <span class="icon">📄</span>
                        <span>${cavitat.totalTopos} topos</span>
                    </div>
                </div>
                
                <div class="cavitat-description">
                    ${shortDescription}
                </div>
                
                <div class="cavitat-metadata">
                    <small><strong>Interès:</strong> ${interesText}</small><br>
                    <small><strong>Profunditat:</strong> ${cavitat.profunditat}m • <strong>Recorregut:</strong> ${cavitat.recorreguReal}m</small>
                </div>
            </div>
            
            <div class="cavitat-actions">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); viewCavitat('${cavitat.codiId}')">
                    👁️ Veure
                </button>
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); selectForEdit('${cavitat.codiId}')">
                    ✏️ Seleccionar
                </button>
                <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); showOnMap('${cavitat.codiId}')" disabled>
                    📍 Mapa
                </button>
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); showDetails('${cavitat.codiId}')">
                    ℹ️ Detalls
                </button>
            </div>
        </div>
    `;
}

// ====== NAVEGACIÓN Y ACCIONES ======
function goToNewCavitat() {
    console.log('🔄 Redirigiendo al formulario de nueva cavitat...');
    window.location.href = 'formulario.html';
}

function goToEditCavitat() {
    if (!selectedCavitat) {
        alert('⚠️ Selecciona una cavitat per editar');
        return;
    }
    
    console.log('✏️ Redirigiendo al editor para:', selectedCavitat);
    
    // Redirigir al formulario de edición específico
    const editUrl = `editar.html?edit=${selectedCavitat}`;
    window.location.href = editUrl;
}

function selectForEdit(cavitatId) {
    console.log('🎯 Seleccionant cavitat per editar:', cavitatId);
    
    // Limpiar selección anterior
    document.querySelectorAll('.cavitat-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Remover highlight anterior de botones de seleccionar
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.textContent = '✏️ Seleccionar';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    
    // Seleccionar nueva cavidad
    const card = document.querySelector(`[data-id="${cavitatId}"]`);
    if (card) {
        card.classList.add('selected');
        selectedCavitat = cavitatId;
        
        // Highlight del botón específico
        const selectBtn = card.querySelector('.btn-secondary');
        if (selectBtn) {
            selectBtn.textContent = '✅ Seleccionada';
            selectBtn.classList.remove('btn-secondary');
            selectBtn.classList.add('btn-primary');
        }
        
        updateEditButton();
        
        // Scroll suave hacia la cavitat seleccionada
        card.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        console.log('✅ Cavitat seleccionada per editar:', cavitatId);
        
        // Mostrar información adicional
        showSelectionFeedback(cavitatId);
    } else {
        console.warn('⚠️ No se encontró la tarjeta para:', cavitatId);
    }
}

function updateEditButton() {
    const editBtn = document.getElementById('editBtn');
    if (!editBtn) return;
    
    if (selectedCavitat) {
        editBtn.disabled = false;
        editBtn.textContent = `✏️ Editar ${selectedCavitat}`;
        editBtn.classList.add('btn-primary');
        editBtn.classList.remove('btn-secondary');
        
        // Agregar efecto visual
        editBtn.style.animation = 'pulse 2s infinite';
    } else {
        editBtn.disabled = true;
        editBtn.textContent = '✏️ Editar Cavitat';
        editBtn.classList.remove('btn-primary');
        editBtn.classList.add('btn-secondary');
        editBtn.style.animation = '';
    }
}

function showSelectionFeedback(cavitatId) {
    // Buscar datos de la cavitat
    const cavitat = MOCK_DATA.getCavitatById(cavitatId);
    if (!cavitat) return;
    
    // Crear mensaje de feedback temporal
    const feedback = document.createElement('div');
    feedback.className = 'selection-feedback';
    feedback.innerHTML = `
        <div class="feedback-content">
            <strong>✅ Cavitat seleccionada:</strong> ${cavitat.nom} (${cavitatId})
            <br><small>Fes clic a "Editar" per modificar aquesta cavitat</small>
        </div>
    `;
    
    // Insertar feedback
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(feedback, container.firstChild);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }
}

function viewCavitat(cavitatId) {
    const cavitat = MOCK_DATA.getCavitatById(cavitatId);
    if (!cavitat) return;
    
    alert(`📋 Vista detallada de: ${cavitat.nom}\n\n` +
          `Codi: ${cavitat.codiId}\n` +
          `Municipi: ${cavitat.municipi}\n` +
          `Gènesi: ${cavitat.genesis}\n` +
          `Profunditat: ${cavitat.profunditat}m\n` +
          `Recorregut: ${cavitat.recorreguReal}m\n\n` +
          `${cavitat.descripcio}`);
}

function showDetails(cavitatId) {
    console.log('ℹ️ Mostrant detalls per:', cavitatId);
    // TODO: Implementar modal con detalles completos
    alert('🚧 Funcionalitat en desenvolupament');
}

function showOnMap(cavitatId) {
    console.log('📍 Mostrant al mapa:', cavitatId);
    // TODO: Implementar integración con mapa
    alert('🗺️ Funcionalitat de mapa pròximament disponible');
}

// ====== UTILIDADES ======
function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleString('ca-ES');
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement) {
        updateElement.textContent = timeString;
    }
}

function exportData() {
    console.log('📊 Iniciando exportación...');
    alert('📊 Funcionalitat d\'exportació en desenvolupament');
}

function openGoogleSheets() {
    console.log('📋 Abriendo Google Sheets...');
    // TODO: Abrir link real a Google Sheets cuando esté configurado
    alert('📋 Enllaç a Google Sheets pròximament disponible');
}

function openGitHub() {
    console.log('🔗 Abriendo GitHub...');
    window.open('https://github.com/ToniS48/cataleg-espemo-formulari', '_blank');
}

function openMap() {
    console.log('🗺️ Abriendo mapa...');
    alert('🗺️ Funcionalitat de mapa pròximament disponible');
}

// ====== MENSAJES DE ESTADO ======
function showError(message) {
    console.error('❌', message);
    // TODO: Implementar sistema de notificaciones
}

// ====== FUNCIONES DE GESTIÓN DE MODO ======

function showCurrentModeInfo() {
    const hostname = window.location.hostname;
    const currentMode = isDevMode() ? 'DESARROLLO' : 'PRODUCCIÓN';
    const dataSource = isDevMode() ? 'Datos Mock' : 'Google Sheets (con fallback a mock)';
    
    console.log(`📊 Modo actual: ${currentMode}`);
    console.log(`🌐 Hostname: ${hostname}`);
    console.log(`🗃️ Fuente de datos: ${dataSource}`);
    
    // Crear o actualizar indicador visual en el dashboard
    let modeIndicator = document.getElementById('mode-indicator');
    if (!modeIndicator) {
        modeIndicator = document.createElement('div');
        modeIndicator.id = 'mode-indicator';
        modeIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: ${isDevMode() ? '#28a745' : '#007bff'};
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(modeIndicator);
    }
    
    modeIndicator.innerHTML = `
        <strong>${currentMode}</strong><br>
        <small>${dataSource}</small>
    `;
}

function updateDataModeIndicator() {
    const element = document.getElementById('dataMode');
    if (element) {
        if (API_CONFIG.isDevelopmentMode()) {
            element.textContent = '🔧 Mode desenvolupament (dades mock)';
            element.style.color = '#f39c12';
        } else {
            element.textContent = '☁️ Connectat a Google Sheets';
            element.style.color = '#27ae60';
        }
    }
}

async function toggleDataMode() {
    try {
        showLoadingIndicator();
        
        // Alternar modo
        API_CONFIG.DEV_MODE = !API_CONFIG.DEV_MODE;
        
        console.log('🔄 Cambiando modo a:', API_CONFIG.DEV_MODE ? 'Desarrollo (Mock)' : 'Producción (Real)');
        
        // Actualizar indicador
        updateDataModeIndicator();
        
        // Recargar datos con el nuevo modo
        await loadRealData();
        
        console.log('✅ Modo cambiado exitosamente');
    } catch (error) {
        console.error('❌ Error cambiando modo:', error);
        showError('Error cambiando modo: ' + error.message);
    } finally {
        hideLoadingIndicator();
    }
}

// ====== FUNCIONES DE LOADING INDICATOR ======
function showLoadingIndicator() {
    let loader = document.getElementById('loadingIndicator');
    if (!loader) {
        // Crear el loader si no existe
        loader = document.createElement('div');
        loader.id = 'loadingIndicator';
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Carregant dades...</p>
            </div>
        `;
        document.body.appendChild(loader);
        
        // Añadir estilos si no existen
        if (!document.getElementById('loadingStyles')) {
            const style = document.createElement('style');
            style.id = 'loadingStyles';
            style.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .loading-spinner {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    loader.style.display = 'flex';
    console.log('⏳ Mostrant loading indicator...');
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = 'none';
        console.log('✅ Ocultant loading indicator...');
    }
}
