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

// Validate Email Format
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Validate Password Length
function validatePassword(password) {
    return password.length >= 6;  // Minimum length of 6 characters
}

// Handle Sign-Up Form Submission with validation
document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('signUpEmail').value,
        surname: document.getElementById('lastName').value,
        name: document.getElementById('firstName').value,
        password: document.getElementById('signUpPassword').value
    };
    
    // Validate inputs
    if (!validateEmail(formData.email)) {
        document.getElementById('signUpErrorMsg').textContent = 'Veuillez entrer un email valide.';
        return;
    }
    
    if (!validatePassword(formData.password)) {
        document.getElementById('signUpErrorMsg').textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
        return;
    }

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

// Handle Login Form Submission with validation
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const loginData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    // Validate inputs
    if (!validateEmail(loginData.email)) {
        document.getElementById('loginErrorMsg').textContent = 'Veuillez entrer un email valide.';
        return;
    }
    
    if (!validatePassword(loginData.password)) {
        document.getElementById('loginErrorMsg').textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
        return;
    }

    try {
        const response = await fetch(apiPaths.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginData)
        });
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response JSON:', result);

        if (response.ok) {
            window.location.href = 'menu_principal.php';
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
