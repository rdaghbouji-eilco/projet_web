let apiPaths = {}; // Global variable to store the API paths

// Function to load the API paths from the JSON file
async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json');
        if (!response.ok) throw new Error('Failed to load API paths');
        apiPaths = await response.json();

        // Check if apiPaths is correctly loaded
        if (!apiPaths.get_user || !apiPaths.get_profile) {
            throw new Error("API paths are missing or incorrectly configured");
        }
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}



window.onload = async function() {
    await loadApiPaths(); // Load the API paths from the JSON file
    
    
    await populateCountryDropdown(); // Populate the country dropdown
    
    if (Object.keys(apiPaths).length === 0) return; // Stop if API paths not loaded

    await loadUsername();
    await loadProfileInfo();
    await loadPersonalInfo();
    await loadProfilePicture();
    await loadCVLink();

    await populateDropdown(apiPaths.get_education_levels, 'educationLevelDropdown', 'education_level', 'Sélectionnez un niveau d\'éducation');
    await populateDropdown(apiPaths.get_fields, 'fieldDropdown', 'field_name', 'Sélectionnez un domaine');
    await populateDropdown(apiPaths.get_experience_levels, 'experienceLevelDropdown', 'experience_level', 'Sélectionnez un niveau d\'expérience');
    await populateDropdown(apiPaths.get_current_degree, 'currentDegreeDropdown', 'degree_name', 'Sélectionnez un diplôme actuel');
    await populateDropdown(apiPaths.get_expected_graduation_year, 'graduationYearDropdown', 'year', 'Sélectionnez une année');

    };
