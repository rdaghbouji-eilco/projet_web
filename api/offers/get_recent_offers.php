<?php
// Headers for allowing CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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
    // En cas d'erreur, retourner un message d'erreur en JSON
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
