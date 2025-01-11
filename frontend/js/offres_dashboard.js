import { loadApiPaths, fetchData } from './api.js';

let offerId = null; // Keep track of the offer being edited

// Load and display offers in the table
async function loadOffers() {
    try {
        const offers = await fetchData('get_offers');
        const offersTableBody = document.querySelector('.custom-table tbody');
        offersTableBody.innerHTML = ''; // Clear existing rows

        offers.forEach((offer, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${offer.position_name}</td>
                <td>${offer.description}</td>
                <td>${offer.publish_date}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editOffer(${offer.id})">Modifier</button>
                    <button class="delete-btn" onclick="archiveOffer(${offer.id})">Supprimer</button>
                </td>
            `;
            offersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
    }
}

// Populate dropdowns for foreign keys
async function populateDropdown(apiKey, dropdownId, dataKey, defaultOption) {
    try {
        const data = await fetchData(apiKey);
        const dropdown = document.getElementById(dropdownId);

        dropdown.innerHTML = `<option value="">${defaultOption}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item[dataKey];
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error(`Error populating ${dropdownId}:`, error);
    }
}

// Load all dropdowns for foreign keys
async function loadForeignKeys() {
    await populateDropdown('get_locations', 'locationDropdown', 'location_name', 'Sélectionnez un pays');
    await populateDropdown('get_education_levels', 'educationLevelDropdown', 'education_level', 'Sélectionnez un niveau d\'éducation');
    await populateDropdown('get_experience_levels', 'experienceLevelDropdown', 'experience_level', 'Sélectionnez un niveau d\'expérience');
    await populateDropdown('get_fields', 'fieldDropdown', 'field_name', 'Sélectionnez un domaine');
    await populateDropdown('get_job_types', 'jobTypeDropdown', 'job_type', 'Sélectionnez un type de travail');
    await populateDropdown('get_statuses', 'statusDropdown', 'status_name', 'Sélectionnez un statut');
}

// Edit an existing offer
async function editOffer(id) {
    try {
        const offers = await fetchData('get_offers');
        const offer = offers.find(o => o.id === id);
        if (!offer) throw new Error('Offre non trouvée.');

        document.getElementById('entreprise_name').value = offer.entreprise_name;
        document.getElementById('position_name').value = offer.position_name;
        document.getElementById('description').value = offer.description;
        document.getElementById('fieldDropdown').value = offer.field;
        document.getElementById('locationDropdown').value = offer.location;
        document.getElementById('jobTypeDropdown').value = offer.job_type;
        document.getElementById('duration').value = offer.duration;
        document.getElementById('statusDropdown').value = offer.status;
        document.getElementById('experienceLevelDropdown').value = offer.experience_level;
        document.getElementById('educationLevelDropdown').value = offer.education_level;
        document.getElementById('publish_date').value = offer.publish_date;

        offerId = id;
        document.getElementById('offerFormModal').style.display = 'block';
    } catch (error) {
        console.error('Erreur lors de la modification de l\'offre:', error);
    }
}

// Archive (delete) an offer
async function archiveOffer(id) {
    if (confirm('Êtes-vous sûr de vouloir archiver cette offre?')) {
        try {
            await fetchData('archive_offer', 'POST', { id });
            alert('Offre archivée avec succès.');
            loadOffers(); // Reload the offers
        } catch (error) {
            console.error('Erreur lors de l\'archivage de l\'offre:', error);
        }
    }
}

// Handle form submission (add or update offer)
document.getElementById('offerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        entreprise_name: document.getElementById('entreprise_name').value,
        position_name: document.getElementById('position_name').value,
        description: document.getElementById('description').value,
        field: document.getElementById('fieldDropdown').value,
        location: document.getElementById('locationDropdown').value,
        job_type: document.getElementById('jobTypeDropdown').value,
        duration: document.getElementById('duration').value,
        status: document.getElementById('statusDropdown').value,
        experience_level: document.getElementById('experienceLevelDropdown').value,
        education_level: document.getElementById('educationLevelDropdown').value,
        publish_date: document.getElementById('publish_date').value,
    };

    try {
        if (offerId) {
            await fetchData('update_offer', 'POST', { ...formData, id: offerId });
        } else {
            await fetchData('add_offer', 'POST', formData);
        }

        alert('Opération effectuée avec succès !');
        document.getElementById('offerFormModal').style.display = 'none';
        loadOffers();
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
    }
});

// Initialize the offers section
export async function initializeOffersSection() {
    await loadApiPaths();
    await loadForeignKeys();
    await loadOffers();
}
