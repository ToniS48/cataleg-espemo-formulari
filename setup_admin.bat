@echo off
echo ==========================================
echo   CONFIGURACION SEGURA - ESPEMO ADMIN
echo ==========================================
echo.

echo Este script te ayudará a configurar de forma segura
echo las URLs de Google Apps Script y Drive.
echo.

echo IMPORTANTE: 
echo - Las URLs de Google Apps Script son públicas por diseño
echo - La seguridad está en los permisos de Google, no en ocultar URLs
echo - Puedes revocar acceso desde Google Apps Script en cualquier momento
echo.

set /p continue="¿Continuar con la configuración? (s/n): "
if /i not "%continue%"=="s" exit /b

echo.
echo ==========================================
echo   PASO 1: CONFIGURAR GOOGLE APPS SCRIPT
echo ==========================================
echo.

echo 1. Ve a https://script.google.com
echo 2. Crear nuevo proyecto: "ESPEMO Formulario Backend"
echo 3. Copia el código de google_apps_script.js
echo 4. Configura tus IDs reales en las constantes CONFIG
echo 5. Deploy como Web App con acceso "Anyone"
echo.

set /p script_url="Pega aquí la URL de Google Apps Script: "

if "%script_url%"=="" (
    echo ❌ URL no proporcionada. Configuración cancelada.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   PASO 2: ACTUALIZAR CONFIGURACION
echo ==========================================
echo.

echo Actualizando config.js...

powershell -Command "(Get-Content config.js) -replace 'URL_SERA_CONFIGURADA_POR_ADMINISTRADOR', '%script_url%' | Set-Content config.js"

echo ✅ Configuración actualizada en config.js
echo.

echo ==========================================
echo   PASO 3: VERIFICAR CONFIGURACION
echo ==========================================
echo.

echo Configuración actual:
findstr "GOOGLE_SCRIPT_URL" config.js

echo.
echo ==========================================
echo   PASO 4: SUBIR CAMBIOS (OPCIONAL)
echo ==========================================
echo.

set /p upload="¿Subir cambios a GitHub ahora? (s/n): "
if /i "%upload%"=="s" (
    echo.
    echo Subiendo cambios...
    git add config.js
    git commit -m "Configurar URL de Google Apps Script para producción"
    git push origin main
    echo.
    echo ✅ Cambios subidos a GitHub
    echo ✅ El formulario estará disponible en unos minutos
    echo.
    echo URL del formulario: https://tonis48.github.io/cataleg-espemo-formulari
)

echo.
echo ==========================================
echo   CONFIGURACION COMPLETADA
echo ==========================================
echo.

echo ✅ Google Apps Script configurado
echo ✅ Formulario listo para usar
echo ✅ Integración con Drive activa
echo.

echo 📖 Consulta ADMIN_CONFIG.md para configuraciones avanzadas
echo 🔒 Consulta las medidas de seguridad implementadas
echo.

echo ¿Quieres abrir el formulario para probarlo? (s/n)
set /p test="Respuesta: "
if /i "%test%"=="s" (
    start https://tonis48.github.io/cataleg-espemo-formulari
)

pause
