# Despliegue con GitHub Pages + Google Apps Script

## 📋 Pasos de Configuración

### 1. Crear Repositorio en GitHub

1. **Ir a GitHub**: [github.com](https://github.com)
2. **Crear nuevo repositorio**:
   - Nombre: `cataleg-espemo-formulari`
   - Descripción: `Formulari d'Inscripció de Cavitats - ESPEMO`
   - ✅ Público (necesario para GitHub Pages gratuito)
   - ✅ Añadir README

### 2. Subir Archivos al Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/cataleg-espemo-formulari.git
cd cataleg-espemo-formulari

# Copiar todos los archivos del formulario
# (desde d:\Documentos\Espemo\Apps\CatalegESPEMO\)
```

**Archivos necesarios para GitHub Pages:**
- ✅ `formulario_cavitats.html` → **renombrar a `index.html`**
- ✅ `styles.css`
- ✅ `script.js`
- ✅ `espeleo1_BN.png`
- ✅ `logoEspemo.png`
- ✅ `google_apps_script.js` (para referencia)
- ✅ `README.md`

### 3. Activar GitHub Pages

1. **Ir a Settings** del repositorio
2. **Scroll down** hasta "Pages"
3. **Source**: Deploy from a branch
4. **Branch**: main (o master)
5. **Folder**: / (root)
6. **Save**

🎉 **URL disponible**: `https://TU_USUARIO.github.io/cataleg-espemo-formulari`

### 4. Configurar Google Apps Script

#### A. Crear Proyecto en Google Apps Script

1. **Ir a**: [script.google.com](https://script.google.com)
2. **Nuevo proyecto**
3. **Copiar el código** de `google_apps_script.js`
4. **Configurar las constantes**:
   ```javascript
   const CONFIG = {
       SHEET_ID: 'TU_GOOGLE_SHEET_ID_AQUI',
       DRIVE_FOLDER_ID: 'TU_CARPETA_DRIVE_ID_AQUI'
   };
   ```

#### B. Configurar IDs de Google

**Para Google Sheet ID:**
1. Crear nuevo Google Sheet
2. Copiar ID de la URL: `https://docs.google.com/spreadsheets/d/ID_AQUI/edit`

**Para Google Drive Folder ID:**
1. Crear carpeta en Google Drive: "ESPEMO Cavitats"
2. Copiar ID de la URL: `https://drive.google.com/drive/folders/ID_AQUI`

#### C. Autorizar Permisos

1. **Ejecutar función** `crearCarpetasSiNoExisten()` una vez
2. **Autorizar permisos**:
   - Google Sheets API
   - Google Drive API

#### D. Desplegar como Web App

1. **Deploy** → **New deployment**
2. **Type**: Web app
3. **Execute as**: Me
4. **Who has access**: Anyone
5. **Deploy**
6. **Copiar la URL generada**

### 5. Actualizar Formulario con URL de Google Apps Script

En el archivo `script.js` (línea 638), reemplazar:

```javascript
// ANTES:
const GOOGLE_SCRIPT_URL = '1Z5ixyHCSknZm3d4OM4J77AsC6D0oj8rWc7q3pz-0QJmzVoMutiujMh57';

// DESPUÉS:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';
```

### 6. Commit y Push los Cambios

```bash
git add .
git commit -m "Configurar integración con Google Apps Script"
git push origin main
```

## 🌐 URLs Finales

- **Formulario**: `https://TU_USUARIO.github.io/cataleg-espemo-formulari`
- **Google Sheet**: `https://docs.google.com/spreadsheets/d/TU_SHEET_ID`
- **Google Drive**: `https://drive.google.com/drive/folders/TU_FOLDER_ID`

## 🎯 Dominio Personalizado (Opcional)

Para usar un dominio como `cataleg.espemo.org`:

1. **En GitHub Pages Settings**:
   - Custom domain: `cataleg.espemo.org`
   - ✅ Enforce HTTPS

2. **En tu proveedor de DNS**:
   - CNAME record: `cataleg` → `TU_USUARIO.github.io`

## 🔄 Workflow de Desarrollo

1. **Hacer cambios** en local
2. **Commit** y **push** a GitHub
3. **GitHub Pages** se actualiza automáticamente
4. **Google Apps Script** funciona inmediatamente

## 🛠️ Comandos Git Útiles

```bash
# Ver estado
git status

# Añadir cambios
git add .

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios
git push origin main

# Ver historial
git log --oneline
```

## 📱 Resultado Final

✅ **Formulario público** accesible desde cualquier dispositivo  
✅ **Datos automáticos** a Google Sheets  
✅ **Archivos automáticos** a Google Drive  
✅ **Control de versiones** con Git  
✅ **HTTPS** automático  
✅ **Responsive** para móviles  
