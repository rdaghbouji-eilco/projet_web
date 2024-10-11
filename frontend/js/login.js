document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêcher l'envoi classique du formulaire

    // Récupérer les valeurs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Créer un objet avec les données de connexion
    const loginData = {
        email: email,
        password: password
    };

    try {
        // Envoyer les données en POST vers l'API de connexion (login.php)
        const response = await fetch('http://localhost/projet_web/api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData) // Convertir en JSON
        });

        const result = await response.json(); // Récupérer la réponse

        if (response.ok) {
            // Si la connexion réussit, rediriger vers la page du profil
            window.location.href = 'profile_pro.html';
        } else {
            // Afficher un message d'erreur si la connexion échoue
            document.getElementById('errorMsg').textContent = result.message;
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        document.getElementById('errorMsg').textContent = 'Une erreur est survenue. Veuillez réessayer.';
    }
});
