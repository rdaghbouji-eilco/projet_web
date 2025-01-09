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

async function getTotalApplications() {
    try {
        const apiUrl = apiPaths.get_total_applications; // API pour les candidatures
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des candidatures : ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Total applications:', result);

        if (result.status !== 'success') {
            throw new Error('Erreur dans la réponse de get_total_applications.');
        }

        return result.total_applications; // Retourne le nombre total de candidatures
    } catch (error) {
        console.error('Erreur lors du chargement des candidatures :', error);
        return 0;
    }
}

async function getTotalOffers() {
    try {
        const apiUrl = apiPaths.get_total_offers; // API pour les offres publiées
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des offres : ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Total offers:', result);

        if (result.status !== 'success') {
            throw new Error('Erreur dans la réponse de get_total_offers.');
        }

        return result.total_offers; // Retourne le nombre total d’offres
    } catch (error) {
        console.error('Erreur lors du chargement des offres :', error);
        return 0;
    }
}

async function getTotalEntreprises() {
    try {
        const apiUrl = apiPaths.get_entreprises; // API pour les offres publiées
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des offres : ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Total Entreprises:', result);

        if (result.status !== 'success') {
            throw new Error('Erreur dans la réponse de get_entreprises.');
        }

        return result.total_entreprises; // Retourne le nombre total d’offres
    } catch (error) {
        console.error('Erreur lors du chargement des offres :', error);
        return 0;
    }
}


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
async function loadApplicationsByStatusChart(chart) {
    try {
        const apiUrl = apiPaths.get_applications_by_status; // Endpoint pour la répartition des statuts
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des statuts des candidatures : ${response.statusText}`);
        }

        const statuses = await response.json(); // Obtenir les données JSON
        console.log('Response from get_applications_by_status:', statuses);

        if (!Array.isArray(statuses)) {
            throw new Error('La réponse de get_applications_by_status est incorrecte ou vide.');
        }

        // Préparer les données pour le graphique
        const labels = statuses.map(status => status.status_name);
        const data = statuses.map(status => status.application_count);

        // Mettre à jour le graphique
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    } catch (error) {
        console.error('Erreur lors du chargement des données pour le diagramme des statuts :', error);
    }
}


async function loadRecentOffers() {
    try {
        const apiUrl = apiPaths.get_recent_offers; // Endpoint pour les offres récentes
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des offres récentes : ${response.statusText}`);
        }

        const result = await response.json(); // Obtenir les données JSON
        console.log('Response from get_recent_offers:', result);

        if (result.status !== 'success' || !Array.isArray(result.recent_offers)) {
            throw new Error('La réponse de get_recent_offers est incorrecte ou vide.');
        }

        const offers = result.recent_offers; // Récupérer les offres récentes

        // Mettre à jour le tableau "Offres récentes"
        const offersDetails = document.querySelector('.offres_recentes .actions_details');
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
    } catch (error) {
        console.error('Erreur lors du chargement des offres récentes :', error);
    }
}


/**
 * Charger les candidatures récentes.
 */
async function loadRecentApplications() {
    try {
        const apiUrl = apiPaths.get_recent_applications; // Endpoint pour les candidatures récentes
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des candidatures récentes : ${response.statusText}`);
        }

        const result = await response.json(); // Obtenir les données JSON
        console.log('Response from get_recent_applications:', result);

        // Vérifier que la réponse contient les candidatures
        if (result.status !== 'success' || !Array.isArray(result.recent_applications)) {
            throw new Error('La réponse de get_recent_applications est incorrecte ou vide.');
        }

        const applications = result.recent_applications; // Récupérer les candidatures récentes

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


async function getApplicationsEvolution() {
    try {

        const apiUrl = apiPaths.get_applications;
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch applications: ${response.statusText}`);
        }
        const applications = await response.json();

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
    } catch (error) {
        console.error('Error fetching applications evolution:', error);
        return {};
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

async function updateOverviewBoxes() {
    try {
        // Récupérer les données des APIs
        const totalApplications = await getTotalApplications();
        const totalOffers = await getTotalOffers();
        const totalEntreprises = await getTotalEntreprises();

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

async function updateApplicationsLineChart(chart) {
    const applicationsByMonth = await getApplicationsEvolution();

    const labels = Object.keys(applicationsByMonth).sort(); // Trier les mois
    const data = Object.values(applicationsByMonth);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
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


async function initializeDashboard() {
    await loadApiPaths(); // Charger les chemins d'API dynamiquement
    await updateOverviewBoxes(); // Mettre à jour les compteurs
    await loadRecentOffers(); // Charger les offres récentes
    await loadRecentApplications(); // Charger les candidatures récentes
    await initializeCharts(); // Initialiser les graphiques
}

// Lancer le tableau de bord
initializeDashboard();