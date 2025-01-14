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
        const queryParams = new URLSearchParams(filters).toString();
        const apiUrlWithFilters = `${apiPaths.get_offers}?${queryParams}`;

        console.log("Fetching offers with filters:", apiUrlWithFilters); // Debug log

        const response = await fetch(apiUrlWithFilters);
        if (!response.ok) {
            throw new Error(`Failed to fetch offers: ${response.status}`);
        }

        const offersData = await response.json();
        console.log("Filtered Offers Data:", offersData); // Debug log

        // Display logic
        const offersListContainer = document.getElementById('offersListContainer');
        offersListContainer.innerHTML = ''; // Clear previous data

        if (Array.isArray(offersData)) {
            offersData.forEach(offer => {
                const offerCard = document.createElement('div');
                offerCard.className = 'offer-card';
                offerCard.innerHTML = `
                    <h4>${offer.entreprise_name}</h4>
                    <h5 class="position">${offer.position_name}</h5>
                    <p class="location">
                        <span class="material-symbols-outlined">location_on</span> ${offer.location}
                    </p>
                    <p>
                        <span class="material-symbols-outlined">work</span> Internship ${offer.duration} mois
                    </p>
                    <button onclick="showOfferDetails(${offer.id})" class="view-offer-button">Voir l'offre</button>
                `;

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
    populateDropdown(apiPaths.get_locations, 'location_bar', 'Location', 'Sélectionnez une localisation');
    populateDropdown(apiPaths.get_languages, 'language', 'language_name', 'Sélectionnez une langue');
    populateDropdown(apiPaths.get_fields, 'field', 'field_name', 'Sélectionnez un domaine');
    populateDropdown(apiPaths.get_job_types, 'jobType', 'job_type','Sélectionnez un type de contrat');
    populateDropdown(apiPaths.get_job_types, 'jobType_bar', 'job_type', 'Contrat');
    populateCheckboxGroup(apiPaths.get_durations, 'duration', 'Duration');
    populateCheckboxGroup(apiPaths.get_experience_levels, 'experience', 'experience_level');
    populateCheckboxGroup(apiPaths.get_education_levels, 'educationLevel', 'education_level');

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
            await loadOffers(selectedFilters); // Use loadOffers to apply filters
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

export function filterOffers() {
    console.log("Filter function triggered");

    const input = document.getElementById('searchBar').value.toLowerCase();
    console.log("Search Input:", input);

    const offerCards = document.querySelectorAll('#offersListContainer .offer-card');
    console.log("Found offer cards:", offerCards.length);

    offerCards.forEach((card, index) => {
        const enterpriseNameElement = card.querySelector('h4');
        const positionNameElement = card.querySelector('h5.position'); // Updated to h5

        console.log(`Card ${index + 1}:`, card.innerHTML); // Log card HTML for debugging
        console.log("Enterprise Name Element:", enterpriseNameElement?.textContent);
        console.log("Position Name Element:", positionNameElement?.textContent);

        const enterpriseName = enterpriseNameElement ? enterpriseNameElement.textContent.toLowerCase().trim() : '';
        const positionName = positionNameElement ? positionNameElement.textContent.toLowerCase().trim() : '';

        console.log(`Enterprise: "${enterpriseName}", Position: "${positionName}"`);

        const isMatch = enterpriseName.includes(input) || positionName.includes(input);
        console.log(`Match result for "${input}":`, isMatch);

        card.style.display = isMatch ? '' : 'none';
    });
}

window.filterOffers = filterOffers;
window.showOfferDetails = showOfferDetails;
window.submitApplication = submitApplication;
window.buildQueryString = buildQueryString;
window.handleRetourButtonClick = handleRetourButtonClick