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
    $stmt = $db->prepare("SELECT COUNT(*) as total_offers FROM job_offers WHERE status = 1"); // Status = 1 pour "active"
    $stmt->execute();
    
    // Récupérer le résultat
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Retourner la réponse en JSON
    echo json_encode(['status' => 'success', 'total_offers' => $result['total_offers']]);
} catch (PDOException $e) {
    // En cas d'erreur, retourner un message d'erreur en JSON
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
