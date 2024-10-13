let apiPaths = {};

// Function to load the API paths from the JSON file
async function loadApiPaths() {
    try {
        const response = await fetch('../config/api_paths.json'); // Adjust the path if necessary
        if (!response.ok) {
            throw new Error('Failed to load API paths');
        }
        apiPaths = await response.json(); // Store the API paths for later use
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}

// Call this function at the start to load the paths
loadApiPaths();
