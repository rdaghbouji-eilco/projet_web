let apiPaths = {}; // Global variable to store the API paths
let offerId = null;

async function loadApiPaths() {
    try {
        console.log('Loading API paths...'); // Add log to confirm the function is called

        const response = await fetch('../../config/api_paths.json'); // Adjust the path if necessary
        if (!response.ok) {
            throw new Error(`Failed to load API paths: ${response.statusText}`);
        }
        apiPaths = await response.json(); // Store the API paths for later use

        console.log('API paths loaded successfully:', apiPaths); // Log success and loaded paths
    } catch (error) {
        console.error('Error loading API paths:', error); // Log any error encountered
    }
}
const baseUrl = 'http://localhost';

async function getOffersByStatus() {
    try {
        const apiUrl = apiPaths.get_offers_by_status; // Utilise une API spécifique si nécessaire
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch offers: ${response.statusText}`);
        }
        const offersByStatus = await response.json();

        return offersByStatus; // Retourne directement les résultats du backend
    } catch (error) {
        console.error('Error fetching offers by status:', error);
        return [];
    }
}

async function getOffersEvolution() {
    try {

        const apiUrl = apiPaths.get_offers;
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch offers: ${response.statusText}`);
        }
        const offers = await response.json();

        // Grouper les offres par mois
        const offersByMonth = {};
        offers.forEach((offer) => {
            const date = new Date(offer.publish_date); // Vérifie que "created_at" correspond à la clé correcte
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (offersByMonth[month]) {
                offersByMonth[month]++;
            } else {
                offersByMonth[month] = 1;
            }
        });

        return offersByMonth;
    } catch (error) {
        console.error('Error fetching offers evolution:', error);
        return {};
    }
}

async function updateStatusPieChart(chart) {
    const offersByStatus = await getOffersByStatus();

    const labels = offersByStatus.map(item => item.status_name);
    const data = offersByStatus.map(item => item.offer_count);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}


async function updateEvolutionLineChart(chart) {
    const offersByMonth = await getOffersEvolution();

    const labels = Object.keys(offersByMonth).sort(); // Trier par ordre chronologique
    const data = Object.values(offersByMonth);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

async function initializeCharts() {
    await loadApiPaths(); // Charger les chemins d'API dynamiquement

    // Initialisation des graphiques
    const statusPieCtx = document.getElementById('statusPieChart').getContext('2d');
    const statusPieChart = new Chart(statusPieCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            }]
        }
    });

    const evolutionLineCtx = document.getElementById('evolutionLineChart').getContext('2d');
    const evolutionLineChart = new Chart(evolutionLineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Offres',
                data: [],
                borderColor: '#36A2EB',
                fill: false,
            }]
        }
    });

    // Mettre à jour les graphiques avec les données API
    updateStatusPieChart(statusPieChart);
    updateEvolutionLineChart(evolutionLineChart);
}

// Appelle la fonction principale
initializeCharts();


