export let apiPaths = {}; // Global variable to store API paths
const baseUrl = 'http://localhost';

// Load API paths from the configuration file
export async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json');
        if (!response.ok) throw new Error(`Failed to load API paths: ${response.statusText}`);
        apiPaths = await response.json();
        console.log('API paths loaded successfully:', apiPaths);
    } catch (error) {
        console.error('Error loading API paths:', error);
        throw error;
    }
}

// Generic function to fetch data from an API
export async function fetchData(apiPath, method = 'GET', body = null) {
    try {
        console.log('Base URL:', baseUrl);
        console.log('API Path:', apiPaths[apiPath]);
        if (!apiPaths[apiPath]) throw new Error(`API path "${apiPath}" not found in apiPaths`);

        const fullUrl = `${baseUrl}${apiPaths[apiPath]}`;
        console.log('Full URL:', fullUrl);

        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(fullUrl, options);
        if (!response.ok) throw new Error(`Failed to fetch ${apiPath}: ${response.status} ${response.statusText}`);
        
        const data = await response.json();
        console.log('Response Data:', data); // Log the response for debugging
        return data;
    } catch (error) {
        console.error(`Error in ${apiPath}:`, error);
        throw error;
    }
}

