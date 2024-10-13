let apiPaths = {}; // Global variable to store the API paths

// Function to load the API paths from the JSON file
async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json'); // Adjust path to your JSON file
        if (!response.ok) {
            throw new Error('Failed to load API paths');
        }
        apiPaths = await response.json(); // Store the API paths for later use
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}

// Function to load user's current personal info
async function loadPersonalInfo() {
    try {
        const response = await fetch(apiPaths.get_personal_info, {
            method: 'GET',
            credentials: 'include' // Ensure the session cookie is sent with the request
        });

        if (response.ok) {
            const personalInfo = await response.json();

            // Populate the form fields with current data
            document.getElementById('phone').value = personalInfo.phone || '';
            document.getElementById('birthdate').value = personalInfo.birthdate || '';
            document.getElementById('countryDropdown').value = personalInfo.country || '';
        } else {
            throw new Error('Failed to load personal info');
        }
    } catch (error) {
        console.error('Error loading personal info:', error);
        document.getElementById('errorMessage').textContent = `Error: ${error.message}`;
    }
}

// Function to populate the country dropdown
async function populateCountryDropdown() {
    try {
        const response = await fetch(apiPaths.get_countries, { method: 'GET' });
        const data = await response.json();
        const dropdown = document.getElementById('countryDropdown');

        // Empty the dropdown first
        dropdown.innerHTML = '';

        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionnez un pays';
        dropdown.appendChild(defaultOption);

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID;
            option.textContent = item.Country;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

// Handle form submission
document.getElementById('personalInfoForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = {
        phone: document.getElementById('phone').value,
        birthdate: document.getElementById('birthdate').value,
        country: document.getElementById('countryDropdown').value
    };

    try {
        const response = await fetch(apiPaths.update_personal_info, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Ensure the session is linked to the user
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Personal information updated successfully');
        } else {
            throw new Error(result.message || 'Error updating personal info');
        }
    } catch (error) {
        console.error('Error updating personal info:', error);
        document.getElementById('errorMessage').textContent = `Error: ${error.message}`;
    }
});

// On page load
window.onload = async function() {
    await loadApiPaths(); // Load API paths from the JSON file
    await populateCountryDropdown(); // Populate the country dropdown
    await loadPersonalInfo(); // Load user's personal information
};
