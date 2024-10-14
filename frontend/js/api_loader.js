// api_loader.js

// Global variable to store API paths
window.apiPaths = {};

// Function to load the API paths from the JSON file
window.loadApiPaths = async function() {
    try {
        const response = await fetch('../../config/api_paths.json'); // Adjust the path if necessary
        if (!response.ok) {
            throw new Error('Failed to load API paths');
        }
        window.apiPaths = await response.json(); // Store the API paths globally
        console.log("API paths loaded successfully:", window.apiPaths);
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
};
