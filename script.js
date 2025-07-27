// Formulari d'Inscripció de Cavitats - ESPEMO
// JavaScript functionality

// Dades de municipis
const municipis = {"Ares del Maestrat": "ARM", "Castell de Cabres": "CDC", "Castellfort": "CAF", "Cinctorres": "CNT", "Forcall": "FOR", "Herbers": "HER", "La Mata": "MAT", "Morella": "MOR", "Olocau del Rey": "OLO", "Palanques": "PAL", "La Pobla de Benifassà": "POB", "Portell": "POR", "Sorita": "SOR", "Todolella": "TOD", "Vallibona": "VBN", "Vilafranca": "VLF", "Villores": "VIL"};

// Comptador global per generar IDs únics
let nextId = 1;
let pouCounter = 0;
let salaCounter = 0;

// Variables per gestió d'arxius
let toposFiles = [];
let fotosFiles = [];

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
    
    // Actualizar array global
    if (type === 'topos') {
        toposFiles = files;
    } else if (type === 'fotos') {
        fotosFiles = files;
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
        
        // Validacions bàsiques
        const codiId = document.getElementById('codi_id').value;
        const nom = document.getElementById('nom').value;
        const municipi = document.getElementById('municipi').value;
        
        if (!codiId || !nom || !municipi) {
            showError('Si us plau, omple els camps obligatoris (Codi ID, Nom, Municipi)');
            return;
        }
        
        // Mostrar indicador de càrrega
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Guardant...';
        submitBtn.disabled = true;
        
        try {
            // Recopilar totes les dades del formulari
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Processar arxius de topografies
            if (toposFiles.length > 0) {
                data.topos_arxius = [];
                for (const file of toposFiles) {
                    const base64 = await fileToBase64(file);
                    data.topos_arxius.push({
                        name: file.name,
                        data: base64,
                        type: file.type,
                        size: file.size
                    });
                }
            }
            
            // Processar arxius de fotos
            if (fotosFiles.length > 0) {
                data.fotos_arxius = [];
                for (const file of fotosFiles) {
                    const base64 = await fileToBase64(file);
                    data.fotos_arxius.push({
                        name: file.name,
                        data: base64,
                        type: file.type,
                        size: file.size
                    });
                }
            }
            
            // Configuración segura de Google Apps Script
            // La URL se configura en config.js según el entorno
            const GOOGLE_SCRIPT_URL = window.ESPEMO_CONFIG?.GOOGLE_SCRIPT_URL;
            const GOOGLE_INTEGRATION_ENABLED = window.ESPEMO_CONFIG?.ENABLE_GOOGLE_INTEGRATION;
            
            // Verificar si Google Apps Script está configurado
            if (!GOOGLE_INTEGRATION_ENABLED || !GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'URL_SERA_CONFIGURADA_POR_ADMINISTRADOR') {
                console.warn('Google Apps Script no configurado. Usando modo fallback.');
                throw new Error('Google Apps Script no disponible');
            }
            
            // Enviar dades a Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                mode: 'cors'
            });
            
            const result = await response.json();
            
            if (result.success) {
                let message = `Cavitat guardada correctament!\nCodi ID: ${result.codiId}`;
                if (result.fotosSubides) {
                    message += `\nFotos subides: ${result.fotosSubides}`;
                }
                if (result.toposSubides) {
                    message += `\nTopografies subides: ${result.toposSubides}`;
                }
                alert(message);
                
                // Netejar esborrany
                localStorage.removeItem('cavitatEsborrany');
                
                // Opcional: reiniciar formulari
                if (confirm('Vols afegir una nova cavitat?')) {
                    clearForm();
                }
            } else {
                showError('Error al guardar: ' + result.message);
            }
            
        } catch (error) {
            console.error('Error al enviar dades:', error);
            
            // Mostrar les dades en format JSON per a còpia (fallback)
            const jsonData = JSON.stringify(data, null, 2);
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                <head><title>Dades de la Cavitat (Fallback)</title></head>
                <body>
                    <h2>Error al connectar amb Google Apps Script</h2>
                    <p>No s'ha pogut guardar automàticament. Aquí tens les dades en format JSON:</p>
                    <h3>Dades de la Cavitat - ${data.nom}</h3>
                    <p><strong>Codi ID:</strong> ${data.codi_id}</p>
                    <textarea style="width:100%; height:400px;">${jsonData}</textarea>
                    <br><br>
                    <button onclick="navigator.clipboard.writeText('${jsonData.replace(/'/g, "\\'")}').then(() => alert('Dades copiades al portaretalls!'))">Copiar JSON</button>
                </body>
                </html>
            `);
            
            showError('No s\'ha pogut connectar amb Google Drive. Les dades s\'han obert en una nova finestra.');
        }
        
        // Restaurar botó
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
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
});
