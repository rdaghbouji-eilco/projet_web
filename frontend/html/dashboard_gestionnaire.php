<?php
require_once 'auth_guard.php'; // Vérifie la connexion utilisateur

// Vérification du rôle
if ($_SESSION['user']['role'] != 3) {
  header('Location: auth.html'); // Redirection si non autorisé
  exit();
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Gestionnaire</title>
  <link rel="stylesheet" href="../css/dashboard.css">
  <script src="../js/dashboard.js" type="module"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
  </style>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
  </style>

  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

  <link href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" rel="stylesheet" />
</head>

<body>
  <div class="sidebar">
    <h2>Espace Gestion</h2>
    <div class="logo-details">
      <i class='bx bxs-school' ></i>
      <span class="logo_name">EILCO</span>
    </div>

    <ul class="nav-links">
      <li>
        <a href="#" onclick="showSection('homeSection')">
          <i class="bx bx-grid-alt"></i>
          Accueil
        </a>
      </li>

      <li>
        <a href="#" onclick="showSection('offersSection')">
          <i class="bx bx-list-ul"></i>
          Gestion des Offres
        </a>
      </li>
      <li>
        <a href="#" onclick="showApplicationsSection()">
          <i class="bx bx-user"></i>
          Gestion des Candidatures
        </a>
      </li>      
    </ul>
  </div>

  <div class="content">
    <section id="homeSection" class="section">
      <nav>
        <img src="../../images/EILCO-LOGO-2022.png" alt="Logo EILCO" class="logo">
        <ul>
                <li><a href="menu_principal.php">Offres</a>
                </li>
                <li><a href="profile_page.php">Profil</a>
                </li>
                <li><a href="dashboard_gestionnaire.php">Espace de Gestion</a>
                </li>
                <li><a href="logout.php">Se déconnecter</a>
                </li>
        </ul>
      </nav>
      <div class="home-content">
        <div class="content-wrapper">
          <div class="cote_gauche">
            <div class="overview-boxes">
              <div class="box">
                <div class="right-side">
                  <div class="box-topic">Candidatures</div>
                  <div class="number">0</div>
                  <div class="indicator">
                    <i class="bx bx-up-arrow-alt"></i>
                    <span class="text">Depuis hier</span>
                  </div>
                </div>
                <i class='bx bx-user-plus cart'></i>
              </div>
              <div class="box">
                <div class="right-side">
                  <div class="box-topic">Offres publiées</div>
                  <div class="number">0</div>
                  <div class="indicator">
                    <i class="bx bx-up-arrow-alt"></i>
                    <span class="text">Depuis hier</span>
                  </div>
                </div>
                <i class="bx bxs-bell cart two"></i>
              </div>
              <div class="box">
                <div class="right-side">
                  <div class="box-topic">Entreprises</div>
                  <div class="number">0</div>
                  <div class="indicator">
                    <i class="bx bx-up-arrow-alt"></i>
                    <span class="text">Depuis hier</span>
                  </div>
                </div>
                <i class='bx bx-briefcase cart three'></i>
              </div>
            </div>
            <div class="section-graphiques">
              <div class="chart-container">
                <div class="chart-box">
                  <!--<h4>Évolution des Offres</h4>-->
                  <canvas id="evolutionLineChart"></canvas>
                </div>
                <div class="chart-box2">
                  <!--<h4>Offres par Statut</h4>-->
                  <canvas id="statusPieChart"></canvas>
                </div>
              </div>
              <div class="chart-container2">
                <div class="chart-box3">
                  <!--<h4>Évolution des Candidatures par Mois</h4>-->
                  <canvas id="applicationsLineChart"></canvas>
                </div>
                <div class="chart-box2">
                  <!--<h4>Candidatures par Statut</h4>-->
                  <canvas id="applicationsStatusChart"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div class="actions_recentes">
            <div class="offres_recentes box">
              <div class="title">Offres récentes</div>
              <div class="actions_details"></div>
            </div>
            <div class="candidatures_recentes box">
              <div class="title">Candidatures récentes</div>
              <div class="actions_details"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="offersSection" class="section">
      <nav>
        <div class="sidebar-button">
        <img src="../../images/EILCO-LOGO-2022.png" alt="Logo EILCO" class="logo">
        </div>
        <button class="add-offer-btn" onclick="showOfferForm()">Ajouter une offre</button>
      </nav>

      <div class="offers-page-container">
        <!-- Left Section: Table -->
        <div class="offers-table-container">
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th> </th>
                  <th>Nom du poste</th>
                  <th>Description</th>
                  <th>Date de publication</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- Rows will be dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Section: Form -->
        <div class="offer-form-container" id="offerFormModal" >
          <h3 id="offerFormTitle">Ajouter une offre</h3>
          <form id="offerForm">
            <label for="entreprise_name">Nom de l'entreprise </label>
            <input type="text" id="entreprise_name" name="entreprise_name" required><br><br>

            <label for="position_name">Nom du poste </label>
            <input type="text" id="position_name" name="position_name" required><br><br>

            <label for="description">Description </label>
            <textarea id="description" name="description" required></textarea><br><br>

            <label for="fieldDropdown">Domaine </label>
            <select id="fieldDropdown" name="field"></select><br><br>

            <label for="locationDropdown">Localisation </label>
            <select id="locationDropdown" name="location"></select><br><br>

            <label for="jobTypeDropdown">Type d'emploi </label>
            <select id="jobTypeDropdown" name="job_type"></select><br><br>

            <label for="duration">Durée </label>
            <select id="durationDropDown" name="duration" required></select><br><br>

            <label for="statusDropdown">Statut </label>
            <select id="statusDropdown" name="status"></select><br><br>

            <label for="experienceLevelDropdown">Niveau d'expérience </label>
            <select id="experienceLevelDropdown" name="experience_level"></select><br><br>

            <label for="educationLevelDropdown">Niveau d'éducation </label>
            <select id="educationLevelDropdown" name="education_level"></select><br><br>

            <label for="publish_date">Date de publication :/label>
            <input type="date" id="publish_date" name="publish_date" required><br><br>

            <input type="hidden" id="offer_id" name="offer_id">
            <button type="submit">Enregistrer</button>
          </form>
        </div>
      </div>
    </section>





    <section id="applicationsSection" class="section">
      <nav class="nav_candidatures">
      <img src="../../images/EILCO-LOGO-2022.png" alt="Logo EILCO" class="logo">
        <!-- Barre de recherche -->
        <div class="search-bar-container">
          <input 
            type="text" 
            id="searchBar" 
            placeholder="Rechercher une candidat" 
            onkeyup="filterApplications()">
            
            <i class='bx bx-search'></i>
        </div>
      </nav>
    
      <div class="applications-page-container">
        <!-- Liste des candidatures -->
        <div class="applications-list-container">
          <table class="custom-table">
            <thead>
              <tr>
                <th> </th>
                <th>Nom du Candidat</th>
                <th>Offre</th>
                <th>Date de Candidature</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="applicationsTableBody">
              <!-- Les lignes seront dynamiquement ajoutées -->
            </tbody>
          </table>
        </div>
      </div>
    </section>    
    
  </div>
  <div id="editApplicationModal" class="modal2" style="display: none;">
    <div class="modal-content">
      <h3>Modifier la Candidature</h3>
      <form id="editApplicationForm">
        <label for="applicationStatus">Statut de la Candidature</label>
        <select id="applicationStatus" name="applicationStatus">
          <option value=1>En attente</option>
          <option value=2>Acceptée</option>
          <option value=3>Refusée</option>
        </select>
        <div class="modal-btn">
          <button type="submit">Enregistrer</button>
          <button type="button" onclick="closeModal('editApplicationModal')">Annuler</button>
        </div>
      </form>
    </div>
  </div>
  
</body>

</html>