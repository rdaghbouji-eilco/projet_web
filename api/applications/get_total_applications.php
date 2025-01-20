<?php
header("Access-Control-Allow-Origin: *"); // Autoriser les requêtes provenant de n'importe quelle origine
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Méthodes autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés
header("Content-Type: application/json"); // Assurer le type de réponse JSON

include_once '../../config/db.php';

// Se connecter à la base de données
$database = new Database();
$db = $database->getConnection();

try {
    // Préparer et exécuter la requête SQL
    $stmt = $db->prepare("SELECT COUNT(*) as total_applications FROM applications"); // Status = 1 pour "active"
    $stmt->execute();
    
    // Récupérer le résultat
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Retourner la réponse en JSON
    echo json_encode(['status' => 'success', 'total_applications' => $result['total_applications']]);
} catch (PDOException $e) {
    // Gérer les erreurs
    error_log($e->getMessage(), 0); // Enregistrer le message d'erreur
    http_response_code(500); // Répondre avec un code d'erreur 500
    echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue lors du traitement de votre demande.']);
}
?>
