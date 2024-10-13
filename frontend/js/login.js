// Wait for the DOM to fully load
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create the login data object
    const loginData = {
        email: email,
        password: password
    };

    try {
        // Load the API paths before using them
        const response = await fetch('../config/api_paths.json'); // Adjust the path if necessary
        const apiPaths = await response.json(); // Get the API paths
        
        // Access the login API path
        const loginApi = apiPaths.login;

        // Send the POST request to the login API
        const loginResponse = await fetch(loginApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include session cookies
            body: JSON.stringify(loginData) // Convert the login data to JSON
        });

        // Log the full response to see its contents
        const responseText = await loginResponse.text(); // Get the response text
        console.log('Server Response:', responseText);

        // Check if the response is JSON
        if (loginResponse.headers.get('Content-Type')?.includes('application/json')) {
            const result = JSON.parse(responseText); // Parse the JSON

            if (loginResponse.ok) {
                // If login is successful, redirect to the profile page
                window.location.href = 'profile.html';
            } else {
                // Display an error message if login fails
                document.getElementById('errorMsg').textContent = result.message;
            }
        } else {
            // If not JSON, print the error message from the server
            document.getElementById('errorMsg').textContent = 'Unexpected response from the server.';
            console.error('Expected JSON, but got:', responseText);
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        document.getElementById('errorMsg').textContent = 'Une erreur est survenue. Veuillez réessayer.';
    }
});
