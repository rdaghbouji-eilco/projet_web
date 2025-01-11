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

// Function to show a specific section and hide the others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Function to hide a specific section
function hideSection(sectionId) {
    document.getElementById(sectionId).style.display = 'none';
}

// Function to handle "Retour" button click
function handleRetourButtonClick() {
    hideSection('offre'); // Hide the offer details section
    showSection('offersListContainer'); // Show the offers list section
}

async function loadOffers(filters = {}) {
    try {
        // Build the query string using the helper function
        const queryString = buildQueryString(filters);

        // Append query string to the API URL
        const fullUrl = `${baseUrl}${apiPaths.get_offers_filtres}?${queryString}`;
        console.log("Fetching offers with URL:", fullUrl); // Debug log

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch offers: ${response.status}`);
        }

        const offersData = await response.json();
        console.log("Filtered Offers Data:", offersData); // Log the fetched data to check its structure

        const offersListContainer = document.getElementById('offersListContainer');
        offersListContainer.innerHTML = ''; // Clear previous data

        // Check if the data is in the expected format
        if (Array.isArray(offersData)) {
            offersData.forEach(offer => {
                // Create a new div element for each offer
                const offerCard = document.createElement('div');
                offerCard.className = 'offer-card'; // Add a class for styling each card

                // Populate the card with the offer data
                offerCard.innerHTML = `
                    <h4>${offer.entreprise_name}</h4>
                    <p>${offer.position_name}</p>
                    
                    <p><span class="material-symbols-outlined">location_on</span> ${offer.location}  <span class="material-symbols-outlined">work</span> Durée ${offer.duration}</p>
                    <button onclick="showOfferDetails(${offer.id})" class="view-offer-button">Voir l'offre</button>
                `;

                // Append each offer card to the offers list container
                offersListContainer.appendChild(offerCard);
            });
        } else {
            console.error('Expected offersData to be an array, but got:', offersData);
        }

    } catch (error) {
        console.error('Error in loadOffers function:', error);
    }
}


// Function to display offer details
function showOfferDetails(offerId) {
    // Assuming offersData is available globally or you fetch it again here
    const fullUrl = `${baseUrl}${apiPaths.get_offers}`;
    fetch(fullUrl)
        .then(response => response.json())
        .then(offersData => {
            const offer = offersData.find(o => o.id === offerId);
            if (offer) {
                const offerDetailsContainer = document.getElementById('offerDetailsContainer');
                offerDetailsContainer.innerHTML = `
                   <p id="offer-position">${offer.position_name}</p>
                   <p id="offer-field">${offer.field}</p>
                   <p class="offer-info"><span class="material-symbols-outlined">location_on</span> ${offer.location} | 
                   <span class="material-symbols-outlined">work</span> Durée ${offer.duration}</p>
                   <p id="offer-entreprise"> ${offer.entreprise_name}</p>
                   <p id="offer-publish-date">Publiée le ${offer.publish_date}</p>
                   <p id="offer-experience-level"><strong>Experience Level:</strong> ${offer.experience_level}</p>
                   <p id="offer-education-level"><strong>Education Level:</strong> ${offer.education_level}</p>
                   <p id="offer-description"><strong>Description:</strong> ${offer.description}</p>
                   <button class="btn-apply" onclick="submitApplication(${offer.id})">Submit Application</button>
                   `;
                hideSection('offersListContainer'); // Hide the offers list section
                showSection('offre'); // Show the offer details section

            }
        })
        
        .catch(error => console.error('Error fetching offer details:', error));
}

async function submitApplication(offerId) {
    try {
        // Get the API URL for submitting the application
        const fullUrl = `${baseUrl}${apiPaths.submit_application}`;
        
        // Prepare the payload
        const payload = { offer_ID: offerId };
        
        // Send the application request
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });


        const result = await response.json();

        if (response.ok) {
            alert('Application submitted successfully!');
            console.log('Application Response:', result);
        } else {
            throw new Error(result.message || 'Failed to submit application');
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        alert(`Error submitting application: ${error.message}`);
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

function getSelectedFilters() {
    return {
        duration: Array.from(document.querySelectorAll('#duration input:checked')).map(el => el.value),
        experience: Array.from(document.querySelectorAll('#experience input:checked')).map(el => el.value),
        language: document.getElementById('language').value,
        field: document.getElementById('field').value,
        educationLevel: Array.from(document.querySelectorAll('#educationLevel input:checked')).map(el => el.value),
        location: document.getElementById('location').value,
        jobType: Array.from(document.querySelectorAll('#jobType input:checked')).map(el => el.value),
        startDate: document.getElementById('startDate').value,
        remote: Array.from(document.querySelectorAll('#telework input:checked')).map(el => el.value)
    };
}

function buildQueryString(filters) {
    return Object.keys(filters)
        .map(key => {
            const value = filters[key];
            if (Array.isArray(value)) {
                return `${key}=${encodeURIComponent(value.join(','))}`;
            }
            return `${key}=${encodeURIComponent(value)}`;
        })
        .filter(param => param.includes('=') && !param.endsWith('='))
        .join('&');
}



document.addEventListener('DOMContentLoaded', async () => {
    const openFiltersBtn = document.getElementById('open-filters-btn');
    const popupFilters = document.getElementById('popup-filters');
    const overlay = document.getElementById('overlay');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const closeButton = document.querySelector('.close-button'); // Select the close "X" button

    await loadApiPaths(); // Ensure API paths are loaded first

    // Populate each dropdown with appropriate API data
    populateDropdown(apiPaths.get_locations, 'location', 'Location', 'Sélectionnez une localisation');
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

    // Close popup when clicking on the "X" button
    closeButton.addEventListener('click', function () {
        popupFilters.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Event listener for the "Apply Filters" button
    applyFiltersBtn.addEventListener('click', async function () {
        const selectedFilters = getSelectedFilters();

        console.log("Filtres appliqués:", selectedFilters);

        try {
            // Use loadOffers function to handle the API call and display offers
            await loadOffers(selectedFilters);
            popupFilters.classList.remove('active');
            overlay.style.display = 'none';
        } catch (error) {
            console.error('Error fetching filtered offers:', error);
        }
    });
});

// Load the profile and personal information when the page loads
window.onload = async function() {
    await loadApiPaths();
    await loadOffers();
    showSection('offersListContainer');
    
};