// Function to populate the dropdowns with data from the API
async function populateDropdown(apiUrl, dropdownId, dataKey, defaultOption = 'Sélectionnez...') {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
        }

        const data = await response.json();
        const dropdown = document.getElementById(dropdownId);

        // Empty the dropdown before populating
        dropdown.innerHTML = '';

        // Add a default option
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = defaultOption;
        dropdown.appendChild(defaultOpt);

        // Populate the dropdown with data from the API
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID; // Suppose que l'API renvoie un champ ID
            option.textContent = item[dataKey]; // Utiliser la clé de l'objet correspondant à l'API
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error(`Erreur pour ${dropdownId}:`, error);
        document.getElementById('errorMessage').textContent = `Erreur pour ${dropdownId}: ${error.message}`;
    }
}

// Call the function for each dropdown after loading the API paths

// Handle form submission
document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission classique du formulaire
    
    console.log("Formulaire soumis"); // Vérification du déclenchement de la soumission

    // Récupérer les données du formulaire
    const formData = {
        education_level: document.getElementById('educationLevelDropdown').value,
        field: document.getElementById('fieldDropdown').value,
        current_situation: document.getElementById('currentSituationDropdown').value,
        experience_level: document.getElementById('experienceLevelDropdown').value,
        handicap: document.getElementById('handicapDropdown').value,
        current_degree: document.getElementById('currentDegreeDropdown').value,
        expected_graduation_year: document.getElementById('graduationYearDropdown').value
    };
    
    formData.handicap = parseInt(document.getElementById('handicapDropdown').value, 10);

    // Afficher les données dans la console pour vérifier
    console.log("Données du formulaire :", formData);

    try {
        const response = await fetch(apiPaths.update_profile, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Send the form data as JSON
        });
    
        // Log the raw response for debugging
        const rawResponse = await response.text(); // Get the raw response as text
        console.log("Raw server response:", rawResponse); // Log the response
    
        // Then try to parse the response as JSON
        const result = JSON.parse(rawResponse); // Parse it as JSON
        console.log("Parsed server response:", result);
    
        if (response.ok) {
            alert('Profil mis à jour avec succès !');
            location.reload();
        } else {
            throw new Error(result.message || 'Erreur inconnue');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        document.getElementById('errorMessage').textContent = `Erreur: ${error.message}`;
    }
    
});

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

async function loadProfileProModal() {
    try {
        console.log('Loading profile pro modal...');
        await Promise.all([
            populateDropdown(apiPaths.get_education_levels, 'educationLevelDropdown', 'education_level'),
            populateDropdown(apiPaths.get_fields, 'fieldDropdown', 'field_name'),
            populateDropdown(apiPaths.get_experience_levels, 'experienceLevelDropdown', 'experience_level'),
            populateDropdown(apiPaths.get_current_degree, 'currentDegreeDropdown', 'degree_name'),
            populateDropdown(apiPaths.get_expected_graduation_year, 'graduationYearDropdown', 'year'),
        ]);
        console.log('Profile pro modal loaded successfully.');
    } catch (error) {
        console.error('Error loading profile pro modal:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const updateProfileBtn = document.getElementById('update-form-btn'); // Ensure the button ID is correct
    const popupProfile = document.getElementById('popup-profile'); // The modal element
    const overlayProfile = document.getElementById('overlay-profile'); // The overlay element
    const closeProfileBtn = document.querySelector('#popup-profile .close-button'); // The close button inside the modal

    // Function to open the modal
    function openPopup() {
        console.log('Opening modal');
        popupProfile.classList.add('active'); // Add the "active" class to show the modal
        overlayProfile.classList.add('active'); // Add the "active" class to show the overlay
    }

    // Function to close the modal
    function closePopup() {
        console.log('Close function triggered');
        popupProfile.classList.remove('active'); // Remove the "active" class to hide the modal
        overlayProfile.classList.remove('active'); // Remove the "active" class to hide the overlay
    }
    console.log('Update Profile button found with ID:', updateProfileBtn.id);

    // Add event listeners
    if (updateProfileBtn) {
                updateProfileBtn.addEventListener('click', async function () {
                await loadApiPaths(); // Ensure API paths are loaded
                await loadProfileProModal(); // Load modal data lazily
                document.getElementById('popup-profile').classList.add('active'); // Show modal
            });
    } else {
        console.error('Update Profile button not found!');
    }

    if (overlayProfile) {
        overlayProfile.addEventListener('click', closePopup); // Close modal when clicking on the overlay
    } else {
        console.error('Overlay not found!');
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', closePopup); // Close modal when clicking the close button
    } else {
        console.error('Close button not found!');
    }

    // Ensure API paths are loaded
    await loadApiPaths();

    // Populate dropdowns in the modal
    populateDropdown(apiPaths.get_education_levels, 'educationLevelDropdown', 'education_level', 'Sélectionnez un niveau d\'éducation');
    populateDropdown(apiPaths.get_fields, 'fieldDropdown', 'field_name', 'Sélectionnez un domaine');
    populateDropdown(apiPaths.get_experience_levels, 'experienceLevelDropdown', 'experience_level', 'Sélectionnez un niveau d\'expérience');
    populateDropdown(apiPaths.get_current_degree, 'currentDegreeDropdown', 'degree_name', 'Sélectionnez un diplôme actuel');
    populateDropdown(apiPaths.get_expected_graduation_year, 'graduationYearDropdown', 'year', 'Sélectionnez une année');
});


// Close modal when clicking outside the content
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};
