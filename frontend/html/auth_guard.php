<?php
session_start();

// Vérifie si l'utilisateur est connecté
if (!isset($_SESSION['user'])) {
    header('Location: auth.html'); // Redirige vers la page de connexion
    exit(); // Stoppe l'exécution du script
}
?>
