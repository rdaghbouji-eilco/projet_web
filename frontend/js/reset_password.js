document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    document.getElementById('resetToken').value = token; // Set the hidden token field

    document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const token = document.getElementById('resetToken').value;

        const formData = { password: password, token: token };

        try {
            // Load the API paths from api_paths.json
            const response = await fetch('../../config/api_paths.json'); // Adjust the path if necessary
            const apiPaths = await response.json(); // Get the API paths

            // Use the reset password API path from the loaded paths
            const resetPasswordApi = apiPaths.reset_password;

            // Send the reset password request
            const resetResponse = await fetch(resetPasswordApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await resetResponse.json();

            if (resetResponse.ok) {
                // Display success message
                document.getElementById('message').textContent = 'Password has been reset successfully!';

                // Add a link to the login page
                const loginLink = document.createElement('a');
                loginLink.href = 'login.html'; // Adjust the login page path if necessary
                loginLink.textContent = 'Click here to log in.';
                loginLink.style.display = 'block'; // Ensure the link is displayed as a block element

                // Append the login link after the success message
                document.getElementById('message').appendChild(loginLink);
            } else {
                document.getElementById('errorMsg').textContent = result.message || 'Failed to reset password.';
            }
        } catch (error) {
            document.getElementById('errorMsg').textContent = 'Error resetting password.';
        }
    });
});
