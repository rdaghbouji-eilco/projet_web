<?php
function generateNavigation($userRole)
{
    // Initialisation de la liste HTML
    $html = '<header>
        <a href="menu_principal.php">
            <img src="../../images/EILCO-LOGO-2022.png" alt="Logo EILCO" class="logo">
        </a>
        <ul>';
        

    // Liens visibles par tous
    $html .= '<li><a href="menu_principal.php">Offres</a></li>';
    $html .= '<li><a href="profile_page.php">Profil</a></li>';

    // Lien spécifique pour les gestionnaires
    if ($userRole == 3) {
        $html .= '<li><a href="dashboard_gestionnaire.php">Tableau de bord Gestionnaire</a></li>';
    }

    // Gestion de l'état de connexion
    if ($userRole !== null) {
        $html .= '<li><a href="logout.php">Se déconnecter</a></li>';
    } else {
        $html .= '<li><a href="auth.html">Connexion</a></li>';
    }

    // Clôture des balises HTML
    $html .= '</ul>
    </header>';

    return $html;
}
?>
