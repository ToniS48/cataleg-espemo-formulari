// Formulari d'Inscripció de Cavitats - ESPEMO
// JavaScript functionality

// Dades de municipis
const municipis = {"Ares del Maestrat": "ARM", "Castell de Cabres": "CDC", "Castellfort": "CAF", "Cinctorres": "CNT", "Forcall": "FOR", "Herbers": "HER", "La Mata": "MAT", "Morella": "MOR", "Olocau del Rey": "OLO", "Palanques": "PAL", "La Pobla de Benifassà": "POB", "Portell": "POR", "Sorita": "SOR", "Todolella": "TOD", "Tronchon": "TRO", "Vallibona": "VBN", "Vilafranca": "VLF", "Villores": "VIL"};

// Comptador global per generar IDs únics
let nextId = 1;
let pouCounter = 0;
let salaCounter = 0;

// Variables per gestió d'arxius
let toposFiles = [];
let fotosFiles = [];

// ====== FUNCIONES DE UI E INDICADORES DE CARGA ======

// Mostrar overlay de carga
function showLoadingOverlay(text = 'Guardant cavitat...', subtext = 'Processant arxius i dades, si us plau espera') {
    const overlay = document.getElementById('loadingOverlay');
    const textElement = overlay.querySelector('.loading-text');
    const subtextElement = overlay.querySelector('.loading-subtext');
    
    if (textElement) textElement.textContent = text;
    if (subtextElement) subtextElement.textContent = subtext;
    
    overlay.classList.add('active');
}

// Ocultar overlay de carga
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('active');
}

// Mostrar progreso de archivos
function showFileProgress(current = 0, total = 0, type = 'arxius') {
    const progressDiv = document.getElementById('fileProgress');
    const textSpan = document.getElementById('fileProgressText');
    const fillDiv = document.getElementById('fileProgressFill');
    
    if (total === 0) {
        progressDiv.classList.remove('active');
        return;
    }
    
    progressDiv.classList.add('active');
    textSpan.textContent = `${current}/${total} ${type}`;
    
    const percentage = total > 0 ? (current / total) * 100 : 0;
    fillDiv.style.width = `${percentage}%`;
}

// Ocultar progreso de archivos
function hideFileProgress() {
    const progressDiv = document.getElementById('fileProgress');
    progressDiv.classList.remove('active');
}

// Mostrar mensaje de éxito
function showSuccessMessage(message = 'La cavitat s\'ha guardat correctament.') {
    const successDiv = document.getElementById('successMessage');
    const textPart = successDiv.innerHTML.split('</strong>')[1];
    successDiv.innerHTML = `<strong>✅ Èxit!</strong> ${message}`;
    successDiv.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Mostrar mensaje de error
function showErrorMessage(message = 'Hi ha hagut un problema guardant la cavitat.') {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-ocultar después de 8 segundos
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 8000);
}

// Activar estado de carga en botón
function setButtonLoading(button, isLoading = true, loadingText = 'Guardant...') {
    if (isLoading) {
        button.originalText = button.textContent;
        button.innerHTML = `<span class="spinner"></span>${loadingText}`;
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.innerHTML = button.originalText || 'Guardar Cavitat';
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Función helper para mostrar errores (backward compatibility)
function showError(message) {
    showErrorMessage(message);
}

// Funció per mostrar/ocultar tabs
function showTab(tabName) {
    // Ocultar tots els continguts
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Desactivar tots els tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostrar el contingut seleccionat
    document.getElementById(tabName).classList.add('active');
    
    // Activar el tab seleccionat
    event.target.classList.add('active');
}

// Funció per actualitzar el codi ID basant-se en el municipi
function updateCodiId() {
    const municipiInput = document.getElementById('municipi');
    const codiIdInput = document.getElementById('codi_id');
    const newMunicipiInfo = document.getElementById('new-municipi-info');
    
    if (municipiInput.value.trim()) {
        let codiMunicipi = municipis[municipiInput.value];
        let isNewMunicipi = false;
        
        if (!codiMunicipi) {
            // És un municipi nou, generar codi
            codiMunicipi = generateNewMunicipiCode(municipiInput.value);
            isNewMunicipi = true;
            
            // Afegir temporalment a la llista de municipis
            municipis[municipiInput.value] = codiMunicipi;
        }
        
        if (codiMunicipi) {
            // Generar número seqüencial amb zeros a l'esquerra
            const numero = String(nextId).padStart(3, '0');
            codiIdInput.value = `${codiMunicipi}-${numero}`;
            nextId++;
            
            // Mostrar/ocultar informació de municipi nou
            if (isNewMunicipi) {
                newMunicipiInfo.innerHTML = `<strong>Nou municipi:</strong> S'utilitzarà el codi "${codiMunicipi}"`;
                newMunicipiInfo.style.display = 'block';
            } else {
                newMunicipiInfo.style.display = 'none';
            }
        } else {
            codiIdInput.value = '';
            newMunicipiInfo.style.display = 'none';
        }
    } else {
        codiIdInput.value = '';
        newMunicipiInfo.style.display = 'none';
    }
}

let isSelectingFromDropdown = false;

// Funció per mostrar la llista de municipis
function showMunicipiList() {
    const dropdown = document.getElementById('municipi-dropdown');
    dropdown.style.display = 'block';
    filterMunicipis();
}

// Funció per filtrar municipis mentre s'escriu
function filterMunicipis() {
    const input = document.getElementById('municipi');
    const dropdown = document.getElementById('municipi-dropdown');
    const items = dropdown.querySelectorAll('.dropdown-item');
    const filter = input.value.toLowerCase();
    
    let hasVisibleItems = false;
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
            item.classList.remove('hidden');
            hasVisibleItems = true;
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Mostrar/ocultar el dropdown segons si hi ha elements visibles
    dropdown.style.display = hasVisibleItems || filter.length > 0 ? 'block' : 'none';
    
    // Actualizar el código ID
    updateCodiId();
}

// Funció per gestionar quan es perd el focus del camp municipi
function handleMunicipiBlur() {
    // Afegir un petit delay per permetre que el click en el dropdown funcioni
    setTimeout(() => {
        if (!isSelectingFromDropdown) {
            const dropdown = document.getElementById('municipi-dropdown');
            dropdown.style.display = 'none';
        }
    }, 150);
}

// Funció per generar un codi per a municipis nous
function generateNewMunicipiCode(municipiName) {
    // Intentar generar un codi a partir del nom del municipi
    const words = municipiName.trim().split(/\s+/);
    let code = '';
    
    if (words.length === 1) {
        // Una sola paraula: agafar les primeres 3 lletres
        code = words[0].substring(0, 3).toUpperCase();
    } else if (words.length === 2) {
        // Dues paraules: primera lletra de cada paraula + una més de la primera
        code = (words[0].charAt(0) + words[1].charAt(0) + words[0].charAt(1)).toUpperCase();
    } else {
        // Tres o més paraules: primera lletra de les tres primeres
        code = (words[0].charAt(0) + words[1].charAt(0) + words[2].charAt(0)).toUpperCase();
    }
    
    // Assegurar-se que té 3 caràcters
    if (code.length < 3) {
        code = code.padEnd(3, 'X');
    }
    
    // Verificar si ja existeix aquest codi
    const existingCodes = Object.values(municipis);
    if (existingCodes.includes(code)) {
        // Si ja existeix, afegir un número
        let counter = 1;
        let newCode = code.substring(0, 2) + counter;
        while (existingCodes.includes(newCode)) {
            counter++;
            newCode = code.substring(0, 2) + counter;
        }
        code = newCode;
    }
    
    return code;
}

// Funció per netejar el formulari
function clearForm() {
    if (confirm('Estàs segur que vols netejar tot el formulari?')) {
        document.getElementById('cavitatForm').reset();
        document.getElementById('codi_id').value = '';
        nextId = 1;
        
        // Netejar pous i sales dinàmics
        document.getElementById('pous-container').innerHTML = '';
        document.getElementById('sales-container').innerHTML = '';
        pouCounter = 0;
        salaCounter = 0;
        
        // Netejar arxius
        toposFiles = [];
        fotosFiles = [];
        document.getElementById('topos_file_list').innerHTML = '';
        document.getElementById('fotos_file_list').innerHTML = '';
        document.getElementById('topos_file_list').classList.remove('has-files');
        document.getElementById('fotos_file_list').classList.remove('has-files');
    }
}

// Funció per guardar com a esborrany
function saveAsDraft() {
    const formData = new FormData(document.getElementById('cavitatForm'));
    const data = Object.fromEntries(formData);
    
    // Afegir informació dels comptadors dinàmics
    data._dynamic_counters = {
        pouCounter: pouCounter,
        salaCounter: salaCounter
    };
    
    localStorage.setItem('cavitatEsborrany', JSON.stringify(data));
    alert('Esborrany guardat localment!');
}

// Funció per carregar esborrany
function loadDraft() {
    const draft = localStorage.getItem('cavitatEsborrany');
    if (draft && confirm('S\'ha trobat un esborrany guardat. Vols carregar-lo?')) {
        const data = JSON.parse(draft);
        
        // Restaurar comptadors dinàmics
        if (data._dynamic_counters) {
            pouCounter = data._dynamic_counters.pouCounter || 0;
            salaCounter = data._dynamic_counters.salaCounter || 0;
            
            // Recrear pous dinàmics
            for (let i = 1; i <= pouCounter; i++) {
                if (data[`pou_nom_${i}`] !== undefined || data[`pou_profunditat_${i}`] !== undefined) {
                    addPou();
                }
            }
            
            // Recrear sales dinàmiques
            for (let i = 1; i <= salaCounter; i++) {
                if (data[`sala_nom_${i}`] !== undefined || data[`sala_llargaria_${i}`] !== undefined) {
                    addSala();
                }
            }
            
            delete data._dynamic_counters;
        }
        
        // Carregar dades als camps
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data[key];
                
                // Si és un camp de sala, recalcular àrea i volum
                if (key.includes('sala_llargaria_') || key.includes('sala_amplaria_') || key.includes('sala_altura_')) {
                    const matches = key.match(/sala_\w+_(\d+)/);
                    if (matches) {
                        calculateSalaArea(matches[1]);
                    }
                }
            }
        });
    }
}

// Funció per mostrar errors
function showError(message) {
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorBox.style.display = 'block';
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 5000);
}

// Calcular superfície i volum automàticament per sales
function calculateSalaArea(salaId = '') {
    const suffix = salaId ? `_${salaId}` : '';
    const llargaria = parseFloat(document.getElementById(`sala_llargaria${suffix}`).value) || 0;
    const amplaria = parseFloat(document.getElementById(`sala_amplaria${suffix}`).value) || 0;
    const altura = parseFloat(document.getElementById(`sala_altura${suffix}`).value) || 0;
    
    if (llargaria && amplaria) {
        document.getElementById(`sala_superficie${suffix}`).value = (llargaria * amplaria).toFixed(2);
    }
    
    if (llargaria && amplaria && altura) {
        document.getElementById(`sala_volum${suffix}`).value = (llargaria * amplaria * altura).toFixed(2);
    }
}

// Funcions per gestionar pous dinàmics
function addPou() {
    pouCounter++;
    const container = document.getElementById('pous-container');
    const pouId = `pou_${pouCounter}`;
    
    const pouHTML = `
        <div class="dynamic-item" id="${pouId}">
            <button type="button" class="remove-btn" onclick="removePou('${pouId}')" title="Eliminar pou">×</button>
            <h4>Pou <span class="item-counter">#${pouCounter}</span></h4>
            <div class="form-row">
                <div class="form-group third-width">
                    <label for="pou_nom_${pouCounter}">Nom del Pou</label>
                    <input type="text" id="pou_nom_${pouCounter}" name="pou_nom_${pouCounter}" placeholder="Ex: Pou principal">
                </div>
                <div class="form-group third-width">
                    <label for="pou_profunditat_${pouCounter}">Profunditat (m)</label>
                    <input type="number" step="0.1" id="pou_profunditat_${pouCounter}" name="pou_profunditat_${pouCounter}">
                </div>
                <div class="form-group third-width">
                    <label for="pou_amplada_${pouCounter}">Amplada (m)</label>
                    <input type="number" step="0.1" id="pou_amplada_${pouCounter}" name="pou_amplada_${pouCounter}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="pou_observacions_${pouCounter}">Observacions</label>
                    <input type="text" id="pou_observacions_${pouCounter}" name="pou_observacions_${pouCounter}" placeholder="Observacions específiques d'aquest pou...">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', pouHTML);
}

function removePou(pouId) {
    if (confirm('Estàs segur que vols eliminar aquest pou?')) {
        const element = document.getElementById(pouId);
        element.remove();
    }
}

// Funcions per gestionar sales dinàmiques
function addSala() {
    salaCounter++;
    const container = document.getElementById('sales-container');
    const salaId = `sala_${salaCounter}`;
    
    const salaHTML = `
        <div class="dynamic-item" id="${salaId}">
            <button type="button" class="remove-btn" onclick="removeSala('${salaId}')" title="Eliminar sala">×</button>
            <h4>Sala <span class="item-counter">#${salaCounter}</span></h4>
            <div class="form-row">
                <div class="form-group half-width">
                    <label for="sala_nom_${salaCounter}">Nom de la Sala</label>
                    <input type="text" id="sala_nom_${salaCounter}" name="sala_nom_${salaCounter}" placeholder="Ex: Sala principal">
                </div>
                <div class="form-group half-width">
                    <label for="sala_descripcio_${salaCounter}">Descripció</label>
                    <input type="text" id="sala_descripcio_${salaCounter}" name="sala_descripcio_${salaCounter}" placeholder="Descripció breu de la sala">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group third-width">
                    <label for="sala_llargaria_${salaCounter}">Llargària (m)</label>
                    <input type="number" step="0.1" id="sala_llargaria_${salaCounter}" name="sala_llargaria_${salaCounter}" oninput="calculateSalaArea('${salaCounter}')">
                </div>
                <div class="form-group third-width">
                    <label for="sala_amplaria_${salaCounter}">Amplària (m)</label>
                    <input type="number" step="0.1" id="sala_amplaria_${salaCounter}" name="sala_amplaria_${salaCounter}" oninput="calculateSalaArea('${salaCounter}')">
                </div>
                <div class="form-group third-width">
                    <label for="sala_altura_${salaCounter}">Altura (m)</label>
                    <input type="number" step="0.1" id="sala_altura_${salaCounter}" name="sala_altura_${salaCounter}" oninput="calculateSalaArea('${salaCounter}')">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group third-width">
                    <label for="sala_superficie_${salaCounter}">Superfície (m²)</label>
                    <input type="number" step="0.1" id="sala_superficie_${salaCounter}" name="sala_superficie_${salaCounter}" readonly class="readonly">
                </div>
                <div class="form-group third-width">
                    <label for="sala_volum_${salaCounter}">Volum (m³)</label>
                    <input type="number" step="0.1" id="sala_volum_${salaCounter}" name="sala_volum_${salaCounter}" readonly class="readonly">
                </div>
                <div class="form-group third-width">
                    <label for="sala_observacions_${salaCounter}">Observacions</label>
                    <input type="text" id="sala_observacions_${salaCounter}" name="sala_observacions_${salaCounter}" placeholder="Observacions específiques...">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', salaHTML);
}

function removeSala(salaId) {
    if (confirm('Estàs segur que vols eliminar aquesta sala?')) {
        const element = document.getElementById(salaId);
        element.remove();
    }
}

// Funcions per gestionar arxius
function handleFileSelection(type) {
    const fileInput = document.getElementById(`${type}_arxius`);
    const fileList = document.getElementById(`${type}_file_list`);
    const files = Array.from(fileInput.files);
    
    console.log(`🔧 handleFileSelection called for type: ${type}`);
    console.log(`🔧 fileInput.files:`, fileInput.files);
    console.log(`🔧 fileInput.files.length:`, fileInput.files.length);
    console.log(`🔧 Array.from(fileInput.files):`, files);
    console.log(`🔧 files.length:`, files.length);
    console.log(`🔧 files names:`, files.map(f => f.name));
    
    // Actualizar array global
    if (type === 'topos') {
        toposFiles = files;
        console.log(`🔧 toposFiles updated:`, toposFiles);
        console.log(`🔧 toposFiles.length:`, toposFiles.length);
    } else if (type === 'fotos') {
        fotosFiles = files;
        console.log(`🔧 fotosFiles updated:`, fotosFiles);
        console.log(`🔧 fotosFiles.length:`, fotosFiles.length);
    }
    
    // Mostrar lista de archivos
    displayFileList(files, fileList, type);
}

function displayFileList(files, container, type) {
    if (files.length === 0) {
        container.innerHTML = '';
        container.classList.remove('has-files');
        return;
    }
    
    container.classList.add('has-files');
    let html = '<h5>Arxius seleccionats:</h5>';
    
    files.forEach((file, index) => {
        const fileSize = formatFileSize(file.size);
        html += `
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize}</span>
                <button type="button" class="file-remove" onclick="removeFile(${index}, '${type}')">×</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function removeFile(index, type) {
    if (type === 'topos') {
        toposFiles.splice(index, 1);
        updateFileInput('topos_arxius', toposFiles);
        displayFileList(toposFiles, document.getElementById('topos_file_list'), 'topos');
    } else if (type === 'fotos') {
        fotosFiles.splice(index, 1);
        updateFileInput('fotos_arxius', fotosFiles);
        displayFileList(fotosFiles, document.getElementById('fotos_file_list'), 'fotos');
    }
}

function updateFileInput(inputId, files) {
    const fileInput = document.getElementById(inputId);
    const dt = new DataTransfer();
    
    files.forEach(file => {
        dt.items.add(file);
    });
    
    fileInput.files = dt.files;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Eliminar el prefijo "data:tipo/subtipo;base64,"
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

// Funcions per convertir coordenades
function decimalToGMS(decimal, isLatitude) {
    if (!decimal || isNaN(decimal)) return '';
    
    const abs = Math.abs(decimal);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = ((abs - degrees) * 60 - minutes) * 60;
    
    const direction = isLatitude 
        ? (decimal >= 0 ? 'N' : 'S')
        : (decimal >= 0 ? 'E' : 'W');
    
    return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toFixed(1).padStart(4, '0')}''${direction}`;
}

function gmsToDecimal(gms) {
    if (!gms) return '';
    
    // Regex per parsejar format GMS: 40°07'24.4''N
    const regex = /(\d+)°(\d+)'([\d.]+)''([NSEW])/i;
    const match = gms.match(regex);
    
    if (!match) return '';
    
    const degrees = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseFloat(match[3]);
    const direction = match[4].toUpperCase();
    
    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    
    if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
    }
    
    return decimal;
}

// Event listeners i inicialització
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners per als elements del dropdown
    const dropdown = document.getElementById('municipi-dropdown');
    const input = document.getElementById('municipi');
    
    dropdown.addEventListener('mousedown', function(e) {
        isSelectingFromDropdown = true;
        if (e.target.classList.contains('dropdown-item')) {
            const value = e.target.getAttribute('data-value');
            input.value = value;
            dropdown.style.display = 'none';
            updateCodiId();
        }
    });
    
    dropdown.addEventListener('mouseup', function() {
        isSelectingFromDropdown = false;
    });
    
    // Gestió de tecles de navegació en el dropdown
    input.addEventListener('keydown', function(e) {
        const dropdown = document.getElementById('municipi-dropdown');
        const visibleItems = Array.from(dropdown.querySelectorAll('.dropdown-item:not(.hidden)'));
        const highlighted = dropdown.querySelector('.dropdown-item.highlighted');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (visibleItems.length > 0) {
                dropdown.style.display = 'block';
                const currentIndex = visibleItems.indexOf(highlighted);
                const nextIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
                
                visibleItems.forEach(item => item.classList.remove('highlighted'));
                visibleItems[nextIndex].classList.add('highlighted');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (visibleItems.length > 0) {
                const currentIndex = visibleItems.indexOf(highlighted);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
                
                visibleItems.forEach(item => item.classList.remove('highlighted'));
                visibleItems[prevIndex].classList.add('highlighted');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlighted) {
                const value = highlighted.getAttribute('data-value');
                input.value = value;
                dropdown.style.display = 'none';
                updateCodiId();
            }
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
            visibleItems.forEach(item => item.classList.remove('highlighted'));
        }
    });
    
    // Event listeners per a conversió automàtica de coordenades
    // Conversió de decimal a GMS
    document.getElementById('latitud').addEventListener('input', function() {
        const decimal = parseFloat(this.value);
        if (!isNaN(decimal)) {
            document.getElementById('latitud_gms').value = decimalToGMS(decimal, true);
        }
    });
    
    document.getElementById('longitud').addEventListener('input', function() {
        const decimal = parseFloat(this.value);
        if (!isNaN(decimal)) {
            document.getElementById('longitud_gms').value = decimalToGMS(decimal, false);
        }
    });
    
    // Conversió de GMS a decimal
    document.getElementById('latitud_gms').addEventListener('input', function() {
        const decimal = gmsToDecimal(this.value);
        if (decimal !== '') {
            document.getElementById('latitud').value = decimal;
        }
    });
    
    document.getElementById('longitud_gms').addEventListener('input', function() {
        const decimal = gmsToDecimal(this.value);
        if (decimal !== '') {
            document.getElementById('longitud').value = decimal;
        }
    });
    
    // Gestió de l'enviament del formulari
    document.getElementById('cavitatForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('🎯 Iniciando envío del formulario...');
        
        // Validacions bàsiques
        const codiId = document.getElementById('codi_id').value;
        const nom = document.getElementById('nom').value;
        const municipi = document.getElementById('municipi').value;
        
        console.log('📝 Datos básicos:', { codiId, nom, municipi });
        
        if (!codiId || !nom || !municipi) {
            showErrorMessage('Si us plau, omple els camps obligatoris (Codi ID, Nom, Municipi)');
            return;
        }
        
        // Activar indicadores de carga
        const submitBtn = this.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true, 'Processant...');
        showLoadingOverlay('Guardant cavitat...', 'Preparant dades per a l\'enviament');
        
        try {
            // Recopilar totes les dades del formulari
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Calcular total de archivos para progreso
            const totalFiles = toposFiles.length + fotosFiles.length;
            let processedFiles = 0;
            
            if (totalFiles > 0) {
                showFileProgress(0, totalFiles);
                showLoadingOverlay('Processant arxius...', `Convertint ${totalFiles} arxius per a la càrrega`);
            }
            
            // Processar arxius de topografies
            console.log(`🔍 DEBUG - toposFiles array:`, toposFiles);
            console.log(`🔍 DEBUG - toposFiles.length:`, toposFiles.length);
            if (toposFiles.length > 0) {
                console.log(`📁 Procesando ${toposFiles.length} topografías:`, toposFiles.map(f => f.name));
                data.topos_arxius = [];
                for (let i = 0; i < toposFiles.length; i++) {
                    const file = toposFiles[i];
                    console.log(`📄 Procesando topo ${i + 1}/${toposFiles.length}: ${file.name}`);
                    
                    // Actualizar progreso
                    showFileProgress(processedFiles + 1, totalFiles, 'topografies');
                    showLoadingOverlay('Processant topografies...', `${file.name} (${i + 1}/${toposFiles.length})`);
                    
                    const base64 = await fileToBase64(file);
                    data.topos_arxius.push({
                        name: file.name,
                        data: base64,
                        type: file.type,
                        size: file.size
                    });
                    processedFiles++;
                    console.log(`✅ Topografía ${i + 1} procesada: ${file.name} (${file.size} bytes, base64 length: ${base64.length})`);
                }
                console.log(`🎯 FINAL - Total topografías preparadas: ${data.topos_arxius.length}`);
                console.log(`🎯 FINAL - topos_arxius estructura:`, data.topos_arxius.map(t => ({ name: t.name, size: t.size, dataLength: t.data.length })));
            } else {
                console.log(`ℹ️ No hay topografías para procesar`);
            }
            
            // Processar arxius de fotos
            console.log(`🔍 DEBUG - fotosFiles array:`, fotosFiles);
            console.log(`🔍 DEBUG - fotosFiles.length:`, fotosFiles.length);
            if (fotosFiles.length > 0) {
                console.log(`📷 Procesando ${fotosFiles.length} fotos:`, fotosFiles.map(f => f.name));
                data.fotos_arxius = [];
                for (let i = 0; i < fotosFiles.length; i++) {
                    const file = fotosFiles[i];
                    console.log(`📸 Procesando foto ${i + 1}/${fotosFiles.length}: ${file.name}`);
                    
                    // Actualizar progreso
                    showFileProgress(processedFiles + 1, totalFiles, 'fotos');
                    showLoadingOverlay('Processant fotos...', `${file.name} (${i + 1}/${fotosFiles.length})`);
                    
                    const base64 = await fileToBase64(file);
                    data.fotos_arxius.push({
                        name: file.name,
                        data: base64,
                        type: file.type,
                        size: file.size
                    });
                    processedFiles++;
                    console.log(`✅ Foto ${i + 1} procesada: ${file.name} (${file.size} bytes, base64 length: ${base64.length})`);
                }
                console.log(`🎯 FINAL - Total fotos preparadas: ${data.fotos_arxius.length}`);
                console.log(`🎯 FINAL - fotos_arxius estructura:`, data.fotos_arxius.map(f => ({ name: f.name, size: f.size, dataLength: f.data.length })));
            } else {
                console.log(`ℹ️ No hay fotos para procesar`);
            }
            
            // Configuración segura de Google Apps Script
            // La URL se configura en config.js según el entorno
            const GOOGLE_SCRIPT_URL = window.ESPEMO_CONFIG?.GOOGLE_SCRIPT_URL;
            const GOOGLE_INTEGRATION_ENABLED = window.ESPEMO_CONFIG?.ENABLE_GOOGLE_INTEGRATION;
            
            // Debug información
            console.log('Debug Google Apps Script:', {
                config: window.ESPEMO_CONFIG,
                url: GOOGLE_SCRIPT_URL,
                enabled: GOOGLE_INTEGRATION_ENABLED,
                hostname: window.location.hostname
            });
            
            // Verificar si Google Apps Script está configurado
            if (!GOOGLE_INTEGRATION_ENABLED || !GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'URL_SERA_CONFIGURADA_POR_ADMINISTRADOR') {
                console.warn('Google Apps Script no configurado. Usando modo fallback.');
                hideFileProgress();
                hideLoadingOverlay();
                setButtonLoading(submitBtn, false);
                // En lugar de throw, llamar directamente al fallback
                mostrarFallbackJSON(data);
                return;
            }
            
            // Cambiar a modo de envío
            hideFileProgress();
            showLoadingOverlay('Enviant dades...', 'Comunicant amb el servidor de Google');
            setButtonLoading(submitBtn, true, 'Enviant...');
            
            console.log('🚀 Enviando datos a Google Apps Script...', {
                url: GOOGLE_SCRIPT_URL,
                dataKeys: Object.keys(data),
                dataSize: JSON.stringify(data).length
            });
            
            // 🔍 DEBUG CRÍTICO - Verificar estructura de archivos antes del envío
            console.log('🔍 ESTRUCTURA DE ARCHIVOS ANTES DEL ENVÍO:');
            console.log('📄 data.topos_arxius:', data.topos_arxius);
            console.log('📸 data.fotos_arxius:', data.fotos_arxius);
            if (data.topos_arxius) {
                console.log(`📊 Topografías: ${data.topos_arxius.length} archivos`);
                data.topos_arxius.forEach((topo, i) => {
                    console.log(`   ${i + 1}. ${topo.name} (${topo.type}, ${topo.size} bytes)`);
                });
            }
            if (data.fotos_arxius) {
                console.log(`📊 Fotos: ${data.fotos_arxius.length} archivos`);
                data.fotos_arxius.forEach((foto, i) => {
                    console.log(`   ${i + 1}. ${foto.name} (${foto.type}, ${foto.size} bytes)`);
                });
            }
            
            // Volver a FormData para evitar CORS preflight
            const requestFormData = new FormData();
            requestFormData.append('data', JSON.stringify(data));
            
            console.log('📡 Realizando petición POST con FormData...');
            console.log('📦 Tamaño del JSON que se envía:', JSON.stringify(data).length, 'caracteres');
            // No imprimir el JSON completo porque puede ser muy grande con las imágenes
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: requestFormData,
            });
            
            console.log('📥 Respuesta recibida:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
            
            const result = await response.json();
            console.log('📋 Resultado parseado:', result);
            
            // Ocultar indicadores de carga
            hideLoadingOverlay();
            setButtonLoading(submitBtn, false);
            
            if (result.success) {
                let message = `Cavitat guardada correctament! Codi ID: ${result.codiId}`;
                if (result.fotosSubides) {
                    message += ` | Fotos subides: ${result.fotosSubides}`;
                }
                if (result.toposSubides) {
                    message += ` | Topografies subides: ${result.toposSubides}`;
                }
                console.log('✅ Éxito:', message);
                
                // Mostrar mensaje de éxito en lugar de alert
                showSuccessMessage(message);
                
                // Netejar esborrany
                localStorage.removeItem('cavitatEsborrany');
                
                // Opcional: reiniciar formulari después de un delay
                setTimeout(() => {
                    if (confirm('Vols afegir una nova cavitat?')) {
                        clearForm();
                    }
                }, 1000);
            } else {
                console.error('❌ Error del servidor:', result);
                showErrorMessage('Error al guardar: ' + result.message);
            }
            
        } catch (error) {
            console.error('Error al enviar dades:', error);
            
            // Ocultar indicadores de carga
            hideLoadingOverlay();
            hideFileProgress();
            setButtonLoading(submitBtn, false);
            
            // Recopilar dades si no están disponibles
            let data;
            try {
                const formData = new FormData(document.getElementById('cavitatForm'));
                data = Object.fromEntries(formData);
            } catch (formError) {
                console.error('Error al obtenir dades del formulari:', formError);
                showErrorMessage('Error al processar les dades del formulari');
                return;
            }
            
            // Mostrar error específico
            showErrorMessage(`Error de conexió: ${error.message}`);
            
            // Mostrar fallback después de un delay
            setTimeout(() => {
                mostrarFallbackJSON(data);
            }, 2000);
        }
    });
    
    // Carregar esborrany al carregar la pàgina
    loadDraft();
    
    // Afegir un pou i una sala per defecte si no n'hi ha cap
    if (pouCounter === 0) {
        addPou();
    }
    if (salaCounter === 0) {
        addSala();
    }
    
    // Inicialitzar multi-select d'Interès
    // Afegir event listeners als checkboxes d'interès
    const interesCheckboxes = document.querySelectorAll('#interes-options input[type="checkbox"]');
    interesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateInteresDisplay);
    });
    
    // Afegir event listener per tancar dropdown quan es fa clic fora
    document.addEventListener('click', function(event) {
        const container = document.getElementById('interes-container');
        if (container && !container.contains(event.target)) {
            container.classList.remove('open');
        }
    });
    
    // Modificar el processament del formulari per manejar múltiples valors d'interès
    const cavitatForm = document.getElementById('cavitatForm');
    if (cavitatForm) {
        cavitatForm.addEventListener('submit', function(event) {
            // Interceptar per processar els interessos múltiples
            const checkedInteresos = document.querySelectorAll('#interes-options input[type="checkbox"]:checked');
            const interesValues = Array.from(checkedInteresos).map(cb => cb.value);
            
            // Crear un camp ocult amb tots els interessos seleccionats
            let hiddenField = document.getElementById('interes-hidden');
            if (!hiddenField) {
                hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'interes_multiple';
                hiddenField.id = 'interes-hidden';
                this.appendChild(hiddenField);
            }
            hiddenField.value = interesValues.join('; ');
        }, true); // Usar capture per interceptar abans dels altres handlers
    }
});

// Función para mostrar fallback JSON
function mostrarFallbackJSON(data) {
    // Mostrar les dades en format JSON per a còpia (fallback)
    const jsonData = JSON.stringify(data, null, 2);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
        <head><title>Dades de la Cavitat (Fallback)</title></head>
        <body>
            <h2>Formulari funcionant en mode offline</h2>
            <p>Google Apps Script no està configurat. Aquí tens les dades en format JSON:</p>
            <h3>Dades de la Cavitat - ${data.nom || 'Sense nom'}</h3>
            <p><strong>Codi ID:</strong> ${data.codi_id || 'No assignat'}</p>
            <textarea style="width:100%; height:400px;">${jsonData}</textarea>
            <br><br>
            <button onclick="navigator.clipboard.writeText('${jsonData.replace(/'/g, "\\'")}').then(() => alert('Dades copiades al portaretalls!'))">Copiar JSON</button>
            <br><br>
            <p><strong>Instruccions:</strong></p>
            <ul>
                <li>Copia el JSON de dalt</li>
                <li>Contacta amb l'administrador per activar Google Drive</li>
                <li>O guarda aquestes dades manualment</li>
            </ul>
        </body>
        </html>
    `);
    
    showError('Mode offline activat. Les dades s\'han obert en una nova finestra.');
}

// Funcions per al multi-select d'Interès
function toggleInteresDropdown() {
    const container = document.getElementById('interes-container');
    container.classList.toggle('open');
}

function updateInteresDisplay() {
    const checkboxes = document.querySelectorAll('#interes-options input[type="checkbox"]:checked');
    const selectedSpan = document.getElementById('interes-selected');
    const container = document.getElementById('interes-container');
    
    if (checkboxes.length === 0) {
        selectedSpan.textContent = 'Selecciona els interessos';
        // Eliminar comptador si existeix
        const counter = container.querySelector('.multi-select-selected-count');
        if (counter) counter.remove();
    } else if (checkboxes.length === 1) {
        const label = checkboxes[0].nextElementSibling.textContent;
        selectedSpan.textContent = label.length > 50 ? label.substring(0, 50) + '...' : label;
        // Eliminar comptador si existeix
        const counter = container.querySelector('.multi-select-selected-count');
        if (counter) counter.remove();
    } else {
        selectedSpan.textContent = `${checkboxes.length} interessos seleccionats`;
        
        // Afegir comptador visual
        let counter = container.querySelector('.multi-select-selected-count');
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'multi-select-selected-count';
            document.getElementById('interes-selected').appendChild(counter);
        }
        counter.textContent = checkboxes.length;
    }
}

