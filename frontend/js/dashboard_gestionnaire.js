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

async function loadOffers() {
    try {
        const response = await fetch(apiPaths.get_offers); // Fetch offers from the API
        if (!response.ok) {
            throw new Error('Failed to load offers.');
        }

        const offers = await response.json(); // Parse the JSON response
        const offersList = document.getElementById('offersList');
        offersList.innerHTML = ''; // Clear previous offers

        offers.forEach(offer => {
            const offerItem = document.createElement('div');
            offerItem.classList.add('offer-item');
            offerItem.innerHTML = `
                <h4>${offer.position_name}</h4>
                <p>${offer.description}</p>
                <p>Date limite : ${offer.publish_date}</p>
                <button onclick="editOffer(${offer.id})">Modifier</button>
                <button onclick="deleteOffer(${offer.id})">Supprimer</button>
            `;
            offersList.appendChild(offerItem); // Add offer to the list
        });
    } catch (error) {
        // console.error('Erreur lors du chargement des offres:', error);
    }
}

async function editOffer(offerId) {
    try {
        // Récupère toutes les offres, y compris celle avec l'ID donné
        const response = await fetch(`${apiPaths.get_offers}?id=${offerId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de l\'offre.');
        }
        const offers = await response.json();

        // Trouve l'offre avec l'ID donné
        const offer = offers.find(item => item.id === offerId);
        if (!offer) {
            console.error('Offre non trouvée');
            return;
        }

        // Remplir les champs du formulaire avec les données de l'offre spécifique
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

        // Affecter l'ID de l'offre au champ caché pour les futures modifications
        document.getElementById('offer_id').value = offerId;

        // Mettre à jour le titre et afficher le formulaire
        document.getElementById('offerFormTitle').textContent = 'Modifier l\'offre';
        document.getElementById('offerFormModal').style.display = 'block';
    } catch (error) {
        console.error('Erreur lors de la modification de l\'offre:', error);
    }
}


// Function to archive offer
async function archiveOffer(offerId) {
    if (confirm('Êtes-vous sûr de vouloir archiver cette offre?')) {
        try {
            const response = await fetch(apiPaths.archive_offer, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: offerId })
            });

            if (response.ok) {
                alert('Offre archivée avec succès.');
                loadOffers(); // Reload offers
            } else {
                throw new Error('Échec de l\'archivage de l\'offre.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'archivage de l\'offre:', error);
        }
    }
}


// Function to populate a dropdown
async function populateDropdown(apiUrl, dropdownId, dataKey, defaultOption) {
    try {
        const response = await fetch(apiUrl); // Fetch data from the API
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${apiUrl}`);
        }

        const data = await response.json(); // Parse the JSON data
        const dropdown = document.getElementById(dropdownId); // Get the dropdown element

        // Empty the dropdown first
        dropdown.innerHTML = '';

        // Add a default option
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = defaultOption;
        dropdown.appendChild(defaultOpt);

        // Populate the dropdown with API data
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID; // Assuming each item has an 'ID'
            option.textContent = item[dataKey]; // Use the dataKey for text
            dropdown.appendChild(option);
        });
    } catch (error) {
        // console.error(`Error populating ${dropdownId}:`, error);
    }
}

// Function to load dropdowns for foreign keys
async function loadForeignKeys() {
    await populateDropdown(apiPaths.get_locations, 'locationDropdown', 'Location', 'Sélectionnez un pays');
    await populateDropdown(apiPaths.get_education_levels, 'educationLevelDropdown', 'education_level', 'Sélectionnez un niveau d\'éducation');
    await populateDropdown(apiPaths.get_experience_levels, 'experienceLevelDropdown', 'experience_level', 'Sélectionnez un niveau d\'expérience');
    await populateDropdown(apiPaths.get_fields, 'fieldDropdown', 'field_name', 'Sélectionnez un domaine');
    await populateDropdown(apiPaths.get_job_types, 'jobTypeDropdown', 'job_type', 'Sélectionnez un type de travail');
    await populateDropdown(apiPaths.get_statuses, 'statusDropdown', 'Job_offer_status', 'Sélectionnez un statut');
}

// Function to show the selected section and hide the others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Function to show the offer form modal
function showOfferForm() {
    document.getElementById('offerForm').reset(); // Clear form
    document.getElementById('offerFormTitle').textContent = 'Ajouter une offre';
    offerId = null; // Reset offer ID
    document.getElementById('offerFormModal').style.display = 'block';
}

// Function to hide the offer form modal
function hideOfferForm() {
    document.getElementById('offerFormModal').style.display = 'none';
}

document.getElementById('offerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Ensure apiPaths is correctly loaded before using it
    if (!apiPaths) {
        console.error('API path for add_offer is not defined.');
        return;
    }

    // Collect form data
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
        publish_date: document.getElementById('publish_date').value
    };

    let apiUrl = apiPaths.add_offer; // Default is adding a new offer
    let method = 'POST';

    if (offerId) {
        formData.id = offerId; // Include offer ID for update
        apiUrl = apiPaths.update_offer; // If offer ID exists, update instead of add
    }

    try {
        // Make the API request to add the offer
        const response = await fetch(apiUrl, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Opération effectuée avec succès !');
            hideOfferForm(); // Hide the form modal
            loadOffers(); // Reload the offers
        } else {
            throw new Error('Échec de l\'opération.');
        }
    } catch (error) {
        console.error('Échec de l\'opération.', error);
    }
});

// Call this function to ensure API paths are loaded before any operations
window.onload = async function() {
    await loadApiPaths(); // Load API paths first
    await loadForeignKeys(); // Load all dropdowns for foreign keys
    await loadOffers(); // Then load the offers

};
