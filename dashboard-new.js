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
        // Simular carga de datos
        await simulateNetworkDelay(800);
        
        // Cargar datos mock
        loadMockData();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('✅ Dashboard inicializado correctamente');
    } catch (error) {
        console.error('❌ Error inicializando dashboard:', error);
        showError('Error al carregar el dashboard');
    }
}

function loadMockData() {
    // Cargar estadísticas
    updateStats();
    
    // Cargar lista de municipios en filtro
    populateMunicipiFilter();
    
    // Cargar cavidades
    loadCavitats();
    
    // Actualizar timestamp
    updateLastUpdate();
}

// ====== ESTADÍSTICAS ======
function updateStats() {
    const stats = MOCK_DATA.getStats();
    
    document.getElementById('totalCavitats').textContent = stats.totalCavitats;
    document.getElementById('totalPozos').textContent = stats.totalPozos;
    document.getElementById('totalSalas').textContent = stats.totalSalas;
    document.getElementById('totalFotos').textContent = stats.totalFotos;
    document.getElementById('totalTopos').textContent = stats.totalTopos;
    document.getElementById('totalMunicipis').textContent = stats.totalMunicipis;
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

function applyFilters() {
    const filters = {
        municipi: document.getElementById('filterMunicipi').value,
        genesis: document.getElementById('filterGenesisType').value,
        minProfunditat: parseFloat(document.getElementById('filterMinProfunditat').value) || 0,
        searchText: document.getElementById('searchText').value.toLowerCase()
    };
    
    currentData = MOCK_DATA.getFilteredCavitats(filters);
    loadCavitats();
    
    console.log('🔍 Filtros aplicados:', filters, 'Resultados:', currentData.length);
}

function clearFilters() {
    document.getElementById('filterMunicipi').value = '';
    document.getElementById('filterGenesisType').value = '';
    document.getElementById('filterMinProfunditat').value = '';
    document.getElementById('searchText').value = '';
    
    currentData = MOCK_DATA.cavitats;
    loadCavitats();
    
    console.log('🧹 Filtros limpiados');
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
    const container = document.getElementById('cavitatsContainer');
    const cavitats = currentData.length > 0 ? currentData : MOCK_DATA.cavitats;
    
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
    
    console.log(`📋 ${cavitats.length} cavitats carregades`);
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
