console.log("JS chargé"); // Pour vérifier que le fichier JS est bien chargé

// Fonction pour peupler les dropdowns avec des données de l'API
async function populateDropdown(apiUrl, dropdownId, dataKey, defaultOption = 'Sélectionnez...') {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
        }

        const data = await response.json();
        const dropdown = document.getElementById(dropdownId);

        // Vider le dropdown avant de le remplir
        dropdown.innerHTML = '';

        // Ajouter une option par défaut
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = defaultOption;
        dropdown.appendChild(defaultOpt);

        // Peupler le dropdown avec les données de l'API
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID; // Suppose que l'API renvoie un champ ID
            option.textContent = item[dataKey]; // Utiliser la clé de l'objet correspondant à l'API
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error(`Erreur pour ${dropdownId}:`, error);
        document.getElementById('errorMessage').textContent = `Erreur pour ${dropdownId}: ${error.message}`;
    }
}

// Appeler la fonction pour chaque dropdown
window.onload = async function() {
    await populateDropdown('http://localhost/projet_web/api/education_levels.php', 'educationLevelDropdown', 'education_level', 'Sélectionnez un niveau d\'éducation');
    await populateDropdown('http://localhost/projet_web/api/fields.php', 'fieldDropdown', 'field_name', 'Sélectionnez un domaine');
    await populateDropdown('http://localhost/projet_web/api/experience_levels.php', 'experienceLevelDropdown', 'experience_level', 'Sélectionnez un niveau d\'expérience');
    await populateDropdown('http://localhost/projet_web/api/current_degree.php', 'currentDegreeDropdown', 'degree_name', 'Sélectionnez un diplôme actuel');
    await populateDropdown('http://localhost/projet_web/api/expected_graduation_year.php', 'graduationYearDropdown', 'year', 'Sélectionnez une année');
};

// Gérer la soumission du formulaire
document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission classique du formulaire
    
    console.log("Formulaire soumis"); // Vérification du déclenchement de la soumission

    // Récupérer les données du formulaire
    const formData = {
        education_level: document.getElementById('educationLevelDropdown').value,
        field: document.getElementById('fieldDropdown').value,
        current_situation: document.getElementById('currentSituationDropdown').value,
        experience_level: document.getElementById('experienceLevelDropdown').value,
        handicap: document.getElementById('handicapDropdown').value,
        current_degree: document.getElementById('currentDegreeDropdown').value,
        expected_graduation_year: document.getElementById('graduationYearDropdown').value
    };

    // Afficher les données dans la console pour vérifier
    console.log("Données du formulaire :", formData);

    try {
        const response = await fetch('http://localhost/projet_web/api/profile_pro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Envoyer les données en JSON
        });

        // Vérifier la réponse du serveur
        const result = await response.json();
        console.log("Réponse du serveur :", result);

        if (response.ok) {
            alert('Profil mis à jour avec succès !');
        } else {
            throw new Error(result.message || 'Erreur inconnue');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        document.getElementById('errorMessage').textContent = `Erreur: ${error.message}`;
    }
});
