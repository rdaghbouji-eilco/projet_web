import { loadApiPaths, fetchData, apiPaths } from '../js/api.js';
import { initializeOffersSection } from '../js/offres_dashboard.js';
import { createChart, updateChart } from '../js/charts.js';
import { initializeApplicationsSection } from '../js/candidatures_dashboard.js';


const baseUrl = 'http://localhost';

function showLoading(selector) {
    const element = document.querySelector(selector);
    element.innerHTML = '<div class="loading">Loading...</div>';
}

function hideLoading(selector) {
    const element = document.querySelector(selector);
    element.querySelector('.loading')?.remove();
}


async function updateOverviewBoxes() {
    try {
        // Récupérer les données des APIs
        const totalApplications = await getTotalCount('get_total_applications', 'total_applications');
        const totalOffers = await getTotalCount('get_total_offers', 'total_offers');
        const totalEntreprises = await getTotalCount('get_total_entreprises', 'total_entreprises');

        // Mettre à jour le compteur des candidatures
        document.querySelector('.overview-boxes .box:nth-child(1) .number').textContent = totalApplications;

        // Mettre à jour le compteur des offres
        document.querySelector('.overview-boxes .box:nth-child(2) .number').textContent = totalOffers;
        
        // Mettre à jour le compteur des entreprises
        document.querySelector('.overview-boxes .box:nth-child(3) .number').textContent = totalEntreprises;

    } catch (error) {
        console.error('Erreur lors de la mise à jour des compteurs :', error);
    }
}

async function getTotalCount(apiKey, key) {
    try {
        const data = await fetchData(apiKey);
        return data[key];
    } catch (error) {
        console.error(`Error fetching total count for ${key}:`, error);
        return 0;
    }
}

async function getOffersByStatus() {
    const offersByStatus = await fetchData('get_offers_by_status');
    return offersByStatus; // Retourne directement les résultats du backend
}

async function loadApplicationsByStatusChart(chart) {

    const statuses = await fetchData('get_applications_by_status');
    // Préparer les données pour le graphique
    const labels = statuses.map(status => status.status_name);
    const data = statuses.map(status => status.application_count);

    // Mettre à jour le graphique
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

async function getOffersEvolution() {

    const offers = await fetchData('get_offers');

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

}

async function getApplicationsEvolution() {

    const applications = await fetchData('get_applications');

    // Grouper les offres par mois
    const applicationsByMonth = {};
    applications.forEach((application) => {
        const date = new Date(application.application_date); // Vérifie que "created_at" correspond à la clé correcte
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (applicationsByMonth[month]) {
            applicationsByMonth[month]++;
        } else {
            applicationsByMonth[month] = 1;
        }
    });

    return applicationsByMonth;
}



async function updateApplicationsLineChart(chart) {
    const applicationsByMonth = await getApplicationsEvolution();
    const labels = Object.keys(applicationsByMonth).sort(); // Trier les mois
    const data = Object.values(applicationsByMonth);

    updateChart(chart, labels, data);
}

async function updateStatusPieChart(chart) {
    const offersByStatus = await getOffersByStatus();

    const labels = offersByStatus.map(item => item.status_name);
    const data = offersByStatus.map(item => item.offer_count);

    updateChart(chart, labels, data);
}

async function updateEvolutionLineChart(chart) {
    const offersByMonth = await getOffersEvolution();

    const labels = Object.keys(offersByMonth).sort(); // Trier par ordre chronologique
    const data = Object.values(offersByMonth);

    updateChart(chart, labels, data);
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
                backgroundColor: ['#36A2EB', '#F69B00', '#FFCE56'],
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true, // Activer l'affichage du titre
                    text: 'Offres par Statut', // Le titre à afficher
                    font: {
                        size: 15, // Taille de la police
                        weight : '500',
                        family :'Poppins'
                    },
                    color : '#333',
                    padding: {
                        top: 5, // Espacement au-dessus du titre
                        bottom: 5 // Espacement en-dessous du titre
                    }
                },
                legend: {
                    display: true, // Affiche ou masque la légende
                    labels: {
                        font: {
                            size: 12, // Taille de la police
                            family :'Poppins'
                        },
                        color: '#333' // Couleur du texte
                    }
                }
            }
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
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Couleur de remplissage (optionnel)
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true, // Affiche ou masque la légende
                    labels: {
                        font: {
                            size: 12, // Taille de la police
                            family :'Poppins'
                        },
                        color: '#333' // Couleur du texte
                    }
                }
            },
            
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Mois', // Nom de l'axe X
                        font: {
                            size: 10, // Taille de la police
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    ticks: {
                        font: {
                            size: 11, // Taille des étiquettes
                            weight: 'normal',
                            family :'Poppins'
                        },
                        color: '#555', // Couleur des étiquettes
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)', // Couleur des lignes de grille
                        lineWidth: 1 // Épaisseur des lignes
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Candidatures', // Nom de l'axe Y
                        font: {
                            size: 10,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'normal'
                        },
                        color: '#555'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)',
                        lineWidth: 1
                    }
                }
            }
            
            
        }

    });

    // Initialisation du graphique des candidatures
    const applicationsLineCtx = document.getElementById('applicationsLineChart').getContext('2d');
    const applicationsLineChart = new Chart(applicationsLineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Candidatures',
                data: [],
                borderColor: '#F69B00',
                backgroundColor: '#ffdfa7', // Couleur de remplissage (optionnel)
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true, // Affiche ou masque la légende
                    labels: {
                        font: {
                            size: 12, // Taille de la police
                            family :'Poppins'
                        },
                        color: '#333' // Couleur du texte
                    }
                }
            }
        }
    });

    // Initialisation du graphique des candidatures par statut
    const applicationsStatusCtx = document.getElementById('applicationsStatusChart').getContext('2d');
    const applicationsStatusChart = new Chart(applicationsStatusCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Répartition des Statuts',
                data: [],
                backgroundColor: ['#2bd47d','#36A2EB', '#F69B00', '#4BC0C0', '#9966FF'],
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true, // Activer l'affichage du titre
                    text: 'Candidatures par Statut', // Le titre à afficher
                    font: {
                        size: 15, // Taille de la police
                        weight : '500',
                        family :'Poppins'
                    },
                    color : '#333',
                    padding: {
                        top: 5, // Espacement au-dessus du titre
                        bottom: 5 // Espacement en-dessous du titre
                    }
                },
                legend: {
                    display: true, // Affiche ou masque la légende
                    labels: {
                        font: {
                            size: 11, // Taille de la police
                            family :'Poppins'
                        },
                        color: '#333' // Couleur du texte
                    }
                }
            }
        }
    });

    // Mettre à jour les graphiques avec les données API
    updateStatusPieChart(statusPieChart);
    updateEvolutionLineChart(evolutionLineChart);
    updateApplicationsLineChart(applicationsLineChart);
    loadApplicationsByStatusChart(applicationsStatusChart);
}

async function loadRecentApplications() {
    try {
        const recentApplications = await fetchData('get_recent_applications');
        const applications = recentApplications.recent_applications; // Récupérer les candidatures récentes

        // Mettre à jour le tableau "Candidatures récentes"
        const applicationsDetails = document.querySelector('.candidatures_recentes .actions_details');
        applicationsDetails.innerHTML = `
            <ul class="details">
                <li class="topic">Candidat</li>
                ${applications.map(app => `<li>${app.applicant_name} ${app.applicant_surname}</li>`).join('')}
            </ul>
            <ul class="details">
                <li class="topic">Offre</li>
                ${applications.map(app => `<li>${app.position_name}</li>`).join('')}
            </ul>
            <ul class="details">
                <li class="topic">Date</li>
                ${applications.map(app => `<li>${new Date(app.application_date).toLocaleDateString()}</li>`).join('')}
            </ul>
            <ul class="details">
                <li class="topic">Statut</li>
                ${applications.map(app => `<li>${app.application_status || 'Non spécifié'}</li>`).join('')}
            </ul>`;
    } catch (error) {
        console.error('Erreur lors du chargement des candidatures récentes :', error);
    }
}



async function loadRecentOffers() {
    
    const offersDetails = document.querySelector('.offres_recentes .actions_details');
    showLoading('.offres_recentes .actions_details');
    try {
        const recentOffers = await fetchData('get_recent_offers');
        const offers = recentOffers.recent_offers || []; // Default to empty array if null

        if (offers.length === 0) {
            offersDetails.innerHTML = '<p>No recent offers available.</p>';
        } else {
            offersDetails.innerHTML = `
                <ul class="details">
                    <li class="topic">Date</li>
                    ${offers.map(offer => `<li>${new Date(offer.publish_date).toLocaleDateString()}</li>`).join('')}
                </ul>
                <ul class="details">
                    <li class="topic">Titre</li>
                    ${offers.map(offer => `<li>${offer.position_name}</li>`).join('')}
                </ul>
                <ul class="details">
                    <li class="topic">Entreprise</li>
                    ${offers.map(offer => `<li>${offer.entreprise_name || 'Non spécifiée'}</li>`).join('')}
                </ul>`;
        }
    } catch (error) {
        console.error('Error loading recent offers:', error);
    }
}



// Initialize the dashboard
async function initializeDashboard() {
    try {
        await loadApiPaths(); // Load API paths
        await updateOverviewBoxes(); // Update overview boxes
        await initializeOffersSection(); // Initialize the offers section
        await initializeCharts(); // Initialize charts
        await loadRecentOffers(); // Load recent offers
        await loadRecentApplications(); // Charger les candidatures récentes
        showSection('homeSection'); // Default to the home section

        // Populate dropdowns
        //await populateDropdown('get_fields', 'fieldDropdown', 'field_name', 'Select a field');
        //await populateDropdown('get_locations', 'locationDropdown', 'location_name', 'Select a location');

    } catch (error) {
        console.error('Error initializing the dashboard:', error);
    }
}

// Function to show the selected section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else {
        console.error(`Section with ID "${sectionId}" not found.`);
    }
}

function showApplicationsSection() {
    showSection('applicationsSection'); // Afficher la section des candidatures
    initializeApplicationsSection();    // Initialiser les données de la section
}



// Expose showSection globally
window.showSection = showSection;

// Run dashboard initialization
initializeDashboard();

window.showApplicationsSection = showApplicationsSection;

