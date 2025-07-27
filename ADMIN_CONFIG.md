# Configuración del Administrador - ESPEMO

⚠️ **IMPORTANTE**: Este archivo contiene información sensible. No debe ser compartido públicamente.

## 🔐 URLs y IDs de Configuración

### Google Apps Script
```
URL de producción: https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

### Google Sheets
```
Sheet ID: YOUR_ACTUAL_SHEET_ID
URL completa: https://docs.google.com/spreadsheets/d/YOUR_ACTUAL_SHEET_ID/edit
```

### Google Drive
```
Folder ID: YOUR_ACTUAL_FOLDER_ID  
URL completa: https://drive.google.com/drive/folders/YOUR_ACTUAL_FOLDER_ID
```

## 🛠️ Instrucciones de Configuración

### Paso 1: Configurar Google Apps Script
1. Ir a [script.google.com](https://script.google.com)
2. Crear nuevo proyecto: "ESPEMO Formulario Backend"
3. Copiar código de `google_apps_script.js`
4. Reemplazar en el código:
   - `TU_GOOGLE_SHEET_ID_AQUI` → Tu Sheet ID real
   - `TU_CARPETA_DRIVE_ID_AQUI` → Tu Folder ID real

### Paso 2: Desplegar Google Apps Script
1. Deploy → New deployment
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. **Copiar la URL generada**

### Paso 3: Actualizar Configuración en GitHub
1. Editar `config.js` en GitHub
2. Reemplazar `'URL_SERA_CONFIGURADA_POR_ADMINISTRADOR'` con la URL real
3. Commit y push

## 🔒 Niveles de Seguridad Implementados

### ✅ Nivel 1: URLs Públicas Controladas
- La URL de Google Apps Script es pública pero el acceso está controlado por Google
- Solo puede ejecutar las funciones específicas que hayas autorizado

### ✅ Nivel 2: Permisos de Google Apps Script
- El script solo tiene acceso a las carpetas/hojas específicas que autorices
- Puedes revocar acceso desde Google Apps Script en cualquier momento

### ✅ Nivel 3: Validación en el Script
- El script de Google Apps Script debería validar los datos recibidos
- Implementar rate limiting si es necesario

### ✅ Nivel 4: Separación de Entornos
- Configuración diferente para desarrollo y producción
- Modo debug desactivado en producción

## 🚨 Medidas de Seguridad Adicionales

### Opcional: Restricción por Dominio
En Google Apps Script, puedes añadir validación de origen:

```javascript
function doPost(e) {
    // Verificar origen
    const allowedOrigins = ['https://tonis48.github.io'];
    const origin = e.request.headers['Origin'] || e.request.headers['Referer'];
    
    if (!allowedOrigins.some(allowed => origin?.includes(allowed))) {
        return ContentService
            .createTextOutput(JSON.stringify({error: 'Origen no autorizado'}))
            .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Continuar con la lógica normal...
}
```

### Opcional: Autenticación Básica
Si necesitas mayor seguridad, puedes implementar un token de acceso:

```javascript
// En config.js
API_TOKEN: 'tu_token_secreto_aqui'

// En script.js
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + window.ESPEMO_CONFIG.API_TOKEN
}
```

## 📝 Notas Importantes

1. **Las URLs de Google Apps Script son públicas por diseño** - esto es normal
2. **La seguridad está en los permisos de Google**, no en ocultar URLs
3. **Puedes cambiar el ID del script** regenerando el deployment si es necesario
4. **Mantén backups** de tus configuraciones importantes

---

**Contacto**: tonisoler@espemo.org para dudas sobre configuración
