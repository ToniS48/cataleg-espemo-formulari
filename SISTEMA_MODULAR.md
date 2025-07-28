# 📋 Sistema Modular de Formularios - ESPEMO

## 🎯 Resumen
Sistema modular para gestión de cavitats que soporta tanto creación como edición de registros, aprovechando código común y optimizando la experiencia de usuario.

## 📁 Arquitectura de Archivos

### Archivos Principales
- **`index.html`** - Dashboard principal (página de inicio)
- **`formulario.html`** - Formulario de creación/edición (modo mixto)
- **`editar.html`** - Formulario dedicado para edición
- **`form-manager.js`** - Gestor modular que controla ambos modos
- **`data-mock.js`** - Datos de prueba y funciones de acceso

### Archivos de Soporte
- **`dashboard.js`** - Lógica del dashboard
- **`script.js`** - Funcionalidad original del formulario
- **`styles.css`** - Estilos base + estilos de edición
- **`dashboard.css`** - Estilos específicos del dashboard

## 🔄 Flujos de Navegación

### Flujo de Creación
1. **Dashboard** → Botón "Nova Cavitat" → **`formulario.html`**
2. **FormManager** detecta modo `create`
3. Formulario se inicializa vacío
4. Usuario completa y guarda → Redirección al dashboard

### Flujo de Edición
1. **Dashboard** → Seleccionar cavitat → Botón "Editar" → **`editar.html?edit=ID`**
2. **FormManager** detecta modo `edit` + ID de cavitat
3. Carga datos existentes desde `data-mock.js`
4. Formulario se pobla automáticamente
5. Usuario modifica y actualiza → Redirección al dashboard

## 🎛️ FormManager: Funcionalidades

### Detección Automática de Modo
```javascript
// URL: formulario.html → Modo CREATE
// URL: editar.html?edit=MOR-001 → Modo EDIT
this.detectMode();
```

### Configuración Adaptativa
- **Títulos de página** dinámicos
- **Textos de botones** contextuales
- **Estilos CSS** específicos por modo
- **Información de estado** visible

### Carga de Datos Inteligente
- **Datos mock** para desarrollo y testing
- **Poblado automático** de todos los campos
- **Manejo de campos especiales** (multi-select, coordenadas)
- **Validación** de existencia de datos

### Gestión de Estados
- **Loading indicators** durante operaciones
- **Mensajes de éxito/error** contextuales
- **Confirmaciones** para cancelar edición
- **Redirección automática** después de guardar

## 🎨 Mejoras Visuales

### Modo Edición
- **Info box azul** indicando modo de edición
- **Clase CSS** `.edit-mode` en body
- **Botón cancelar** adicional
- **Indicadores visuales** de cambios

### Retroalimentación Visual
- **Campos modificados** resaltados en naranja
- **Validación en tiempo real** con bordes verdes/rojos
- **Estados de carga** con spinners
- **Mensajes contextuales** según la operación

## 🔧 Datos Mock para Testing

### Cavitats Disponibles
- **MOR-001** - Cova dels Àngels (datos completos)
- **VLF-002** - Avenc de la Font (datos medios)
- **PAL-003** - Cova de les Bruixes (datos básicos)

### Función de Acceso
```javascript
// En data-mock.js
getCavitatDetailedData(cavitatId) // Retorna datos completos para edición
```

## 🚀 URLs del Sistema

### Producción (GitHub Pages)
- **Dashboard**: `https://tonis48.github.io/cataleg-espemo-formulari/`
- **Nueva cavitat**: `https://tonis48.github.io/cataleg-espemo-formulari/formulario.html`
- **Editar cavitat**: `https://tonis48.github.io/cataleg-espemo-formulari/editar.html?edit=ID`

### Desarrollo Local
- **Dashboard**: `http://localhost:8000/cataleg-espemo-formulari/`
- **Nueva cavitat**: `http://localhost:8000/cataleg-espemo-formulari/formulario.html`
- **Editar cavitat**: `http://localhost:8000/cataleg-espemo-formulari/editar.html?edit=ID`

## ✅ Ventajas del Sistema Modular

1. **Reutilización de código** - Mismo formulario para crear y editar
2. **Experiencia consistente** - Interfaz unificada
3. **Mantenimiento simplificado** - Cambios en un lugar
4. **Escalabilidad** - Fácil agregar nuevos modos
5. **Testing optimizado** - Datos mock centralizados
6. **UX mejorada** - Retroalimentación visual clara

## 🔮 Próximas Mejoras

- Conexión con backend real de Google Apps Script
- Sistema de validación avanzado
- Historial de cambios en edición
- Preview de cambios antes de guardar
- Edición masiva de múltiples cavitats
- Modo offline con sincronización

---

**🏗️ Sistema desarrollado para ESPEMO - Catàleg de Cavitats**
