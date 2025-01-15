import { apiPaths, loadApiPaths, fetchData } from './api.js';

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
                    <button class="delete-btn" onclick="deleteOffer(${offer.id})">Supprimer</button>
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
        console.log('Parsed Response:', data); // Log the parsed response for debugging
        
        const dropdown = document.getElementById(dropdownId);

        dropdown.innerHTML = `<option value="">${defaultOption}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID; // Match the key in the response (use `ID`)
            option.textContent = item[dataKey];
            dropdown.appendChild(option);
        });

        console.log(`Options for ${dropdownId}:`, Array.from(dropdown.options).map(opt => ({ value: opt.value, text: opt.text })));
    } catch (error) {
        console.error(`Error populating ${dropdownId}:`, error);
    }
}

async function deleteOffer(offerId) {
    console.log('API Paths Object:', apiPaths); // Check the state of apiPaths
    console.log('Path for delete_offer:', apiPaths?.delete_offer); // Ensure the key exists
    if (!apiPaths?.delete_offer) {
        console.error('delete_offer path not found in apiPaths!');
        return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre?')) {
        try {
            console.log('API Path for Delete:', apiPaths.delete_offer); // Debug
            console.log('Offer ID to delete:', offerId); // Debug

            const response = await fetch(apiPaths.delete_offer, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: offerId })
            });

            if (response.ok) {
                alert('Offre supprimée avec succès.');
                await loadOffers(); // Reload the offers list
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Échec de la suppression de l\'offre.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'offre:', error);
        }
    }
}


// Attach to global scope
window.deleteOffer = deleteOffer;



// Load all dropdowns for foreign keys
async function loadForeignKeys() {
    await populateDropdown('get_locations', 'locationDropdown', 'Location', 'Sélectionnez un pays');
    await populateDropdown('get_education_levels', 'educationLevelDropdown', 'education_level', 'Sélectionnez un niveau d\'éducation');
    await populateDropdown('get_experience_levels', 'experienceLevelDropdown', 'experience_level', 'Sélectionnez un niveau d\'expérience');
    await populateDropdown('get_fields', 'fieldDropdown', 'field_name', 'Sélectionnez un domaine');
    await populateDropdown('get_job_types', 'jobTypeDropdown', 'job_type', 'Sélectionnez un type de travail');
    await populateDropdown('get_statuses', 'statusDropdown', 'Job_offer_status', 'Sélectionnez un statut');
    await populateDropdown('get_durations', 'durationDropDown', 'Duration', 'Sélectionnez une durée');
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
        document.getElementById('durationDropDown').value = offer.duration;
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

// Attach to global scope
window.editOffer = editOffer;


// Handle form submission (add or update offer)
document.getElementById('offerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        entreprise_name: document.getElementById('entreprise_name').value || '',
        position_name: document.getElementById('position_name').value || '',
        description: document.getElementById('description').value || '',
        field: document.getElementById('fieldDropdown').value || null,
        location: document.getElementById('locationDropdown').value || null,
        job_type: document.getElementById('jobTypeDropdown').value || null,
        duration: document.getElementById('durationDropDown').value || null,
        status: document.getElementById('statusDropdown').value || null,
        experience_level: document.getElementById('experienceLevelDropdown').value || null,
        education_level: document.getElementById('educationLevelDropdown').value || null,
        publish_date: document.getElementById('publish_date').value || '',
    };

    // Validate that required fields are not undefined or null
    if (!formData.field || !formData.location || !formData.job_type || !formData.duration) {
        alert('Please select valid options for all dropdown fields.');
        return;
    }

    console.log('Form Data Sent to API:', formData);

    try {
        if (offerId) {
            await fetchData('update_offer', 'POST', { ...formData, id: offerId });
        } else {
            await fetchData('add_offer', 'POST', formData);
        }

        alert('Offer added/updated successfully.');
        document.getElementById('offerFormModal').style.display = 'none';
        loadOffers();
    } catch (error) {
        console.error('Error submitting the form:', error);
    }
});


function showOfferForm() {
    const offerFormModal = document.getElementById('offerFormModal');
    
    // Reset form fields
    document.getElementById('offerForm').reset();
    offerId = null; // Reset the offerId to indicate a new offer
    
    // Display the modal
    if (offerFormModal) {
        offerFormModal.style.display = 'block';
    } else {
        console.error('Modal element not found: offerFormModal');
    }
}

window.showOfferForm = showOfferForm;

// Initialize the offers section
export async function initializeOffersSection() {
    await loadApiPaths();
    await loadForeignKeys();
    await loadOffers();
}
