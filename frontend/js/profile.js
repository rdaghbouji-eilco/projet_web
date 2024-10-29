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

// Function to show a specific section and hide the others
function showSection(sectionId) {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    
    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

// Load the profile and personal information when the page loads
window.onload = async function() {
    // Load the API paths first
    await loadApiPaths();

    // Initially show the profile section
    showSection('profileSection');

    // Load profile information (using existing function to fetch and display data)
    await loadProfileInfo();

    await loadUsername();

    // Load personal information (using existing function to fetch and display data)
    await loadPersonalInfo();
};

async function loadUsername() {
    try {
        const response = await fetch(apiPaths.get_user); // Use dynamic API path from api_paths.json
        const userData = await response.json();
        document.getElementById('name').textContent = userData.name;
        document.getElementById('surname').textContent = userData.surname;
    } catch (error) {
        console.error('Error loading name surname:', error);
    }
}

// Fetch profile information
async function loadProfileInfo() {
    try {
        const response = await fetch(apiPaths.get_profile); // Use dynamic API path from api_paths.json
        const profileData = await response.json();
        document.getElementById('educationLevel').textContent = profileData.education_level;
        document.getElementById('field').textContent = profileData.field;
        document.getElementById('currentSituation').textContent = profileData.current_situation;
        document.getElementById('experienceLevel').textContent = profileData.experience_level;
        document.getElementById('handicap').textContent = profileData.handicap;
        document.getElementById('currentDegree').textContent = profileData.current_degree;
        document.getElementById('graduationYear').textContent = profileData.expected_graduation_year;
    } catch (error) {
        console.error('Error loading profile info:', error);
    }
}

// Fetch personal information
async function loadPersonalInfo() {
    try {
        const response = await fetch(apiPaths.get_personal_info); // Use dynamic API path from api_paths.json
        const personalData = await response.json();

        document.getElementById('phone').textContent = personalData.phone;
        document.getElementById('birthdate').textContent = personalData.birthdate;
        document.getElementById('country').textContent = personalData.country;
    } catch (error) {
        console.error('Error loading personal info:', error);
    }
}
