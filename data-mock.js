// DATOS MOCK PARA DASHBOARD - ESPEMO
// Datos de ejemplo para pruebas locales

const MOCK_DATA = {
    cavitats: [
        {
            codiId: 'MOR-001',
            nom: 'Cova dels Àngels',
            alies: 'Angels Cave',
            municipi: 'Morella',
            latitud: 40.6231,
            longitud: 0.1023,
            altitud: 1247,
            genesis: 'Kàrstica',
            interes: ['Geològic', 'Hidrològic'],
            descripcio: 'Cavitat de gran bellesa amb formacions calcàries espectaculars. Presenta una galeria principal de més de 200 metres amb diverses salas laterals.',
            recorreguReal: 245,
            profunditat: 45,
            totalPozos: 3,
            totalSalas: 5,
            totalFotos: 12,
            totalTopos: 2,
            timestamp: '2025-01-15 10:30:00'
        },
        {
            codiId: 'VLF-002',
            nom: 'Avenc de la Font',
            alies: '',
            municipi: 'Vilafranca',
            latitud: 40.4312,
            longitud: 0.0856,
            altitud: 892,
            genesis: 'Kàrstica',
            interes: ['Espeleològic', 'Biològic'],
            descripcio: 'Avenc vertical de 78 metres de profunditat amb interessants formacions de concrecions. Habitat de quiròpters.',
            recorreguReal: 78,
            profunditat: 78,
            totalPozos: 1,
            totalSalas: 2,
            totalFotos: 8,
            totalTopos: 1,
            timestamp: '2025-01-20 14:15:00'
        },
        {
            codiId: 'FOR-003',
            nom: 'Gruta de Sant Pere',
            alies: 'Cueva San Pedro',
            municipi: 'Forcall',
            latitud: 40.5678,
            longitud: 0.1245,
            altitud: 1156,
            genesis: 'Kàrstica',
            interes: ['Arqueològic', 'Històric'],
            descripcio: 'Gruta amb evidències arqueològiques del període ibèric. Presenta pintures rupestres i restes ceràmiques.',
            recorreguReal: 156,
            profunditat: 23,
            totalPozos: 0,
            totalSalas: 3,
            totalFotos: 15,
            totalTopos: 3,
            timestamp: '2025-01-25 09:45:00'
        },
        {
            codiId: 'CDC-004',
            nom: 'Sima del Castell',
            alies: '',
            municipi: 'Castell de Cabres',
            latitud: 40.3456,
            longitud: 0.0987,
            altitud: 1378,
            genesis: 'Tectònica',
            interes: ['Geològic'],
            descripcio: 'Sima tectònica de desenvolupament vertical amb interessants estructures geològiques. Cavitat encara en exploració.',
            recorreguReal: 89,
            profunditat: 67,
            totalPozos: 2,
            totalSalas: 1,
            totalFotos: 6,
            totalTopos: 1,
            timestamp: '2025-02-01 16:20:00'
        },
        {
            codiId: 'CAF-005',
            nom: 'Cova del Racó',
            alies: 'Cueva del Rincón',
            municipi: 'Castellfort',
            latitud: 40.2987,
            longitud: 0.1567,
            altitud: 945,
            genesis: 'Erosiva',
            interes: ['Hidrològic', 'Espeleològic'],
            descripcio: 'Cavitat erosiva amb circulació hídrica activa. Presenta un riu subterrani intermitent que connecta amb el sistema del barranc.',
            recorreguReal: 312,
            profunditat: 34,
            totalPozos: 1,
            totalSalas: 7,
            totalFotos: 20,
            totalTopos: 4,
            timestamp: '2025-02-10 11:30:00'
        },
        {
            codiId: 'CNT-006',
            nom: 'Avenc de les Bruixes',
            alies: '',
            municipi: 'Cinctorres',
            latitud: 40.4567,
            longitud: 0.0765,
            altitud: 1234,
            genesis: 'Kàrstica',
            interes: ['Folklòric', 'Espeleològic'],
            descripcio: 'Avenc de llegenda popular amb profunditat considerable. Presenta formacions singulars i acústica especial.',
            recorreguReal: 145,
            profunditat: 89,
            totalPozos: 4,
            totalSalas: 2,
            totalFotos: 9,
            totalTopos: 2,
            timestamp: '2025-02-15 13:45:00'
        },
        {
            codiId: 'HER-007',
            nom: 'Cova de la Llum',
            alies: 'Cueva de la Luz',
            municipi: 'Herbers',
            latitud: 40.3789,
            longitud: 0.1123,
            altitud: 1089,
            genesis: 'Kàrstica',
            interes: ['Geològic', 'Turístic'],
            descripcio: 'Cavitat amb entrada natural que permet el pas de llum solar creant efectes espectaculars a determinades hores del dia.',
            recorreguReal: 198,
            profunditat: 12,
            totalPozos: 0,
            totalSalas: 4,
            totalFotos: 25,
            totalTopos: 2,
            timestamp: '2025-02-20 15:10:00'
        },
        {
            codiId: 'PAL-008',
            nom: 'Sima del Mas Nou',
            alies: '',
            municipi: 'Palanques',
            latitud: 40.2345,
            longitud: 0.0654,
            altitud: 897,
            genesis: 'Volcànica',
            interes: ['Vulcanològic', 'Geològic'],
            descripcio: 'Formació volcànica singular en la zona. Presenta estructures de lava solidificada i minerals característics del vulcanisme local.',
            recorreguReal: 67,
            profunditat: 45,
            totalPozos: 1,
            totalSalas: 2,
            totalFotos: 11,
            totalTopos: 1,
            timestamp: '2025-02-25 10:20:00'
        }
    ],

    // Estadísticas calculadas
    getStats: function() {
        const municipis = [...new Set(this.cavitats.map(c => c.municipi))];
        const totalFotos = this.cavitats.reduce((sum, c) => sum + c.totalFotos, 0);
        const totalTopos = this.cavitats.reduce((sum, c) => sum + c.totalTopos, 0);
        const totalPozos = this.cavitats.reduce((sum, c) => sum + c.totalPozos, 0);
        const totalSalas = this.cavitats.reduce((sum, c) => sum + c.totalSalas, 0);

        return {
            totalCavitats: this.cavitats.length,
            totalMunicipis: municipis.length,
            totalFotos: totalFotos,
            totalTopos: totalTopos,
            totalPozos: totalPozos,
            totalSalas: totalSalas,
            municipis: municipis.sort(),
            lastUpdate: new Date().toLocaleString('ca-ES')
        };
    },

    // Filtrar cavidades
    filterCavitats: function(filters) {
        return this.cavitats.filter(cavitat => {
            // Filtro por municipio
            if (filters.municipi && cavitat.municipi !== filters.municipi) {
                return false;
            }

            // Filtro por génesis
            if (filters.genesis && cavitat.genesis !== filters.genesis) {
                return false;
            }

            // Filtro por búsqueda de texto
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const searchFields = [
                    cavitat.codiId,
                    cavitat.nom,
                    cavitat.alies,
                    cavitat.municipi,
                    cavitat.descripcio
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(searchLower)) {
                    return false;
                }
            }

            return true;
        });
    },

    // Obtener cavidad por ID
    getCavitatById: function(id) {
        return this.cavitats.find(c => c.codiId === id);
    },

    // Obtener lista de municipios únicos
    getMunicipis: function() {
        const municipis = [...new Set(this.cavitats.map(c => c.municipi))];
        return municipis.sort();
    },

    // Obtener lista de tipos de génesis únicos
    getGenesisTypes: function() {
        const types = [...new Set(this.cavitats.map(c => c.genesis))];
        return types.sort();
    }
};

// Datos adicionales
const MUNICIPIS_ESPEMO = [
    "Ares del Maestrat", "Castell de Cabres", "Castellfort", "Cinctorres", 
    "Forcall", "Herbers", "La Mata", "Morella", "Olocau del Rey", 
    "Palanques", "La Pobla de Benifassà", "Portell", "Sorita", 
    "Todolella", "Tronchon", "Vallibona", "Vilafranca", "Villores"
];

const GENESIS_TYPES = [
    "Kàrstica", "Volcànica", "Tectònica", "Erosiva"
];

const INTERES_TYPES = [
    "Geològic", "Hidrològic", "Espeleològic", "Biològic", 
    "Arqueològic", "Històric", "Folklòric", "Turístic", "Vulcanològic"
];

// ====== FUNCIÓN PARA OBTENER DATOS DETALLADOS PARA EDICIÓN ======
function getCavitatDetailedData(cavitatId) {
    // Mapa de datos detallados para edición (simulando backend completo)
    const detailedData = {
        'MOR-001': {
            codi_id: 'MOR-001',
            nom: 'Cova dels Àngels',
            alies: 'Angels Cave',
            municipi: 'Morella',
            genesis: 'B1.1- Sumider.fósiles CON rec.horizontal',
            interes: ['I.científico (1): Fauna invertebrada', 'I.deportivo: Recorrido subterráneo importante.', 'I.lúdico: Interés fotográfico y/o estético.'],
            descripcio: 'Cavitat de gran bellesa amb formacions calcàries espectaculars. Presenta una galeria principal de més de 200 metres amb diverses salas laterals. L\'accés es realitza per un pou inicial de 15 metres.',
            zona_utm: '30T',
            datum: 'ETRS89',
            precisio: '±10',
            est_x: 745234,
            nort_y: 4532678,
            z: 1247,
            latitud: 40.6231,
            longitud: 0.1023,
            latitud_gms: '40°37\'23.2\'\'N',
            longitud_gms: '0°06\'08.3\'\'E',
            recorregut_real: 245.5,
            recorregut_planta: 198.2,
            profunditat: 45.8,
            topos_comentari: 'Topografia realitzada amb estació total Leica TS02. Precisió: ±5cm.',
            fotos_comentari: 'Col·lecció de 12 fotografies de les formacions principals i galeries.',
            biblio_article: 'Les coves de Morella: estudi espeleològic',
            biblio_autor: 'Joan Pérez López',
            biblio_llibre: 'Espeleologia del Maestrat',
            biblio_editorial: 'ESPEMO Edicions',
            biblio_isbn: '978-84-1234-567-8',
            biblio_data: '2023-05-15',
            biblio_tema: 'Espeleologia',
            biblio_tipus: 'Investigació científica',
            biblio_enllac: 'https://espemo.cat/publicacions/morella-caves'
        },
        'VLF-002': {
            codi_id: 'VLF-002',
            nom: 'Avenc de la Font',
            alies: '',
            municipi: 'Vilafranca',
            genesis: 'A1.- Cavidades en fracturas tectónicas',
            interes: ['I.deportivo: Descensos verticales notables.', 'I.científico (3): Característ. geológicas /hidrológicas especiales'],
            descripcio: 'Avenc vertical de desenvolupament considerable amb diversos ressalts. Presenta circulació d\'aigua en èpoques de pluja.',
            zona_utm: '30T',
            datum: 'ETRS89',
            precisio: '±25',
            est_x: 743150,
            nort_y: 4529840,
            z: 1156,
            latitud: 40.4312,
            longitud: 0.0891,
            recorregut_real: 89.3,
            recorregut_planta: 12.8,
            profunditat: 78.5,
            topos_comentari: 'Topografia amb clisímetre i metre. Revisió pendent.',
            fotos_comentari: 'Fotografies dels ressalts principals.',
            biblio_autor: 'Maria Garcia',
            biblio_data: '2022-08-20',
            biblio_tema: 'Avenes'
        },
        'PAL-003': {
            codi_id: 'PAL-003',
            nom: 'Cova de les Bruixes',
            alies: 'Witches Cave',
            municipi: 'Palanques',
            genesis: 'B2.- Surgencias fósiles',
            interes: ['I.científico (2): Historias y leyendas populares.', 'I.lúdico: Cavidad con uso diverso en la actualidad (religioso, turismo)'],
            descripcio: 'Cavitat amb important valor folklòric. Segons la tradició local, era refugi durant conflictes històrics.',
            zona_utm: '30T',
            datum: 'ETRS89',
            precisio: '±10',
            est_x: 744890,
            nort_y: 4531200,
            z: 1089,
            latitud: 40.5123,
            longitud: 0.0734,
            recorregut_real: 156.7,
            recorregut_planta: 142.3,
            profunditat: 28.2,
            biblio_tema: 'Folklore',
            biblio_tipus: 'Tradició oral'
        }
    };
    
    return detailedData[cavitatId] || null;
}

// Función para simular delay de red
function simulateNetworkDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
