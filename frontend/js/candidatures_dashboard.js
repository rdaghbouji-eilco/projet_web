import { loadApiPaths, fetchData } from './api.js';

let currentApplicationId = null; // Variable pour suivre l'ID de la candidature en cours de modification

export async function loadApplications() {
    try {
        const response = await fetchData('get_all_applications');
        if (response.status === 'success') {
            const applications = response.applications;
            const applicationsTableBody = document.getElementById('applicationsTableBody');
            applicationsTableBody.innerHTML = ''; // Vider les anciennes données

            applications.forEach((application, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${application.application_id}</td>
                    <td>${application.applicant_name} ${application.applicant_surname}</td>
                    <td>${application.position_name}</td>
                    <td>${new Date(application.application_date).toLocaleDateString()}</td>
                    <td>${application.application_status}
                    <button class="edit-btn" onclick="editApplication(${application.application_id})">Modifier</button>
                    </td>
                    <td class="actions">
                        <button class="view-btn" onclick="viewProfile(${application.application_id})">Voir le Profil</button>
        
                    </td>
                `;
                applicationsTableBody.appendChild(row);
            });
        } else {
            console.error('Erreur lors du chargement des candidatures:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des candidatures:', error);
    }
}

// Afficher les détails du profil d'un candidat
export async function viewProfile(applicationId) {
    try {
        const response = await fetchData('get_all_applications'); // Récupère l'objet complet
        const applications = response.applications; // Accède au tableau des candidatures

        // Vérifie si 'applications' est bien un tableau
        if (!Array.isArray(applications)) {
            throw new Error('Les données des candidatures ne sont pas valides.');
        }

        // Trouve l'application correspondante
        const application = applications.find(app => app.application_id === applicationId);
        if (!application) throw new Error('Candidature introuvable.');

        // Affiche les informations du profil
        alert(`
            Profil du Candidat :
            - Nom : ${application.applicant_name} ${application.applicant_surname}
            - Email : ${application.applicant_email || 'Non spécifié'}
        `);
    } catch (error) {
        console.error('Erreur lors de l\'affichage du profil:', error);
    }
}


export async function editApplication(applicationId) {
    try {
        const response = await fetchData('get_all_applications'); // Récupère les candidatures
        const applications = response.applications;

        // Vérifie que les données retournées sont valides
        if (!Array.isArray(applications)) {
            throw new Error('Les données des candidatures ne sont pas valides.');
        }

        // Trouve la candidature correspondant à l'ID
        const application = applications.find(app => app.application_id === applicationId);
        if (!application) throw new Error('Candidature introuvable.');

        // Sauvegarder l'ID de la candidature à modifier
        currentApplicationId = applicationId;
        console.log('Affichage de la modale pour ID:', currentApplicationId);

        // Afficher la modale
        document.getElementById('editApplicationModal').style.display = 'block';

    } catch (error) {
        console.error('Erreur lors de la modification de la candidature:', error);
    }
}


// Fermer une modale
export function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}



document.getElementById('editApplicationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const status = document.getElementById('applicationStatus').value;

    try {
        const response = await fetchData('update_application_status', 'POST', {
            id: currentApplicationId,
            status: status,
        });

        if (response.status === 'success') {
            alert('Statut de la candidature mis à jour avec succès !');
            closeModal('editApplicationModal');
            loadApplications(); // Recharge les candidatures
        } else {
            console.error('Erreur lors de la mise à jour :', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la candidature :', error);
    }
});


// Barre de recherche dynamique
export function filterApplications() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#applicationsTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}


// Initialisation de la section des candidatures
export async function initializeApplicationsSection() {
    await loadApiPaths(); // Charger les chemins d'API
    loadApplications();   // Charger les candidatures
}

// Ajouter des fonctions au scope global
window.viewProfile = viewProfile;
window.editApplication = editApplication;
window.closeModal = closeModal;
window.filterApplications = filterApplications;
