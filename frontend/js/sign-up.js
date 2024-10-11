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
        // Send the form data to the server via a POST request
        const response = await fetch('http://localhost/projet_web/api/user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json(); // Get the response data

        if (response.ok) {
            // Successful response
            alert(result.message || 'User signed up successfully!');
        } else {
            // Error response
            alert(result.message || 'Failed to sign up. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});
