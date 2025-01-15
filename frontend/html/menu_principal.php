<?php
require_once 'auth_guard.php'; // Vérifie la connexion utilisateur

// Récupération du rôle de l'utilisateur
$userRole = $_SESSION['user']['role'] ?? null;

// Inclusion de la navigation
$navigationPath = 'navigation.php';
if (file_exists($navigationPath)) {
    require_once $navigationPath;
} else {
    // Si `navigation.php` est manquant, affiche un message d'erreur pour le débogage
    echo "Erreur : le fichier navigation.php est introuvable.";
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title> EILCO | Offres de stage </title>
        <link rel="stylesheet" href="../css/menu_principal.css?v=1.0">
        <script type="module" src="../js/menu_principal.js?v=1.0.0"></script>
        
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
        </style>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
        
        <style>
            .material-symbols-outlined {
              font-variation-settings:
              'FILL' 0,
              'wght' 400,
              'GRAD' 0,
              'opsz' 24
            }
        </style>
    </head>

<body>
	<?php echo generateNavigation($userRole); ?>
    <div class="recherche">
        <div class="search-bar">
            <div class="search-container">
                <div class="search-field1">
                    <span class="material-symbols-outlined">search</span>
                    <input type="text" id="searchBar" class="search-input" placeholder="Rechercher par offre, entreprise ou mots-clé" oninput="filterOffers()">
                </div>
                <div class="search-field">
                    <span class="material-symbols-outlined">work</span>
                    <select id="jobType_bar" class="selection"></select>
                </div>
                <div class="search-field">
                    <span class="material-symbols-outlined">location_on</span>
                    <select id="location_bar" class="selection"></select>
                </div>
            </div>
            <button class="button-with-icon" id="open-filters-btn">
                <span class="material-symbols-outlined">filter_alt</span>
                <span class="button-text">Tous les filtres</span>
            </button>
        </div>
    </div>

    <!-- Overlay background -->
    <div id="overlay"></div>

    <!-- Fenêtre des filtres -->
    <div id="popup-filters" >
        <button class="close-button" onclick="closePopup()">×</button>
        <h3>Plus de critères</h3>
        <hr>
        <br>
        <div class="popup-content">
            <label for="duration">Durée du stage</label>
            <div id="duration" class="checkbox-group"></div>
        </div>
        <div class="popup-content">
            <label for="experience">Niveau d'expérience</label>
            <div id="experience" class="checkbox-group"></div>
        </div>
        <div class="popup-content">
            <label for="language">Langue</label>
            <select id="language" class="selection"></select>
        </div>
        <div class="popup-content">
            <label for="field">Domaine d'étude</label>
            <select id="field" class="selection"></select>
        </div>
        <div class="popup-content">
            <label for="educationLevel">Niveau d'étude</label>
            <div id="educationLevel" class="checkbox-group"></div>
        </div>
        <div class="popup-content">
            <label for="location">Localisation</label>
            <select id="location" class="selection"></select>
        </div>
        <div class="popup-content">
            <label for="startDate">Date de début</label>
            <input type="date" id="startDate" name="startDate">
        </div>
        <div class="popup-content">
            <label>Télétravail</label>
            <div id="telework" class="checkbox-group">
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="telework-hybrid" name="telework" value=3>
                    <label for="telework-hybrid">Hybride</label>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="telework-yes" name="telework" value=1>
                    <label for="telework-yes">Oui</label>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="telework-no" name="telework" value=2>
                    <label for="telework-no">Non</label>
                </div>
            </div>
        </div>
        <div class="popup-content">
            <label for="jobType">Type de contrat</label>
            <select id="jobType" class="selection"></select>
        </div>
        <div class="popup-content-btn">
            <button id="apply-filters" class="apply-filters-button">Appliquer les filtres</button>
        </div>
    </div>

    <main>
        <div class="offers-list" id="offersListContainer">
            <!-- This container will dynamically display all enterprise names using JS-->
        </div>

        <section id="offre" class="section" >
            <div class="retour">
                <button class="retour-button" onclick="handleRetourButtonClick() " ></button>
                <i class='bx bx-arrow-back'></i>
            </div>
            <div id="offerDetailsContainer" class="offer-details">
                <!-- Offer details will be populated here -->
            </div>
            
        </section>
    </main>

	<footer>
        
        <div class="premiere_partie">
            <div class="colonne">
                <ul>
                    <li><h4>Étudiants</h4>
                    </li>
                    <hr>
                    <li><a href="inscription_etudiant.html"> S'inscrire</a>
                    </li>
                    <li><a href="offres_etu.html"> Chercher une offre</a>
                    </li>
                    <li><a href="entreprises_etu.html"> Découvrir les entreprises</a>
                    </li>
                    <li><a href="evenements_etu.html"> Evénements de recrutement</a>
                    </li>
                    <li><a href="conseils_etu.html"> Conseils de recrutement</a>
                    </li>
                </ul>
            </div>
            <div class="colonne">
                <ul>
                    <li><h4>École</h4>
                    </li>
                    <hr>
                    <li><a href="offre_gestionnaire.html"> Le Career Center</a>
                    </li>
                    <li><a href=""> XXXXXX</a>
                    </li>
                    <li><a href=""> XXXXXX</a>
                    </li>
                    <li><a href=""> XXXXXX</a>
                    </li>
                </ul>
            </div>
            <div class="colonne">
                <ul>
                    <li><h4>Contact</h4>
                    </li>
                    <hr>
                    <li><a href="">À propos</a>
                    </li>
                    <li><a href=""> EILCO – 50 Rue Ferdinand Buisson</a>
                    </li>
                    <li><a href=""> CS 30613 – 62228 CALAIS CEDEX</a>
                    </li>
                    <li><a href=""> Direction générale : Tél.: 03 21 17 10 05</a>
                    </li>
                </ul> 
            </div>
            <div class="colonne">
                <ul>
                    <li><h4>Étudiants</h4>
                    </li>
                    <hr>
                    <li><a href=""> Statut</a>
                    </li>
                    <li><a href=""> Mentions légales</a>
                    </li>
                    <li><a href=""> Politique de confidentialité</a>
                    </li>
                </ul> 
            </div>
        </div>
        <hr>
        <div class="derniere_partie">
            <p>Tous droits réservés <a href="https://eilco.univ-littoral.fr/">EILCO</a> &copy; 2024 - Site d'orientation professionnelle </p>
        </div>  
    </footer>

	

</body>