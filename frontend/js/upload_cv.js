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

document.getElementById('cvUploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const formData = new FormData();
    const fileInput = document.getElementById('cv');

    // Append the selected file to the FormData object
    formData.append('cv', fileInput.files[0]);

    try {
        const response = await fetch(apiPaths.upload_cv, {
            method: 'POST',
            body: formData // FormData object to handle file upload
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('uploadStatus').textContent = 'CV uploaded successfully!';
        } else {
            throw new Error(result.message || 'Failed to upload CV.');
        }
    } catch (error) {
        document.getElementById('uploadStatus').textContent = `Error: ${error.message}`;
    }
});

// Call this function to ensure API paths are loaded before any operations
window.onload = async function() {
    await loadApiPaths(); // Load API paths first

};

