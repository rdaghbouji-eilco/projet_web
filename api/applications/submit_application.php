<?php
// En-têtes pour permettre CORS et réponse JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/db.php';

// Démarrer la session pour accéder aux variables de session
session_start();

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

// Vérifier si user_ID est défini dans la session
if (!isset($_SESSION['user']['ID'])) {
    http_response_code(401); // Non autorisé
    echo json_encode(array("message" => "Utilisateur non authentifié."));
    exit;
}

// Obtenir user_ID de la session
$user_ID = $_SESSION['user']['ID'];

// Obtenir les données d'entrée
$data = json_decode(file_get_contents("php://input"));

// Valider les données d'entrée
if (!empty($data->offer_ID)) {
    // Préparer la requête SQL pour insérer la candidature
    $query = "
        INSERT INTO applications (offer_ID, user_ID, application_date, application_status)
        VALUES (:offer_ID, :user_ID, NOW(), :application_status)
    ";

    $stmt = $db->prepare($query);

    // Lier les paramètres
    $stmt->bindParam(":offer_ID", $data->offer_ID);
    $stmt->bindParam(":user_ID", $user_ID); // Utiliser user_ID de la session
    $stmt->bindParam(":application_status", $application_status);

    // Statut de candidature par défaut (par exemple, "en attente")
    $application_status = 1;

    // Exécuter la requête
    if ($stmt->execute()) {
        // Réponse HTTP 201 Created
        http_response_code(201);
        echo json_encode(array("message" => "Candidature soumise avec succès."));
    } else {
        // Réponse HTTP 500 Internal Server Error
        http_response_code(500);
        echo json_encode(array("message" => "Impossible de soumettre la candidature."));
    }
} else {
    // Réponse HTTP 400 Bad Request pour données manquantes
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes. offer_ID est requis."));
}
?>
