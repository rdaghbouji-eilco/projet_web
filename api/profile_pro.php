<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';
$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    // Vérifie les données reçues par le serveur
    error_log("Données reçues par le serveur : " . print_r($data, true));

    // Vérifier si la session existe (l'utilisateur est connecté)
    if (!isset($_SESSION['user_ID'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(["message" => "Utilisateur non connecté"]);
        exit();
    }

    $user_ID = $_SESSION['user_ID']; // Récupérer l'ID de l'utilisateur connecté depuis la session

    // Afficher les données reçues pour vérification
    error_log(print_r($data, true));

    // Si des données de profil sont envoyées, on met à jour le profil
    if (!empty($data->education_level) && !empty($data->field) && !empty($data->current_situation) && !empty($data->experience_level)) {
        // Préparer la requête pour mettre à jour les données du profil
        $query = "UPDATE profile_pro SET 
                  education_level = :education_level, 
                  field = :field, 
                  current_situation = :current_situation, 
                  experience_level = :experience_level, 
                  handicap = :handicap, 
                  current_degree = :current_degree, 
                  expected_graduation_year = :expected_graduation_year 
                  WHERE user_ID = :user_ID";

        $stmt = $db->prepare($query);

        // Lier les paramètres
        $stmt->bindParam(':user_ID', $user_ID);
        $stmt->bindParam(':education_level', $data->education_level);
        $stmt->bindParam(':field', $data->field);
        $stmt->bindParam(':current_situation', $data->current_situation);
        $stmt->bindParam(':experience_level', $data->experience_level);
        $stmt->bindParam(':handicap', $data->handicap);
        $stmt->bindParam(':current_degree', $data->current_degree);
        $stmt->bindParam(':expected_graduation_year', $data->expected_graduation_year);

        // Exécuter la requête
        if ($stmt->execute()) {
            http_response_code(200); // OK
            echo json_encode(["message" => "Profil mis à jour avec succès"]);
        } else {
            http_response_code(500); // Erreur interne
            echo json_encode(["message" => "Erreur lors de la mise à jour du profil"]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Données du profil incomplètes"]);
    }
} else if ($method === 'GET') {
    // Si la méthode est GET, on retourne les données du profil de l'utilisateur connecté
    if (!isset($_SESSION['user_ID'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(["message" => "Utilisateur non connecté"]);
        exit();
    }

    $user_ID = $_SESSION['user_ID'];

    // Récupérer les informations du profil utilisateur
    $query = "SELECT * FROM profile_pro WHERE user_ID = :user_ID";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_ID', $user_ID);
    $stmt->execute();
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($profile) {
        echo json_encode($profile); // Retourner les données du profil
    } else {
        http_response_code(404); // Profil non trouvé
        echo json_encode(["message" => "Profil non trouvé"]);
    }
} else {
    http_response_code(405); // Méthode non autorisée
    echo json_encode(["message" => "Méthode non autorisée"]);
}
?>
