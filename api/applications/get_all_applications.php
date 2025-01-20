<?php
header("Access-Control-Allow-Origin: *"); // Autoriser les requêtes de n'importe quelle origine
header("Access-Control-Allow-Methods: GET"); // Méthodes autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés
header("Content-Type: application/json"); // Assurer le type de réponse JSON

include_once '../../config/db.php';
require '../../vendor/autoload.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

try {
    // Requête SQL pour récupérer toutes les applications avec les données associées
    $stmt = $db->prepare("
        SELECT 
            a.ID AS application_id, 
            a.application_date, 
            app_status.Application_status as application_status, 
            offer.position_name, 
            offer.entreprise_name,
            u.name AS applicant_name,
            u.surname AS applicant_surname, 
            u.email AS applicant_email
        FROM 
            applications a
        JOIN 
            job_offers offer ON a.offer_ID = offer.ID 
        JOIN 
            users u ON a.user_ID = u.ID 
        JOIN
            application_status app_status ON a.application_status = app_status.ID 
        ORDER BY 
            a.application_date DESC 
    ");
    $stmt->execute(); // Exécuter la requête
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retourner la réponse au format JSON
    echo json_encode(['status' => 'success', 'applications' => $applications]);
} catch (PDOException $e) {
    // Gérer les erreurs
    error_log($e->getMessage(), 0); // Enregistrer le message d'erreur
    http_response_code(500); // Répondre avec un code d'erreur 500
    echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue lors du traitement de votre demande.']);
}
?>
