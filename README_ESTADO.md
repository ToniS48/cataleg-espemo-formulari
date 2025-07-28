# ESPEMO - Catàleg de Cavitats

## 🏗️ Estado del Proyecto

✅ **COMPLETAMENTE FUNCIONAL**:
- Dashboard con navegación completa
- Sistema de filtros y búsqueda
- Formulario modular de edición
- Estadísticas dinámicas
- Arquitectura API preparada

## 🚀 Modos de Funcionamiento

### **Modo Desarrollo (localhost)**
- Usa datos mock para desarrollo rápido
- No requiere configuración externa
- Perfecto para testing y desarrollo

### **Modo Producción (GitHub Pages)**
- Puede usar Google Apps Script para datos reales
- Fallback automático a datos mock si hay problemas
- Funciona independientemente de la configuración externa

## 📁 Estructura de Archivos

- `index.html` - Página principal
- `dashboard.html` - Dashboard completo
- `dashboard.js` - Lógica del dashboard
- `api-service.js` - Servicio API con fallback
- `data-mock.js` - Datos de ejemplo
- `form-manager.js` - Sistema de formularios
- `styles.css` - Estilos completos

## 🔧 Configuración

### Para Google Apps Script (Opcional)
1. Crea un Google Apps Script
2. Usa el código de `google_apps_script_fixed.js`
3. Despliega como aplicación web
4. Actualiza la URL en `api-config.js`

### Para GitHub Pages
1. Haz push del proyecto a GitHub
2. Activa GitHub Pages en la configuración del repositorio
3. El sistema funcionará automáticamente

## ✨ Características

- **Datos Mock Realistas**: 8 cavitats de ejemplo con datos completos
- **Filtros Avanzados**: Por municipio, génesis, profundidad, texto
- **Estadísticas**: Cálculos automáticos de totales y promedios
- **Formulario Dinámico**: Soporte para pozos y salas ilimitados
- **Interfaz Responsiva**: Funciona en desktop y móvil
- **Indicadores de Carga**: UX completa con feedback visual

## 🎯 Próximos Pasos

1. **Testear en GitHub Pages** - Verificar funcionamiento en producción
2. **Optimizar Google Apps Script** - Cuando sea necesario
3. **Añadir funcionalidades** - Según necesidades específicas

## 📊 Datos Mock Incluidos

El sistema incluye datos de ejemplo de 8 cavitats de diferentes municipios con:
- Coordenadas completas
- Pozos y salas
- Diferentes tipos de génesis
- Estadísticas variadas

Perfecto para testing y demostración del sistema completo.
