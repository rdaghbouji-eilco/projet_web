<?php
header("Access-Control-Allow-Origin: *"); // Autoriser les requêtes de n'importe quelle origine
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Méthodes autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés
header("Content-Type: application/json"); // Assurer le type de réponse JSON

include_once '../../config/db.php';

// Initialiser la connexion à la base de données
$database = new Database();
$db = $database->getConnection();

try {
    // Requête SQL pour récupérer les statuts et compter les offres associées
    $stmt = $db->prepare("
         SELECT 
            application_status.Application_status AS status_name,
            COUNT(applications.id) AS application_count
        FROM 
            applications
        JOIN 
            application_status
        ON 
            applications.application_status = application_status.id
        GROUP BY 
            application_status.Application_status; // Grouper par nom du statut de l'application
    ");

    $stmt->execute(); // Exécuter la requête
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC); // Récupérer tous les résultats

    // Retourner les résultats en JSON
    echo json_encode($results); // Encoder les résultats en JSON et les retourner
} catch (PDOException $e) {
    // Gérer les erreurs
    error_log($e->getMessage(), 0); // Enregistrer le message d'erreur
    http_response_code(500); // Répondre avec un code d'erreur 500
    echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue lors du traitement de votre demande.']);
}
?>