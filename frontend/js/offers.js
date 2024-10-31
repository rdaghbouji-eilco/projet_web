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

// Function to show a specific section and hide the others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Load the profile and personal information when the page loads
window.onload = async function() {
    await loadApiPaths();
    await loadOffers();
};

async function loadOffers() {
    try {
        const response = await fetch(apiPaths.get_offers); // Use dynamic API path from api_paths.json
        if (!response.ok) {
            throw new Error(`Failed to fetch offers: ${response.status}`);
        }

        const offersData = await response.json();
        console.log("Offers Data:", offersData); // Log the fetched data to check its structure

        const offersListContainer = document.getElementById('offersListContainer');
        offersListContainer.innerHTML = ''; // Clear previous data

        // Check if the data is in the expected format
        if (Array.isArray(offersData)) {
            offersData.forEach(offer => {
                // Create a new div element for each offer
                const offerElement = document.createElement('div');
                offerElement.className = 'offer'; // Optional: add a class for styling

                // Create content for each offer
                offerElement.innerHTML = `
                    <p><strong>Entreprise:</strong> ${offer.entreprise_name}</p>
                    <p><strong>Position:</strong> ${offer.position_name}</p>
                    <p><strong>Description:</strong> ${offer.description}</p>
                    <p><strong>Field:</strong> ${offer.field}</p>
                    <p><strong>Location:</strong> ${offer.location}</p>
                    <p><strong>Duration:</strong> ${offer.duration}</p>
                    <p><strong>Publish Date:</strong> ${offer.publish_date}</p>
                    <p><strong>Status:</strong> ${offer.status}</p>
                    <p><strong>Experience Level:</strong> ${offer.experience_level}</p>
                    <p><strong>Education Level:</strong> ${offer.education_level}</p>
                `;

                // Append the new offer element to the offers list container
                offersListContainer.appendChild(offerElement);
            });
        } else {
            console.error('Expected offersData to be an array, but got:', offersData);
        }

    } catch (error) {
        console.error('Error in loadOffers function:', error);
    }
}
