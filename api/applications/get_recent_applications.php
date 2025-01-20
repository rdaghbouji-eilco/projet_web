<?php
header("Access-Control-Allow-Origin: *"); // Autoriser les requêtes provenant de n'importe quelle origine
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Méthodes autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés
header("Content-Type: application/json"); // Assurer le type de réponse JSON

include_once '../../config/db.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

try {
    // Requête SQL pour récupérer les 5 applications les plus récentes avec les détails de l'offre et de l'utilisateur
    $stmt = $db->prepare("
        SELECT 
            a.ID AS application_id,
            a.application_date,
            aa.Application_status as application_status,
            o.position_name,
            o.entreprise_name,
            u.name AS applicant_name,
            u.surname AS applicant_surname,
            u.email AS applicant_email
        FROM 
            applications a
        JOIN 
            job_offers o ON a.offer_ID = o.ID
        JOIN 
            users u ON a.user_ID = u.ID
        JOIN
            application_status aa ON a.application_status=aa.ID
        ORDER BY 
            a.application_date DESC
        LIMIT 5
    ");
    $stmt->execute();
    
    // Récupérer tous les résultats
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Retourner la réponse au format JSON
    echo json_encode(['status' => 'success', 'recent_applications' => $applications]);
} catch (PDOException $e) {
    // Gérer les erreurs
    error_log($e->getMessage(), 0); // Enregistrer le message d'erreur
    http_response_code(500); // Répondre avec un code d'erreur 500
    echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue lors du traitement de votre demande.']);
}
?>
