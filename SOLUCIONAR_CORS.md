# 🚨 SOLUCIÓN PROBLEMA CORS - Google Apps Script

## ❗ Problema Identificado
```
Access to fetch at 'https://script.google.com/macros/s/...' from origin 'https://tonis48.github.io' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔧 SOLUCIÓN PASO A PASO

### 1. **Actualizar el Google Apps Script**
El archivo `google_apps_script.js` ya ha sido actualizado con los headers CORS necesarios. Necesitas **copiar este código actualizado** a tu proyecto en Google Apps Script.

### 2. **Acceder a tu Google Apps Script**
1. Ve a [script.google.com](https://script.google.com)
2. Abre tu proyecto existente (el que tiene la URL que está en `config.js`)

### 3. **Reemplazar el código completo**
1. **Selecciona TODO el código** del archivo `Code.gs` en Google Apps Script
2. **Bórralo completamente**
3. **Copia TODO el contenido** del archivo `google_apps_script.js` de este proyecto
4. **Pégalo en Code.gs**
5. **Guarda** (Ctrl+S)

### 4. **Redesplegar el script**
⚠️ **IMPORTANTE**: Debes hacer un nuevo deployment:

1. En Google Apps Script, ve a **Deploy** > **Manage deployments**
2. Haz clic en el ⚙️ (configuración) del deployment actual
3. Cambia la **Version** de "Head" a **"New version"**
4. Añade una descripción: "Añadir soporte CORS para GitHub Pages"
5. Haz clic en **Deploy**
6. **Copia la nueva URL** (puede ser la misma o diferente)

### 5. **Verificar la configuración del deployment**
Asegúrate de que:
- **Execute as**: Tu cuenta (no "User accessing the web app")
- **Who has access**: **"Anyone"** (muy importante)

### 6. **Probar la solución**
1. Actualiza la página del formulario en GitHub Pages
2. Rellena algunos campos de prueba
3. Intenta enviar el formulario
4. Verifica que no aparezcan errores CORS en la consola

## 🛠️ Cambios técnicos realizados

### Función `addCorsHeaders()` añadida:
```javascript
function addCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Max-Age', '3600');
  return response;
}
```

### Funciones `doPost()` y `doGet()` actualizadas:
- Todas las respuestas ahora incluyen los headers CORS
- Tanto respuestas exitosas como errores tienen CORS

## 🔍 Verificación
Después de aplicar los cambios:
1. La consola del navegador NO debe mostrar errores CORS
2. El formulario debe enviar datos correctamente
3. Debe aparecer el mensaje de éxito en lugar del fallback JSON

## 📞 Si persisten los problemas
1. Verifica que hayas copiado TODO el código actualizado
2. Asegúrate de haber hecho un **nuevo deployment**
3. Confirma que el acceso sea "Anyone"
4. Prueba con un navegador en modo incógnito

---
**Nota**: Este archivo es solo para documentación. El código real que necesitas está en `google_apps_script.js`
