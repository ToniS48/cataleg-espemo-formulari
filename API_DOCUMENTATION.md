# API COMPLETA GOOGLE APPS SCRIPT - ESPEMO
## Documentación y Ejemplos de Uso

### 🚀 Configuración Inicial

1. **Copiar el código** de `google_apps_script_COMPLETE.js` a tu Google Apps Script
2. **Despliegar como aplicación web** con acceso "Cualquier usuario"
3. **Obtener la URL** de la aplicación web
4. **Actualizar la URL** en tu `api-config.js`

### 📋 Acciones Disponibles

#### **INFORMACIÓN Y ESTADÍSTICAS**
- `ping` - Información del API y acciones disponibles
- `getStats` - Estadísticas completas del sistema
- `getMunicipis` - Lista de municipios únicos

#### **CAVITATS (CRUD Completo)**
- `getAllCavitats` - Obtener todas las cavitats
- `getCavitatById` - Obtener cavitat por ID
- `searchCavitats` - Búsqueda avanzada
- `createCavitat` / `saveCavitat` - Crear nueva cavitat
- `updateCavitat` - Actualizar cavitat existente
- `deleteCavitat` - Eliminar cavitat

#### **POZOS (CRUD Completo)**
- `getAllPozos` - Obtener todos los pozos
- `createPozo` - Crear nuevo pozo
- `updatePozo` - Actualizar pozo
- `deletePozo` - Eliminar pozo

#### **SALAS (CRUD Completo)**
- `getAllSalas` - Obtener todas las salas
- `createSala` - Crear nueva sala
- `updateSala` - Actualizar sala
- `deleteSala` - Eliminar sala

#### **FOTOS (CRUD Completo)**
- `getAllFotos` - Obtener todas las fotos
- `createFoto` - Crear nueva foto
- `updateFoto` - Actualizar foto
- `deleteFoto` - Eliminar foto

#### **TOPOGRAFÍAS (CRUD Completo)**
- `getAllTopos` - Obtener todas las topografías
- `createTopo` - Crear nueva topografía
- `updateTopo` - Actualizar topografía
- `deleteTopo` - Eliminar topografía

#### **BIBLIOGRAFÍA (CRUD Completo)**
- `getAllBiblio` - Obtener toda la bibliografía
- `createBiblio` - Crear nueva bibliografía
- `updateBiblio` - Actualizar bibliografía
- `deleteBiblio` - Eliminar bibliografía

#### **UTILIDADES**
- `backup` - Crear backup del sistema
- `restore` - Restaurar desde backup

---

## 📝 Ejemplos de Uso

### 1. Verificar API
```javascript
// URL: https://tu-apps-script-url.com?action=ping&callback=handleResponse
const response = await apiService.ping();
console.log(response);
```

### 2. Obtener Estadísticas
```javascript
const stats = await apiService.getStats();
console.log('Total cavitats:', stats.data.totalCavitats);
console.log('Total municipis:', stats.data.totalMunicipis);
```

### 3. Obtener Todas las Cavitats
```javascript
// Sin filtros
const allCavitats = await apiService.getAllCavitats();

// Con filtro por cavitat_id
const cavitatsFiltered = await apiService.getAllCavitats({ cavitat_id: 'CAV0001' });

// Con búsqueda general
const cavitatsSearch = await apiService.getAllCavitats({ search: 'cueva' });
```

### 4. Buscar Cavitats (Búsqueda Avanzada)
```javascript
const searchParams = {
  municipi: 'Barcelona',
  profunditat_min: 10,
  profunditat_max: 100,
  text: 'estalactitas'
};
const searchResults = await apiService.searchCavitats(searchParams);
```

### 5. Crear Nueva Cavitat
```javascript
const newCavitat = {
  Nom: 'Cueva Nueva',
  Municipi: 'Girona',
  Profunditat: 25,
  Coordenades_UTM_X: 123456,
  Coordenades_UTM_Y: 654321,
  Descripcio: 'Nueva cavidad descubierta'
};

const result = await apiService.createCavitat(newCavitat);
console.log('ID generado:', result.data.id);
```

### 6. Actualizar Cavitat Existente
```javascript
const updateData = {
  ID: 'CAV0001',
  Profunditat: 30,
  Descripcio: 'Descripción actualizada'
};

const result = await apiService.updateCavitat('CAV0001', updateData);
```

### 7. Eliminar Cavitat
```javascript
const result = await apiService.deleteCavitat('CAV0001');
console.log('Eliminada:', result.success);
```

### 8. Trabajar con Pozos
```javascript
// Obtener pozos de una cavitat específica
const pozos = await apiService.getAllPozos({ cavitat_id: 'CAV0001' });

// Crear nuevo pozo
const newPozo = {
  cavitat_id: 'CAV0001',
  Nom: 'Pozo Principal',
  Profunditat: 15,
  Diametro: 2.5
};
const pozoCreated = await apiService.createPozo(newPozo);

// Actualizar pozo
const pozoUpdated = await apiService.updatePozo('POZ0001', { Profunditat: 18 });

// Eliminar pozo
const pozoDeleted = await apiService.deletePozo('POZ0001');
```

### 9. Trabajar con Salas
```javascript
// Obtener salas de una cavitat
const salas = await apiService.getAllSalas({ cavitat_id: 'CAV0001' });

// Crear nueva sala
const newSala = {
  cavitat_id: 'CAV0001',
  Nom: 'Sala Principal',
  Longitud: 20,
  Amplada: 15,
  Alçada: 8
};
const salaCreated = await apiService.createSala(newSala);
```

### 10. Trabajar con Fotos
```javascript
// Obtener fotos de una cavitat
const fotos = await apiService.getAllFotos({ cavitat_id: 'CAV0001' });

// Crear referencia a nueva foto
const newFoto = {
  cavitat_id: 'CAV0001',
  Nom: 'Entrada principal',
  URL: 'https://drive.google.com/file/d/123456',
  Descripcio: 'Vista de la entrada'
};
const fotoCreated = await apiService.createFoto(newFoto);
```

---

## 🔧 Actualización de tu api-service.js

Añade estos métodos a tu `api-service.js`:

```javascript
// Funciones para Pozos
async getAllPozos(params = {}) {
  return this.makeRequest('getAllPozos', params);
},

async createPozo(data) {
  return this.makeRequest('createPozo', { data: JSON.stringify(data) });
},

async updatePozo(id, data) {
  return this.makeRequest('updatePozo', { id, data: JSON.stringify(data) });
},

async deletePozo(id) {
  return this.makeRequest('deletePozo', { id });
},

// Funciones para Salas
async getAllSalas(params = {}) {
  return this.makeRequest('getAllSalas', params);
},

async createSala(data) {
  return this.makeRequest('createSala', { data: JSON.stringify(data) });
},

async updateSala(id, data) {
  return this.makeRequest('updateSala', { id, data: JSON.stringify(data) });
},

async deleteSala(id) {
  return this.makeRequest('deleteSala', { id });
},

// Funciones para Fotos
async getAllFotos(params = {}) {
  return this.makeRequest('getAllFotos', params);
},

async createFoto(data) {
  return this.makeRequest('createFoto', { data: JSON.stringify(data) });
},

async updateFoto(id, data) {
  return this.makeRequest('updateFoto', { id, data: JSON.stringify(data) });
},

async deleteFoto(id) {
  return this.makeRequest('deleteFoto', { id });
},

// Funciones para Topografías
async getAllTopos(params = {}) {
  return this.makeRequest('getAllTopos', params);
},

async createTopo(data) {
  return this.makeRequest('createTopo', { data: JSON.stringify(data) });
},

async updateTopo(id, data) {
  return this.makeRequest('updateTopo', { id, data: JSON.stringify(data) });
},

async deleteTopo(id) {
  return this.makeRequest('deleteTopo', { id });
},

// Funciones para Bibliografía
async getAllBiblio(params = {}) {
  return this.makeRequest('getAllBiblio', params);
},

async createBiblio(data) {
  return this.makeRequest('createBiblio', { data: JSON.stringify(data) });
},

async updateBiblio(id, data) {
  return this.makeRequest('updateBiblio', { id, data: JSON.stringify(data) });
},

async deleteBiblio(id) {
  return this.makeRequest('deleteBiblio', { id });
},

// Funciones avanzadas para Cavitats
async searchCavitats(params) {
  return this.makeRequest('searchCavitats', params);
},

async updateCavitat(id, data) {
  return this.makeRequest('updateCavitat', { id, data: JSON.stringify(data) });
},

async deleteCavitat(id) {
  return this.makeRequest('deleteCavitat', { id });
},

// Utilidades
async backup() {
  return this.makeRequest('backup');
},

async restore(backupId) {
  return this.makeRequest('restore', { backupId });
}
```

---

## 🎯 Características Principales

### ✅ **CRUD Completo**
- Crear, leer, actualizar y eliminar para todas las entidades
- IDs automáticos con prefijos (CAV, POZ, SAL, FOT, TOP, BIB)
- Timestamps automáticos

### ✅ **Búsqueda Avanzada**
- Filtros por múltiples criterios
- Búsqueda de texto general
- Filtros específicos (municipio, profundidad, etc.)

### ✅ **Manejo de Errores Robusto**
- Respuestas consistentes
- Logging detallado
- Manejo de diferentes formatos de datos

### ✅ **Flexibilidad**
- Soporte JSONP y JSON
- Múltiples formas de enviar datos
- Filtros opcionales en todas las consultas

### ✅ **Escalabilidad**
- Funciones genéricas reutilizables
- Estructura modular
- Fácil extensión para nuevas entidades

---

## 🚦 Estados de Respuesta

Todas las respuestas siguen este formato:

```javascript
// Éxito
{
  "success": true,
  "data": { ... },
  "message": "Operación completada",
  "count": 123  // Para listas
}

// Error
{
  "success": false,
  "error": "Descripción del error",
  "timestamp": "2025-07-28T10:00:00.000Z"
}
```

---

## ⚡ Próximos Pasos

1. **Copia el código** `google_apps_script_COMPLETE.js` a Google Apps Script
2. **Despliega** como aplicación web
3. **Actualiza** la URL en `api-config.js`
4. **Añade** los nuevos métodos a `api-service.js`
5. **Prueba** con `?action=ping` para verificar

¡Con esta API ya no necesitarás hacer cambios constantes! Todo está preparado para operaciones completas de gestión de datos.
