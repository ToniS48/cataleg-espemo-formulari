// FORM MANAGER - ESPEMO
// Gestor modular para formularios de creación y edición

class FormManager {
    constructor() {
        this.mode = 'create'; // 'create' o 'edit'
        this.cavitatId = null;
        this.originalData = null;
        this.isInitialized = false;
    }

    // ====== INICIALIZACIÓN ======
    async initialize() {
        try {
            console.log('🎯 Inicializando FormManager...');
            
            // Detectar modo basado en URL
            this.detectMode();
            
            // Configurar interfaz según el modo
            this.setupInterface();
            
            // Si es modo edición, cargar datos
            if (this.mode === 'edit' && this.cavitatId) {
                await this.loadCavitatData();
            }
            
            // Configurar event listeners específicos
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log(`✅ FormManager inicializado en modo: ${this.mode}`);
            
        } catch (error) {
            console.error('❌ Error inicializando FormManager:', error);
            this.showError('Error al carregar el formulari');
        }
    }

    // ====== DETECCIÓN DE MODO ======
    detectMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        
        if (editId) {
            this.mode = 'edit';
            this.cavitatId = editId;
            console.log(`📝 Modo edición detectado para cavitat: ${editId}`);
        } else {
            this.mode = 'create';
            console.log('➕ Modo creación detectado');
        }
    }

    // ====== CONFIGURACIÓN DE INTERFAZ ======
    setupInterface() {
        // Actualizar título y textos según el modo
        const pageTitle = document.querySelector('title');
        const headerTitle = document.querySelector('.header h2');
        const submitButton = document.querySelector('.btn-enviar');
        
        if (this.mode === 'edit') {
            // Agregar clase al body para estilos específicos
            document.body.classList.add('edit-mode');
            
            if (pageTitle) pageTitle.textContent = 'Editar Cavitat - ESPEMO';
            if (headerTitle) headerTitle.textContent = 'Formulari d\'Edició';
            if (submitButton) submitButton.textContent = 'Actualitzar Cavitat';
            
            // Mostrar información de edición
            this.showEditInfo();
        } else {
            document.body.classList.add('create-mode');
            
            if (pageTitle) pageTitle.textContent = 'Nova Cavitat - ESPEMO';
            if (headerTitle) headerTitle.textContent = 'Formulari d\'Inscripció';
            if (submitButton) submitButton.textContent = 'Guardar Cavitat';
        }
    }

    // ====== CARGA DE DATOS PARA EDICIÓN ======
    async loadCavitatData() {
        try {
            console.log(`🔄 Cargando datos para cavitat: ${this.cavitatId}`);
            
            // Por ahora usar datos mock, pero esto se conectará al backend real
            const cavitatData = this.getMockCavitatData(this.cavitatId);
            
            if (!cavitatData) {
                throw new Error(`No se encontró la cavitat con ID: ${this.cavitatId}`);
            }
            
            this.originalData = cavitatData;
            
            // Poblar el formulario con los datos
            this.populateForm(cavitatData);
            
            console.log('✅ Datos cargados correctamente');
            
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            this.showError(`No es pot carregar la cavitat: ${error.message}`);
        }
    }

    // ====== DATOS MOCK PARA TESTING ======
    getMockCavitatData(id) {
        // Usar datos del archivo data-mock.js si está disponible
        if (typeof getCavitatDetailedData === 'function') {
            return getCavitatDetailedData(id);
        }
        
        // Fallback a datos internos si data-mock.js no está disponible
        const mockData = {
            'MOR-001': {
                codi_id: 'MOR-001',
                nom: 'Cova dels Àngels',
                alies: 'Angels Cave',
                municipi: 'Morella',
                genesis: 'B1.1- Sumider.fósiles CON rec.horizontal',
                interes: ['I.científico (1): Fauna invertebrada', 'I.deportivo: Recorrido subterráneo importante.'],
                descripcio: 'Cavitat de gran interès espeleològic situada a Morella...',
                zona_utm: '30T',
                datum: 'ETRS89',
                precisio: '±10',
                est_x: 745234,
                nort_y: 4532678,
                z: 1250,
                latitud: 40.123456,
                longitud: -0.123456,
                recorregut_real: 450.5,
                profunditat: 45.8
            }
        };
        
        return mockData[id] || null;
    }

    // ====== POBLADO DEL FORMULARIO ======
    populateForm(data) {
        console.log('📝 Poblando formulario con datos:', data);
        
        // Campos simples
        this.setFieldValue('codi_id', data.codi_id);
        this.setFieldValue('nom', data.nom);
        this.setFieldValue('alies', data.alies);
        this.setFieldValue('municipi', data.municipi);
        this.setFieldValue('genesis', data.genesis);
        this.setFieldValue('descripcio', data.descripcio);
        
        // Coordenadas
        this.setFieldValue('zona_utm', data.zona_utm);
        this.setFieldValue('datum', data.datum);
        this.setFieldValue('precisio', data.precisio);
        this.setFieldValue('est_x', data.est_x);
        this.setFieldValue('nort_y', data.nort_y);
        this.setFieldValue('z', data.z);
        this.setFieldValue('latitud', data.latitud);
        this.setFieldValue('longitud', data.longitud);
        this.setFieldValue('latitud_gms', data.latitud_gms);
        this.setFieldValue('longitud_gms', data.longitud_gms);
        
        // Medidas
        this.setFieldValue('recorregut_real', data.recorregut_real);
        this.setFieldValue('recorregut_planta', data.recorregut_planta);
        this.setFieldValue('profunditat', data.profunditat);
        
        // Documentación
        this.setFieldValue('topos_comentari', data.topos_comentari);
        this.setFieldValue('fotos_comentari', data.fotos_comentari);
        
        // Bibliografia
        this.setFieldValue('biblio_article', data.biblio_article);
        this.setFieldValue('biblio_autor', data.biblio_autor);
        this.setFieldValue('biblio_llibre', data.biblio_llibre);
        this.setFieldValue('biblio_editorial', data.biblio_editorial);
        this.setFieldValue('biblio_data', data.biblio_data);
        this.setFieldValue('biblio_tema', data.biblio_tema);
        this.setFieldValue('biblio_tipus', data.biblio_tipus);
        
        // Campos especiales
        this.populateInterestField(data.interes);
        this.populateMunicipiField(data.municipi);
        
        // Generar ID si es necesario
        if (data.codi_id) {
            document.getElementById('codi_id').value = data.codi_id;
        }
    }

    // ====== HELPERS PARA POBLADO ======
    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field && value !== undefined && value !== null) {
            field.value = value;
        }
    }

    populateInterestField(interests) {
        if (!interests || !Array.isArray(interests)) return;
        
        interests.forEach(interest => {
            const checkbox = document.querySelector(`input[name="interes"][value="${interest}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Actualizar display del multi-select
        if (typeof updateInteresDisplay === 'function') {
            updateInteresDisplay();
        }
    }

    populateMunicipiField(municipi) {
        if (!municipi) return;
        
        const municipiField = document.getElementById('municipi');
        if (municipiField) {
            municipiField.value = municipi;
            
            // Trigger the municipality change to generate code
            if (typeof handleMunicipiChange === 'function') {
                handleMunicipiChange();
            }
        }
    }

    // ====== INFORMACIÓN DE EDICIÓN ======
    showEditInfo() {
        const infoBox = document.querySelector('.info-box');
        if (infoBox && this.cavitatId) {
            infoBox.innerHTML = `
                <strong>Mode Edició:</strong> Editant cavitat ${this.cavitatId}. 
                Els canvis es guardaran sobre les dades existents.
            `;
            infoBox.style.backgroundColor = '#e8f4fd';
            infoBox.style.borderLeft = '4px solid #3498db';
        }
    }

    // ====== EVENT LISTENERS ======
    setupEventListeners() {
        // Interceptar submit del formulario para manejar edición
        const form = document.getElementById('cavitatForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Botón de cancelar edición
        this.addCancelButton();
    }

    addCancelButton() {
        if (this.mode !== 'edit') return;
        
        const btnContainer = document.querySelector('.btn-container');
        if (btnContainer) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn btn-outline';
            cancelBtn.textContent = 'Cancel·lar';
            cancelBtn.onclick = () => this.cancelEdit();
            
            // Insertar antes del botón de guardar
            const submitBtn = btnContainer.querySelector('.btn-enviar');
            btnContainer.insertBefore(cancelBtn, submitBtn);
        }
    }

    // ====== MANEJO DE SUBMIT ======
    async handleFormSubmit(event) {
        if (this.mode === 'edit') {
            event.preventDefault();
            await this.handleEditSubmit();
        }
        // Si es modo create, dejar que el script original maneje el submit
    }

    async handleEditSubmit() {
        try {
            console.log('💾 Guardando cambios de edición...');
            
            // Mostrar loading
            this.showLoading('Actualitzant cavitat...');
            
            // Recoger datos del formulario
            const formData = this.collectFormData();
            
            // Simular guardado (aquí se conectaría con el backend real)
            await this.simulateApiCall();
            
            console.log('✅ Cavitat actualizada correctamente');
            this.showSuccess('La cavitat s\'ha actualitzat correctament!');
            
            // Redirigir al dashboard después de un momento
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error guardando cambios:', error);
            this.showError('Error actualitzant la cavitat');
        } finally {
            this.hideLoading();
        }
    }

    // ====== UTILIDADES ======
    collectFormData() {
        const form = document.getElementById('cavitatForm');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    cancelEdit() {
        if (confirm('Segur que vols cancel·lar l\'edició? Es perdran els canvis no guardats.')) {
            window.location.href = 'index.html';
        }
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    // ====== MENSAJES DE ESTADO ======
    showLoading(message) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.querySelector('.loading-text').textContent = message;
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showSuccess(message) {
        const successEl = document.getElementById('successMessage');
        if (successEl) {
            successEl.innerHTML = `<strong>✅ Èxit!</strong> ${message}`;
            successEl.style.display = 'block';
        }
    }

    showError(message) {
        const errorEl = document.getElementById('errorMessage');
        if (errorEl) {
            errorEl.querySelector('#errorText').textContent = message;
            errorEl.style.display = 'block';
        }
    }
}

// ====== INICIALIZACIÓN GLOBAL ======
// Variable global para acceso desde otras funciones
let formManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    formManager = new FormManager();
    await formManager.initialize();
});

// Funciones para compatibilidad con código existente
function isEditMode() {
    return formManager && formManager.mode === 'edit';
}

function getEditingCavitatId() {
    return formManager ? formManager.cavitatId : null;
}
