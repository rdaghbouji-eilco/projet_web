let apiPaths = {};

// Charger les chemins de l'API
async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json');
        if (!response.ok) {
            throw new Error('Échec du chargement des chemins de l\'API');
        }
        apiPaths = await response.json();
        console.log('Chemins de l\'API chargés avec succès:', apiPaths);
    } catch (error) {
        console.error('Erreur lors du chargement des chemins de l\'API:', error);
    }
}

// Afficher une section spécifique
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// Gérer la soumission du formulaire d'inscription
document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('signUpEmail').value,
        surname: document.getElementById('lastName').value,
        name: document.getElementById('firstName').value,
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
            showSection('formulaire_connexion'); // Passer à la section de connexion
        } else {
            document.getElementById('signUpErrorMsg').textContent = result.message || 'Échec de l\'inscription.';
        }
    } catch (error) {
        document.getElementById('signUpErrorMsg').textContent = 'Erreur lors de l\'inscription.';
        console.error('Erreur d\'inscription:', error);
    }
});

// Gérer la soumission du formulaire de connexion
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
        console.log('Statut de la réponse:', response.status);
        const result = await response.json();
        console.log('Réponse JSON:', result);
    
        if (response.ok) {
            window.location.href = 'menu_principal.php'; // Rediriger vers le menu principal
        } else {
            document.getElementById('loginErrorMsg').textContent = result.message || 'Échec de la connexion.';
        }
    } catch (error) {
        document.getElementById('loginErrorMsg').textContent = 'Erreur lors de la connexion.';
        console.error('Erreur de connexion:', error);
    }
});

// Initialiser les chemins de l'API et définir la vue par défaut
window.onload = async function() {
    await loadApiPaths();
    showSection('formulaire_inscription'); // Afficher l'inscription comme vue par défaut
};
