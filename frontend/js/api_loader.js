let apiPaths = {}; // Global API paths

async function loadApiPaths() {
    if (Object.keys(apiPaths).length > 0) return; // If already loaded, skip

    try {
        const response = await fetch('../../config/api_paths.json');
        if (!response.ok) throw new Error(`Failed to load API paths: ${response.statusText}`);
        apiPaths = await response.json();
        console.log('API paths loaded:', apiPaths);
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}
