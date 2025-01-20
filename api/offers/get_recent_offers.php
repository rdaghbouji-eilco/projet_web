<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json"); // Ensure JSON response type


include_once '../../config/db.php';

// Connect to the database
$database = new Database();
$db = $database->getConnection();

try {
    // Préparer et exécuter la requête SQL
    $stmt = $db->prepare("SELECT ID, entreprise_name, position_name, publish_date FROM job_offers WHERE status = 1 ORDER BY publish_date DESC LIMIT 5"); // Status = 1 pour "active"
    $stmt->execute();
    
    // Récupérer tous les résultats (plusieurs lignes)
    $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Retourner la réponse en JSON
    echo json_encode(['status' => 'success', 'recent_offers' => $offers]);
} catch (PDOException $e) {
    // Gérer les erreurs
    error_log($e->getMessage(), 0); // Enregistrer le message d'erreur
    http_response_code(500); // Répondre avec un code d'erreur 500
    echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue lors du traitement de votre demande.']);
}
?>
