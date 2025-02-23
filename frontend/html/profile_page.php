<?php
require_once 'auth_guard.php'; // Vérifie la connexion utilisateur
if (!isset($_SESSION['user'])) {
    header('Location: auth.html'); // Redirige vers la page d'authentification si non connecté
    exit();
}
$user = $_SESSION['user'];
$userRole = $user['role'];

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
    <title>Profile and Personal Information</title>
    <link rel="stylesheet" href="../css/profile_page.css">
    <script src="../js/api_loader.js"></script>
    <script defer src="../js/profile.js"></script>
    <script defer src="../js/update_personal_info.js"></script>
    <script defer src="../js/update_profile_pro.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Ubuntu:wght@300;400;500;700&display=swap');
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>

<body>
    <?php echo generateNavigation($userRole);?>

    <!-- Main Container -->
    <div class="container">
        <h1>Profile Page</h1>

        <!-- Layout setup for main and aside -->
        <div class="two-columns">
            <aside class="left-section">
                <div id="profileSection" class="box">
                    <div class="profile-header">
                        <img src="../../uploads/profile_pictures/profile-placeholder.png" id="profilePicture"
                            alt="Profile Picture" class="profile-image">
                        <div class="profile-info">
                            <p><strong></strong> <span id="name"></span></p>
                            <p><strong></strong> <span id="surname"></span></p>
                        </div>
                    </div>
                    <div class="profile-details">
                        <p><strong>Phone:</strong> <span id="phone"></span></p>
                        <p><strong>Birthdate:</strong> <span id="birthdate"></span></p>
                        <p><strong>Country:</strong> <span id="country"></span></p>
                        <button class="custom-button" aria-label="Update Personal Info"
                            id="update-info-btn">
                            Update Personal Info
                        </button>
                    </div>
                    <div>
                        <!-- Overlay background -->
                        <div id="overlay-info"></div>

                        <!-- Pop-up modal for profile form -->
                        <div id="popup-info" class="modal">
                            <button class="close-button" onclick="closeModal()">×</button>
                            <h3>Update Profile Information</h3>
                            <hr>
                            <form id="personalInfoForm" class="section" >
                                <!-- Phone Number -->
                                <label for="phone">Phone Number:</label>
                                <input type="text" id="form-phone" name="phone" required>
                        
                                <!-- Birthdate -->
                                <label for="birthdate">Birthdate:</label>
                                <input type="date" id="form-birthdate" name="birthdate" required>
                        
                                <!-- Country -->
                                <label for="country">Country:</label>
                                <select id="countryDropdown" name="country" required>
                                    <option value="">Select a country</option>
                                </select>
                        
                                <!-- Profile Picture Upload -->
                                <label for="profilePictureInput">Profile Picture:</label>
                                <input type="file" id="profilePictureInput" name="profile_picture" accept="image/*">
                        
                                <!-- Submit Button -->
                                <button type="submit" class="btn-submit">Update Information</button>
                                <p id="errorMessage" class="error-message"></p> <!-- Error message display -->
                            </form>
                        </div>
                    </div>
                </div>
            </aside>

            <main class="right-section">
                <!-- Personal Info Section -->
                
                <div id="personalInfoSection" class="box">
                    <h2>Personal Information</h2>
                    <p><strong>Education Level:</strong> <span id="educationLevel"></span></p>
                    <p><strong>Field:</strong> <span id="field"></span></p>
                    <p><strong>Current Situation:</strong> <span id="currentSituation"></span></p>
                    <p><strong>Experience Level:</strong> <span id="experienceLevel"></span></p>
                    <p><strong>Handicap:</strong> <span id="handicap"></span></p>
                    <p><strong>Current Degree:</strong> <span id="currentDegree"></span></p>
                    <p><strong>Expected Graduation Year:</strong> <span id="graduationYear"></span></p>
                    <button class="custom-button" aria-label="Update Profile" id="update-form-btn">
                        Update Profile
                    </button>
                </div>
                <div>
                    <!-- Overlay background -->
                    <div id="overlay-profile"></div>

                    <!-- Pop-up modal for profile form -->
                    <div id="popup-profile" class="modal" >
                        <button class="close-button" onclick="closeModal()">×</button>
                        <h3>Update Profile Information</h3>
                        <hr>
                        <form id="profileForm" class="section" >
                            <!-- Education Level -->
                            <label for="educationLevel">Niveau d'éducation :</label>
                            <select id="educationLevelDropdown" name="education_level" required>
                                <option value="">Sélectionnez un niveau d'éducation</option>
                            </select>

                            <!-- Field -->
                            <label for="field">Domaine :</label>
                            <select id="fieldDropdown" name="field" required>
                                <option value="">Sélectionnez un domaine</option>
                            </select>

                            <!-- Current Situation -->
                            <label for="currentSituation">Situation actuelle :</label>
                            <select id="currentSituationDropdown" name="current_situation" required>
                                <option value="">Sélectionnez une situation</option>
                                <option value="1">À la recherche d'emploi</option>
                                <option value="2">En poste</option>
                            </select>

                            <!-- Experience Level -->
                            <label for="experienceLevel">Niveau d'expérience :</label>
                            <select id="experienceLevelDropdown" name="experience_level" required>
                                <option value="">Sélectionnez un niveau d'expérience</option>
                            </select>

                            <!-- Handicap -->
                            <label for="handicap">Handicap :</label>
                            <select id="handicapDropdown" name="handicap" required>
                                <option value="">Sélectionnez une option</option>
                                <option value="1">Oui</option>
                                <option value="0">Non</option>
                            </select>

                            <!-- Current Degree -->
                            <label for="currentDegree">Diplôme actuel :</label>
                            <select id="currentDegreeDropdown" name="current_degree" required>
                                <option value="">Sélectionnez un diplôme</option>
                            </select>

                            <!-- Expected Graduation Year -->
                            <label for="graduationYear">Année de graduation prévue :</label>
                            <select id="graduationYearDropdown" name="expected_graduation_year" required>
                                <option value="">Sélectionnez une année</option>
                            </select>

                            <!-- Submit Button -->
                            <button type="submit" class="btn-submit">Soumettre</button>
                            <p id="errorMessage" class="error-message"></p>
                        </form>
                    </div>


                    <!-- CV Section -->
                    <div class="box" style="margin-top: 20px;">
                        <form id="cvSection">
                            <h2>CV</h2>
                            <p><strong>Download CV:</strong> <a id="cvDownloadLink" href="#" target="_blank">Download CV</a></p>
                            <label for="cv">Choose your CV (PDF, DOC, DOCX):</label>
                            <input type="file" id="cv" name="cv" accept=".pdf,.doc,.docx" required><br><br>
                            <button class="custom-button" type="submit">Upload CV</button>
                            <p id="uploadStatus"></p>
                        </form>
                    </div>
                    
                </div>
            </main>
        </div>
    </div>

    <div id="modal" class="modal" style="display: none;">
        <div class="modal-content">
            <span class="close-button" onclick="closeModal()">&times;</span>
            <div id="modal-form-content"></div>
        </div>
    </div>

    <!-- Footer Section -->
    <footer>
        <div class="premiere_partie">
            <div class="colonne">
                <ul>
                    <li>
                        <h4>Étudiants</h4>
                    </li>
                    <hr>
                    <li><a href="inscription_etudiant.html"> S'inscrire</a></li>
                    <li><a href="offres_etu.html"> Chercher une offre</a></li>
                    <li><a href="entreprises_etu.html"> Découvrir les entreprises</a></li>
                    <li><a href="evenements_etu.html"> Evénements de recrutement</a></li>
                    <li><a href="conseils_etu.html"> Conseils de recrutement</a></li>
                </ul>
            </div>
            <div class="colonne">
                <ul>
                    <li>
                        <h4>École</h4>
                    </li>
                    <hr>
                    <li><a href="offre_gestionnaire.html"> Le Career Center</a></li>
                    <li><a href="#"> XXXXXX</a></li>
                    <li><a href="#"> XXXXXX</a></li>
                    <li><a href="#"> XXXXXX</a></li>
                </ul>
            </div>
            <div class="colonne">
                <ul>
                    <li>
                        <h4>Contact</h4>
                    </li>
                    <hr>
                    <li><a href="#">À propos</a></li>
                    <li><a href="#"> EILCO – 50 Rue Ferdinand Buisson</a></li>
                    <li><a href="#"> CS 30613 – 62228 CALAIS CEDEX</a></li>
                    <li><a href="#"> Direction générale : Tél.: 03 21 17 10 05</a></li>
                </ul>
            </div>
            <div class="colonne">
                <ul>
                    <li>
                        <h4>Informations</h4>
                    </li>
                    <hr>
                    <li><a href="#"> Statut</a></li>
                    <li><a href="#"> Mentions légales</a></li>
                    <li><a href="#"> Politique de confidentialité</a></li>
                </ul>
            </div>
        </div>
        <hr>
        <div class="derniere_partie">
            <p>Tous droits réservés <a href="https://eilco.univ-littoral.fr/">EILCO</a> &copy; 2024 - Site d'orientation
                professionnelle</p>
        </div>
    </footer>


</body>

</html>