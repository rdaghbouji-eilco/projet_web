document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const formData = { email: email };

    try {
        // Load the API paths before using them
        const response = await fetch('../../config/api_paths.json'); // Adjust the path if necessary
        const apiPaths = await response.json(); // Get the API paths
        
        // Access the forgot password API path
        const forgotPasswordApi = apiPaths.forgot_password;

        const forgotPasswordResponse = await fetch(forgotPasswordApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await forgotPasswordResponse.json(); // Parse the response JSON

        if (forgotPasswordResponse.ok) {
            // Success case: Display success message
            document.getElementById('message').textContent = 'Password reset link sent to your email!';
        } else {
            // Error case: Display the error message from server
            document.getElementById('errorMsg').textContent = result.message || 'Failed to send reset link.';
        }
    } catch (error) {
        // Catch and display any other error
        document.getElementById('errorMsg').textContent = error.message;
    }
});
