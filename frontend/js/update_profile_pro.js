console.log("JS chargé"); // Pour vérifier que le fichier JS est bien chargé

// Load API paths from api_loader.js before proceeding
let apiPaths = {};

// Function to load the API paths from the JSON file (api_loader)
async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json'); // Adjust the path if necessary
        if (!response.ok) {
            throw new Error('Failed to load API paths');
        }
        apiPaths = await response.json(); // Store the API paths for later use
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}


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
window.onload = async function() {
    await loadApiPaths(); // Load the API paths from the JSON file

    await populateDropdown(apiPaths.get_education_levels, 'educationLevelDropdown', 'education_level', 'Sélectionnez un niveau d\'éducation');
    await populateDropdown(apiPaths.get_fields, 'fieldDropdown', 'field_name', 'Sélectionnez un domaine');
    await populateDropdown(apiPaths.get_experience_levels, 'experienceLevelDropdown', 'experience_level', 'Sélectionnez un niveau d\'expérience');
    await populateDropdown(apiPaths.get_current_degree, 'currentDegreeDropdown', 'degree_name', 'Sélectionnez un diplôme actuel');
    await populateDropdown(apiPaths.get_expected_graduation_year, 'graduationYearDropdown', 'year', 'Sélectionnez une année');
};

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
        } else {
            throw new Error(result.message || 'Erreur inconnue');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        document.getElementById('errorMessage').textContent = `Erreur: ${error.message}`;
    }
    
});
