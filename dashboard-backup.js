// DASHBOARD JAVASCRIPT - ESPEMO
// Funcionalidad principal del dashboard

// Variables globales
let currentData = [];
let selectedCavitat = null;
let    return `
        <div class="cavitat-card" data-id="${cavitat.codiId}" onclick="selectForEdit('${cavitat.codiId}')">`urrentView = 'list';

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
    
    // Actualizar números con animación
    animateCounter('totalCavitats', stats.totalCavitats);
    animateCounter('totalMunicipis', stats.totalMunicipis);
    animateCounter('totalFotos', stats.totalFotos);
    animateCounter('totalTopos', stats.totalTopos);
    animateCounter('totalPozos', stats.totalPozos);
    animateCounter('totalSalas', stats.totalSalas);
}

function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    const duration = 1000; // 1 segundo
    const steps = 50;
    const increment = finalValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            current = finalValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, duration / steps);
}

// ====== FILTROS ======
function populateMunicipiFilter() {
    const select = document.getElementById('filterMunicipi');
    const stats = MOCK_DATA.getStats();
    
    // Limpiar opciones existentes (excepto "Tots")
    select.innerHTML = '<option value="">Tots els municipis</option>';
    
    // Añadir municipios que tienen cavidades
    stats.municipis.forEach(municipi => {
        const option = document.createElement('option');
        option.value = municipi;
        option.textContent = municipi;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    // Filtros
    document.getElementById('filterMunicipi').addEventListener('change', applyFilters);
    document.getElementById('filterGenesi').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 300));
}

function applyFilters() {
    const filters = {
        municipi: document.getElementById('filterMunicipi').value,
        genesis: document.getElementById('filterGenesi').value,
        search: document.getElementById('searchInput').value.trim()
    };
    
    console.log('🔍 Aplicando filtros:', filters);
    
    const filteredData = MOCK_DATA.filterCavitats(filters);
    currentData = filteredData;
    
    renderCavitats(filteredData);
}

function clearFilters() {
    document.getElementById('filterMunicipi').value = '';
    document.getElementById('filterGenesi').value = '';
    document.getElementById('searchInput').value = '';
    
    loadCavitats();
}

// ====== CARGA DE CAVIDADES ======
function loadCavitats() {
    currentData = MOCK_DATA.cavitats;
    renderCavitats(currentData);
}

function renderCavitats(cavitats) {
    const container = document.getElementById('cavitatsContainer');
    
    if (cavitats.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>🔍 No s'han trobat cavitats</h3>
                <p>Prova a modificar els filtres de cerca</p>
                <button class="btn btn-primary" onclick="clearFilters()">Netejar filtres</button>
            </div>
        `;
        return;
    }
    
    const cavitatCards = cavitats.map(cavitat => createCavitatCard(cavitat)).join('');
    container.innerHTML = cavitatCards;
    
    // Actualizar botón de editar según selección
    updateEditButton();
}

function createCavitatCard(cavitat) {
    const interesText = Array.isArray(cavitat.interes) ? cavitat.interes.join(', ') : cavitat.interes;
    const shortDescription = cavitat.descripcio.length > 150 
        ? cavitat.descripcio.substring(0, 150) + '...' 
        : cavitat.descripcio;
    
    return `
        <div class="cavitat-card" data-id="${cavitat.codiId}">
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
                <button class="btn btn-primary btn-sm" onclick="viewCavitat('${cavitat.codiId}')">
                    👁️ Veure
                </button>
                <button class="btn btn-secondary btn-sm" onclick="selectForEdit('${cavitat.codiId}')">
                    ✏️ Seleccionar
                </button>
                <button class="btn btn-success btn-sm" onclick="showOnMap('${cavitat.codiId}')" disabled>
                    📍 Mapa
                </button>
                <button class="btn btn-outline btn-sm" onclick="showDetails('${cavitat.codiId}')">
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
          `Descripció:\n${cavitat.descripcio}\n\n` +
          `💡 Pròximament: Vista detallada completa`);
}

function showDetails(cavitatId) {
    const cavitat = MOCK_DATA.getCavitatById(cavitatId);
    if (!cavitat) return;
    
    const details = `
        🏔️ DETALLS DE LA CAVITAT
        
        📋 Informació Bàsica:
        • Codi: ${cavitat.codiId}
        • Nom: ${cavitat.nom}
        • Àlies: ${cavitat.alies || 'Cap'}
        • Municipi: ${cavitat.municipi}
        
        📊 Característiques:
        • Gènesi: ${cavitat.genesis}
        • Profunditat: ${cavitat.profunditat}m
        • Recorregut real: ${cavitat.recorreguReal}m
        • Altitud: ${cavitat.altitud}m
        
        📈 Elements:
        • Pozos: ${cavitat.totalPozos}
        • Salas: ${cavitat.totalSalas}
        • Fotos: ${cavitat.totalFotos}
        • Topografies: ${cavitat.totalTopos}
        
        🎯 Interès: ${Array.isArray(cavitat.interes) ? cavitat.interes.join(', ') : cavitat.interes}
        
        📝 Descripció:
        ${cavitat.descripcio}
        
        🕐 Registrada: ${cavitat.timestamp}
    `;
    
    alert(details);
}

// ====== CAMBIO DE VISTA ======
function changeView(view) {
    currentView = view;
    const container = document.getElementById('cavitatsContainer');
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    // Actualizar botones
    gridBtn.classList.toggle('active', view === 'grid');
    listBtn.classList.toggle('active', view === 'list');
    
    // Actualizar contenedor
    container.className = `cavitats-container ${view}-view`;
    
    console.log(`🔄 Vista cambiada a: ${view}`);
}

// ====== ACCIONES DE HERRAMIENTAS ======
function exportData() {
    const stats = MOCK_DATA.getStats();
    const exportData = {
        stats: stats,
        cavitats: currentData,
        exportDate: new Date().toISOString(),
        totalRecords: currentData.length
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadElement = document.createElement('a');
    downloadElement.setAttribute('href', dataStr);
    downloadElement.setAttribute('download', `cavitats-espemo-${new Date().toISOString().split('T')[0]}.json`);
    downloadElement.click();
    
    console.log('📊 Dades exportades:', exportData);
}

function openGoogleSheets() {
    // URL del Google Sheets (usar la misma del config)
    const sheetsUrl = 'https://docs.google.com/spreadsheets/d/1OyYPUnq74qMmR4YwuuI1a78SeBO_QYprl3lIv4z5jFU';
    window.open(sheetsUrl, '_blank');
}

function openGitHub() {
    window.open('https://github.com/ToniS48/cataleg-espemo-formulari', '_blank');
}

function showOnMap(cavitatId) {
    alert('🗺️ Funcionalitat del mapa en desenvolupament.\n\nPròximament podràs veure totes les cavitats en un mapa interactiu.');
}

function refreshData() {
    console.log('🔄 Actualitzant dades...');
    
    // Mostrar loading
    const container = document.getElementById('cavitatsContainer');
    container.innerHTML = `
        <div class="loading-message">
            <div class="spinner"></div>
            <p>Actualitzant dades...</p>
        </div>
    `;
    
    // Simular carga
    setTimeout(() => {
        loadMockData();
        console.log('✅ Dades actualitzades');
    }, 1000);
}

// ====== UTILIDADES ======
function updateLastUpdate() {
    const element = document.getElementById('lastUpdate');
    if (element) {
        element.textContent = new Date().toLocaleString('ca-ES');
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showError(message) {
    alert(`❌ Error: ${message}`);
}

// ====== CSS DINÁMICO PARA SELECCIÓN ======
const style = document.createElement('style');
style.textContent = `
    .cavitat-card.selected {
        border-color: #3498db !important;
        background-color: #f8f9ff !important;
        box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3) !important;
    }
    
    .cavitat-card.selected .cavitat-code {
        background-color: #2ecc71 !important;
    }
`;
document.head.appendChild(style);
