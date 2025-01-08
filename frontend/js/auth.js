let apiPaths = {};

// Load API paths
async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json');
        if (!response.ok) {
            throw new Error('Failed to load API paths');
        }
        apiPaths = await response.json();
        console.log('API paths loaded successfully:', apiPaths);
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// Handle Sign-Up Form Submission
document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('signUpEmail').value,
        surname: document.getElementById('lastName').value, // Change `lastName` to `surname`
        name: document.getElementById('firstName').value,   // Change `firstName` to `name`
        password: document.getElementById('signUpPassword').value
    };
    

    try {
        const response = await fetch(apiPaths.register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (response.ok) {
            alert(result.message || 'Inscription réussie !');
            showSection('formulaire_connexion'); // Switch to the login section
        } else {
            document.getElementById('signUpErrorMsg').textContent = result.message || 'Échec de l\'inscription.';
        }
    } catch (error) {
        document.getElementById('signUpErrorMsg').textContent = 'Erreur lors de l\'inscription.';
        console.error('Sign-up error:', error);
    }
});

// Handle Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const loginData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(apiPaths.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginData)
        });
        const result = await response.json();

        if (response.ok) {
            window.location.href = 'profile_page.html';
        } else {
            document.getElementById('loginErrorMsg').textContent = result.message || 'Échec de la connexion.';
        }
    } catch (error) {
        document.getElementById('loginErrorMsg').textContent = 'Erreur lors de la connexion.';
        console.error('Login error:', error);
    }
});

// Initialize API paths and set the default view
window.onload = async function() {
    await loadApiPaths();
    showSection('formulaire_inscription'); // Show Inscription as the default view
};
