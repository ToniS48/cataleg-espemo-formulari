# Formulari d'Inscripció de Cavitats - ESPEMO

🌐 **Demo en vivo**: [https://TU_USUARIO.github.io/cataleg-espemo-formulari](https://TU_USUARIO.github.io/cataleg-espemo-formulari)

Aquest formulari HTML permet la inscripció de cavitats al Catàleg ESPEMO amb integració completa a Google Drive i Google Sheets.

## 🚀 Característiques Principals

- ✅ **Formulari responsive** per a ordinadors i mòbils
- ✅ **Integració Google Drive** per a emmagatzematge d'arxius
- ✅ **Google Sheets** com a base de dades
- ✅ **Despliegue automàtic** amb GitHub Pages
- ✅ **Control de versions** amb Git

## 🏗️ Configuració i Despliegue

### **Opció Recomanada: GitHub Pages + Google Apps Script**

📖 **Guia completa**: Consulta [`DEPLOY_GITHUB.md`](DEPLOY_GITHUB.md) per a instruccions pas a pas.

**Resum ràpid:**
1. Crear repositori a GitHub
2. Configurar Google Apps Script
3. Activar GitHub Pages
4. Actualitzar URL a `script.js`

### **Altres Opcions de Despliegue**

- **Local**: Obre `index.html` directament
- **Netlify**: Arrossega la carpeta a netlify.com  
- **Servidor propi**: Apache/Nginx

## 📁 Estructura del Proyecto

El proyecto està organitzat amb separació de concerns per facilitar el manteniment:

### Arxius Principals
- **`formulario_cavitats.html`** - Estructura HTML del formulario
- **`styles.css`** - Estilos CSS separados para mejor organización  
- **`script.js`** - Funcionalidad JavaScript modularizada
- **`README.md`** - Documentació del proyecto

### Scripts de Generació
- **`analizar_excel.py`** - Script para analizar la estructura del Excel
- **`generar_formulario_final.py`** - Generador del formulario HTML

### Integració i Dades
- **`google_apps_script.js`** - Script para integració amb Google Sheets
- **`Catàleg ESPEMO.xlsx`** - Base de datos original de cavidades

### Beneficis de la Separació
- **Mantenibilitat**: CSS i JavaScript en arxius separats
- **Reutilització**: Els estilos i scripts es poden reutilitzar fàcilment
- **Depuració**: Més fàcil identificar i corregir errors
- **Colaboració**: Diferents desenvolupadors poden treballar en diferents aspectes

## ✨ Funcionalitats del Formulari

### 🔧 Funcionalitats Automàtiques
- **Generació automàtica del Codi ID**: Quan selecciones o escrius un municipi, el codi ID es genera automàticament amb el format `CODI_MUNICIPI-XXX`
- **Municipis nous**: Pots escriure municipis que no estiguin en la llista predefinida. El sistema generarà automàticament un codi basat en el nom del municipi
- **Combobox intel·ligent**: El camp de municipi funciona com un combobox que permet:
  - Seleccionar de la llista predefinida
  - Filtrar mentre escrius
  - Escriure municipis nous
  - Navegació amb tecles de fletxa
- **Conversió automàtica de coordenades**: Els camps de coordenades geogràfiques es converteixen automàticament entre format decimal i GMS (Graus, Minuts, Segons)
- **Càlcul automàtic de superfície i volum**: En la secció de sales, els camps de superfície i volum es calculen automàticament quan introdueixes llargària, amplària i altura
- **Validació de camps**: Els camps obligatoris (Codi ID, Nom, Municipi) estan marcats i es validen abans d'enviar el formulari

### 🗂️ Organització en Pestanyes
1. **Dades Generals**: Identificació i classificació de la cavitat
2. **Localització**: Coordenades UTM i geogràfiques
3. **Mesures**: Dimensions de la cavitat, pous i sales
4. **Altres Dades**: Documentació, fotografies i bibliografia

### 🏗️ Gestió Dinàmica de Mesures

#### Pous Múltiples
- **Afegir pous**: Fes clic a "+ Afegir Pou" per crear nous pous
- **Dades per pou**: Nom, profunditat, amplada i observacions
- **Eliminar pous**: Botó "×" per eliminar pous específics

#### Sales Múltiples  
- **Afegir sales**: Fes clic a "+ Afegir Sala" per crear noves sales
- **Dades per sala**: Nom, descripció, dimensions (llargària, amplària, altura)
- **Càlcul automàtic**: Superfície i volum es calculen automàticament
- **Eliminar sales**: Botó "×" per eliminar sales específiques

#### Funcionalitats Avançades
- **Numeració automàtica**: Cada pou i sala es numera automàticament
- **Validació individual**: Cada element es pot omplir de forma independent
- **Persistència**: Els elements dinàmics es guarden en l'esborrany
- **Inicialització**: S'afegeix un pou i una sala per defecte
- **Esborrany local**: Pots guardar un esborrany que es recupera automàticament al tornar a obrir el formulari
- **Exportació JSON**: Quan guardes una cavitat, s'obre una nova finestra amb les dades en format JSON per copiar
- **Neteja del formulari**: Botó per netejar tots els camps

### � Gestió d'Arxius i Google Drive

#### Subida Directa d'Arxius
- **Topografies**: Suport per PDF, SVG, PNG, JPG, DWG, DXF
- **Fotografies**: Suport per JPG, PNG, GIF, BMP, WebP
- **Múltiples arxius**: Pots seleccionar diversos arxius alhora
- **Vista prèvia**: Mostra nom i mida dels arxius seleccionats
- **Gestió individual**: Elimina arxius específics abans d'enviar

#### Integració amb Google Drive
- **Organització automàtica**: Els arxius es guarden en carpetes per cavitat
- **Estructura jeràrquica**: 
  ```
  📁 Carpeta Raíz
  ├── 📁 Fotos_Cavitats/
  │   └── 📁 ARM-001/
  └── 📁 Topografies_Cavitats/
      └── 📁 ARM-001/
  ```
- **Enllaços automàtics**: Es generen URLs d'accés directe
- **Permisos configurats**: Arxius visibles amb enllaç

#### Emmagatzematge de Dades
- **Google Sheets**: Estructura de dades organitzada
- **Fulles especialitzades**: Dades principals, Pous, Sales, Fotos, Topografies, Bibliografia
- **Metadades completes**: Inclou dates de creació i informació de geo-localització
- **Referències creuades**: Enllaços entre dades i arxius

### 💾 Gestió de Dades Locals
- **Esborrany local**: Pots guardar un esborrany que es recupera automàticament al tornar a obrir el formulari
- **Neteja del formulari**: Botó per netejar tots els camps (inclosos els elements dinàmics i arxius)
- **Persistència dinàmica**: Els pous i sales afegits es mantenen en l'esborrany
- **Fallback JSON**: Si falla la connexió, mostra les dades en format JSON per còpia manual

## 🚀 Configuració de Google Apps Script

Per activar la integració completa amb Google Drive i Sheets:

1. **Crear projecte a Google Apps Script**:
   - Ves a [script.google.com](https://script.google.com)
   - Crear nou projecte
   - Copia el codi de `google_apps_script.js`

2. **Configurar IDs**:
   - Reemplaça `TU_GOOGLE_SHEET_ID_AQUI` amb l'ID del teu Google Sheet
   - Reemplaça `TU_CARPETA_DRIVE_ID_AQUI` amb l'ID de la carpeta a Drive

3. **Autoritzar permisos**:
   - Google Sheets (lectura/escriptura)
   - Google Drive (creació d'arxius i carpetes)

4. **Desplegar com a aplicació web**:
   - Configurar accés: "Anyone"
   - Copiar URL generada

5. **Actualitzar formulari**:
   - Reemplaça `TU_URL_GOOGLE_APPS_SCRIPT_AQUI` a `script.js`

## 🌐 Opcions de Despliegue

### 1. **Despliegue Local (Fàcil)**
Per utilitzar el formulari localment en el teu ordinador:

1. **Descàrrega tots els arxius** a una carpeta del teu ordinador
2. **Obre `formulario_cavitats.html`** directament amb qualsevol navegador web
3. **Funcionalitat offline**: El formulari funciona sense internet (sense Google Drive)
4. **Dades en JSON**: Les dades es mostren en format JSON per còpia manual

```bash
# Estructura mínima requerida:
📁 CatalegESPEMO/
├── formulario_cavitats.html
├── styles.css
├── script.js
├── espeleo1_BN.png
└── logoEspemo.png
```

### 2. **Servidor Web Simple (Recomanat)**
Per compartir el formulari amb altres usuaris:

#### Amb Python (si el tens instal·lat):
```bash
# Navega a la carpeta del formulari
cd "d:\Documentos\Espemo\Apps\CatalegESPEMO"

# Inicia servidor web local
python -m http.server 8000

# Accedeix a: http://localhost:8000
```

#### Amb Node.js (si el tens instal·lat):
```bash
# Instal·la servidor estàtic global
npm install -g http-server

# Navega a la carpeta
cd "d:\Documentos\Espemo\Apps\CatalegESPEMO"

# Inicia servidor
http-server -p 8000

# Accedeix a: http://localhost:8000
```

### 3. **Hosting Gratuït Online**

#### **GitHub Pages** (Recomanat per projets públics):
1. Crea un repositori a [GitHub](https://github.com)
2. Puja tots els arxius del formulari
3. Activa GitHub Pages a la configuració del repositori
4. URL automàtica: `https://usuari.github.io/nom-repositori`

#### **Netlify** (Més fàcil):
1. Ves a [netlify.com](https://netlify.com)
2. Arrossega la carpeta del formulari a la pàgina
3. URL automàtica generada instantàniament
4. **Domini personalitzat** disponible (ex: `cataleg-espemo.netlify.app`)

#### **Vercel**:
1. Ves a [vercel.com](https://vercel.com)
2. Connecta amb GitHub o puja arxius directament
3. Despliegue automàtic amb cada canvi

### 4. **Servidor Web Professional**

#### **XAMPP/WAMP** (Windows):
1. Instal·la [XAMPP](https://www.apachefriends.org) o [WAMP](https://www.wampserver.com)
2. Copia els arxius a `htdocs/cataleg-espemo/`
3. Accedeix a: `http://localhost/cataleg-espemo`

#### **Apache/Nginx** (Linux/Windows Server):
```bash
# Copia arxius al directori del servidor web
cp -r CatalegESPEMO/ /var/www/html/cataleg/

# Configurar permisos
chmod -R 755 /var/www/html/cataleg/
```

### 5. **Integració amb Google Drive**

Per activar la funcionalitat completa amb Google Drive:

1. **Completa la configuració de Google Apps Script** (secció anterior)
2. **Actualitza la URL a `script.js`**:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'LA_TEVA_URL_AQUI';
   ```
3. **Desplegament automàtic**: Les dades es guarden directament a Google Sheets
4. **Arxius a Google Drive**: Topografies i fotos es pugen automàticament

## 🔧 Configuració segons el Tipus de Despliegue

### Per a **Ús Local**:
- No cal configuració addicional
- Les dades es mostren en JSON per còpia manual
- Ideal per a proves i desenvolupament

### Per a **Ús Compartit**:
- Configura Google Apps Script per emmagatzematge automàtic
- Utilitza hosting web per accés múltiple
- Configura còpies de seguretat

### Per a **Ús Professional**:
- Servidor web dedicat amb domini propi
- Certificat SSL per connexions segures
- Monitorització i còpies de seguretat automàtiques

## 🚀 Recomanacions per Despliegue

### **Opció més Fàcil**: Netlify
1. Arrossega la carpeta a netlify.com
2. Configura Google Apps Script
3. Comparteix la URL generada

### **Opció més Completa**: GitHub Pages + Google Apps Script
1. Repositori GitHub amb control de versions
2. URL personalitzada amb domini propi
3. Integració completa amb Google Drive

### **Opció Corporativa**: Servidor propi
1. Control total sobre la infraestructura
2. Integració amb sistemes existents
3. Polítiques de seguretat personalitzades

## ⚡ Guia Ràpida de Despliegue

### **Per començar IMMEDIATAMENT** (1 minut):
```bash
# Obre el formulari directament des del teu ordinador
start formulario_cavitats.html
# o fes doble clic sobre l'arxiu
```

### **Per compartir amb el teu equip** (5 minuts):
1. Ves a [netlify.com](https://netlify.com)
2. Arrossega la carpeta `CatalegESPEMO` sencera
3. Copia la URL generada i comparteix-la
4. **Resultat**: Formulari accessible des de qualsevol lloc del món

### **Per integració completa amb Google Drive** (15 minuts):
1. Segueix els passos de "Configuració de Google Apps Script"
2. Actualitza la URL a `script.js` (línia 638)
3. Redesplegua el formulari
4. **Resultat**: Dades automàtiques a Google Sheets + arxius a Google Drive

## 📱 Compatibilitat

El formulari és completament **responsive** i funciona a:
- **Ordinadors**: Windows, Mac, Linux
- **Navegadors**: Chrome, Firefox, Safari, Edge
- **Dispositius mòbils**: Android, iOS
- **Tauletes**: iPad, Android tablets

## 🔐 Consideracions de Seguretat

### **Dades Sensibles**:
- El formulari funciona amb HTTPS quan es desplega online
- Les dades només s'envien a Google Drive si està configurat
- Sense configuració, les dades romanen locals

### **Accés Controlat**:
- Pots restringir l'accés amb autenticació de Google
- Configurar permisos específics per carpetes de Google Drive
- Utilitzar dominis privats per accés corporatiu
- **Permisos configurats**: Arxius visibles amb enllaç

#### Emmagatzematge de Dades
- **Google Sheets**: Estructura de dades organitzada
- **Fulles especialitzades**: Dades principals, Pous, Sales, Fotos, Topografies, Bibliografia
- **Metadades completes**: Inclou dates de creació i informació de geo-localització
- **Referències creuades**: Enllaços entre dades i arxius
- **Esborrany local**: Pots guardar un esborrany que es recupera automàticament al tornar a obrir el formulari
- **Exportació JSON**: Quan guardes una cavitat, s'obre una nova finestra amb les dades en format JSON per copiar
- **Neteja del formulari**: Botó per netejar tots els camps (inclosos els elements dinàmics)
- **Persistència dinàmica**: Els pous i sales afegits es mantenen en l'esborrany

## Metadades Extretes del Excel

### Municipis (17 municipis disponibles)
Els municipis s'han extret de la fulla "Metadata" i inclouen els seus codis corresponents per a la generació automàtica del Codi ID.

### Tipus d'Interès (38 opcions)
Catàleg de tipus d'interès per classificar les cavitats segons la seva importància i característiques.

### Tipus de Gènesi (16 opcions)
Classificació geològica de les cavitats segons el seu origen i formació.

## Estructura de Dades

El formulari recull les següents dades principales:

### Identificació
- Codi ID (generat automàticament)
- Nom de la cavitat
- Àlies
- Municipi
- Zona UTM

### Classificació
- Gènesi geològica
- Tipus d'interès
- Descripció detallada

### Localització
- Zona UTM (editable: 29T, 30T, 31T, 29S, 30S, 31S)
- Datum de referència (ETRS89, WGS84, ED50)
- Precisió de les coordenades
- Coordenades UTM (X, Y, Z)
- Coordenades geogràfiques (format decimal i GMS amb conversió automàtica)

### Mesures
- Recorregut real i en planta
- Profunditat
- Dimensions específiques per pous (amplada)
- Dimensions específiques per sales (llargària, amplària, altura, superfície, volum)

### Documentació
- Enllaços a topografies
- Enllaços a fotografies
- Dades bibliogràfiques completes

## Ús del Formulari

1. **Obre el fitxer `formulario_cavitats.html` en qualsevol navegador web**

2. **Omple les dades seguint aquest ordre recomanat:**
   - **Municipi**: Pots seleccionar de la llista o escriure un municipi nou
     - Per seleccionar: Fes clic i escull de la llista desplegable
     - Per filtrar: Comença a escriure i la llista es filtrarà automàticament
     - Per municipi nou: Simplement escriu el nom complet del municipi
   - Introdueix el nom de la cavitat
   - Continua amb les altres dades per pestanyes

3. **Funcionalitat de municipis nous:**
   - Si escrius un municipi que no està a la llista, el sistema generarà automàticament un codi
   - La generació de codi segueix aquestes regles:
     - 1 paraula: Primeres 3 lletres (ex: "Xàtiva" → "XAT")
     - 2 paraules: Inicial de cada + segona lletra de la primera (ex: "Vila-real" → "VIR")
     - 3+ paraules: Inicial de les tres primeres (ex: "Santa María del Mar" → "SMM")
   - Si el codi generat ja existeix, s'afegeix un número (ex: "XAT" → "XA1")

4. **Utilitza les funcions disponibles:**
   - **Guardar Esborrany**: Per guardar el treball en curs
   - **Netejar**: Per començar de nou
   - **Guardar Cavitat**: Per finalitzar i obtenir les dades en JSON

4. **Per integrar amb el sistema existent:**
   - Les dades es mostren en format JSON
   - Pots copiar aquestes dades per inserir-les en el sistema de base de dades
   - El format segueix l'estructura de les fulles del Excel original

## Fitxers Generats

- `formulario_cavitats.html`: El formulari principal
- `metadatos_extraidos.json`: Metadades extretes del Excel per referència
- `estructura_excel.json`: Estructura completa de totes les fulles del Excel

## Personalització

Si necessites modificar el formulari:

1. **Modifica els camps**: Edita el HTML directament
2. **Afegeix validacions**: Modifica les funcions JavaScript
3. **Canvia l'aparença**: Modifica els estils CSS
4. **Actualitza les opcions**: Torna a executar el script Python amb un Excel actualitzat

## Integració amb Bases de Dades

El formulari està preparat per integrar-se amb:
- Google Sheets (mitjançant Google Apps Script)
- Bases de dades SQL
- APIs REST
- Sistemes de gestió documental

El format JSON generat és compatible amb la majoria de sistemes de bases de dades moderns.

---

**Nota**: Aquest formulari ha sigut generat automàticament per simplificar la introducció de dades del Catàleg ESPEMO. Per qualsevol modificació o personalització, contacta amb l'administrador del sistema (tonisoler@espemo.org).
