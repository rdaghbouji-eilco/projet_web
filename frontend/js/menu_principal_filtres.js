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
        console.log("Loaded API Paths:", apiPaths); // Log to verify paths
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}

const baseUrl = 'http://localhost';

// General function to populate dropdowns
async function populateDropdown(apiUrl, dropdownId, dataKey, defaultOption = 'Sélectionnez...') {
    try {
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const dropdown = document.getElementById(dropdownId);

        // Empty the dropdown first
        dropdown.innerHTML = '';

        // Add a default option
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = defaultOption;
        dropdown.appendChild(defaultOpt);

        // Populate the dropdown with data from the API
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID; // Assumes the API returns an ID field
            option.textContent = item[dataKey]; // Use the specified key for the text content
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error(`Error fetching data for ${dropdownId}:`, error);
    }
}

// General function to populate a checkbox group with data from an API
async function populateCheckboxGroup(apiUrl, containerId, dataKey) {
    try {
        const fullUrl = `${baseUrl}${apiUrl}`;
        console.log(`Fetching data from: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        // Populate checkboxes
        data.forEach(item => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.classList.add('checkbox-wrapper');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item.ID;
            checkbox.id = `${containerId}-${item.ID}`;
            checkbox.name = `${containerId}[]`;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = item[dataKey];

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            container.appendChild(checkboxWrapper);
        });
    } catch (error) {
        console.error(`Error fetching data for ${containerId}:`, error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const openFiltersBtn = document.getElementById('open-filters-btn');
    const popupFilters = document.getElementById('popup-filters');
    const overlay = document.getElementById('overlay');
    const applyFiltersBtn = document.getElementById('apply-filters');

    await loadApiPaths(); // Ensure API paths are loaded first

    // Populate each dropdown with appropriate API data
    populateDropdown(apiPaths.get_countries, 'country', 'country', 'Sélectionnez un pays');
    populateDropdown(apiPaths.get_languages, 'language', 'language_name', 'Sélectionnez une langue');
    populateDropdown(apiPaths.get_fields, 'field', 'field_name', 'Sélectionnez un domaine');
    
    populateCheckboxGroup(apiPaths.get_durations, 'duration', 'Duration');
    populateCheckboxGroup(apiPaths.get_experience_levels, 'experience', 'experience_level');
    populateCheckboxGroup(apiPaths.get_education_levels, 'educationLevel', 'education_level');
    populateCheckboxGroup(apiPaths.get_job_types, 'jobType', 'job_type');

    // Toggle filters popup
    openFiltersBtn.addEventListener('click', function () {
        popupFilters.classList.toggle('active');
        overlay.style.display = 'block';
    });

    // Close popup when clicking on overlay
    overlay.addEventListener('click', function () {
        popupFilters.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Apply filters and log selected values
    applyFiltersBtn.addEventListener('click', function () {
        const duration = document.getElementById('duration').value;
        const experience = document.getElementById('experience').value;
        const language = document.getElementById('language').value;
        const field = document.getElementById('field').value;
        const educationLevel = document.getElementById('educationLevel').value;
        const country = document.getElementById('country').value;
        const jobType = document.getElementById('jobType').value;
        const location = document.getElementById('location').value;
        const startDate = document.getElementById('startDate').value;

        console.log("Filtres appliqués:");
        console.log("Durée du stage: ", duration);
        console.log("Niveau d'expérience: ", experience);
        console.log("Langue: ", language);
        console.log("Domaine d'étude: ", field);
        console.log("Niveau d'étude: ", educationLevel);
        console.log("Pays: ", country);
        console.log("Type de contrat: ", jobType);
        console.log("Lieu: ", location);
    });
});
