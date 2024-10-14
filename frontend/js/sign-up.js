document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    // Collect form data
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create the data object
    const formData = {
        name: name,
        surname: surname,
        email: email,
        password: password
    };

    try {
        // Load API paths from api_paths.json
        const response = await fetch('../../config/api_paths.json'); // Adjust the path if necessary
        const apiPaths = await response.json(); // Get the API paths

        const registerApi = apiPaths.register; // Get the register API path

        // Send the form data to the server via a POST request
        const registerResponse = await fetch(registerApi, { // Use dynamic API path
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Convert form data to JSON
        });

        const result = await registerResponse.json(); // Get the response data

        if (registerResponse.ok) {
            // Successful response
            alert(result.message || 'User signed up successfully!');
            // Redirect to login page
            window.location.href = 'login.html';
        } else {
            // Error response
            document.getElementById('errorMsg').textContent = result.message || 'Failed to sign up. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMsg').textContent = 'An error occurred. Please try again later.';
    }
});
