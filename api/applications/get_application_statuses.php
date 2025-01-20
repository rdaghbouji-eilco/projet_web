<?php
// En-têtes pour autoriser les requêtes CORS et la réponse JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

try {
    // Requête SQL pour compter les applications par statut
    $stmt = $db->prepare("
        // Statut de l'application
        SELECT 
            application_status, 
            // Nombre total d'applications pour chaque statut
            COUNT(*) AS total 
        FROM 
            applications
        // Grouper par statut de l'application
        GROUP BY 
            application_status 
        // Trier par nombre total décroissant
        ORDER BY 
            total DESC
            total DESC
    ");
    $stmt->execute(); // Exécuter la requête
    
    // Fetch all results
    $application_statuses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return the response in JSON format
    echo json_encode(['status' => 'success', 'application_statuses' => $application_statuses]);
} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
