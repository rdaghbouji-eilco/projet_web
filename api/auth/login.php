<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Vérifier si l'email et le mot de passe sont envoyés
if (!empty($data->email) && !empty($data->password)) {
    // Requête pour vérifier l'utilisateur
    $query = "SELECT ID, email, password FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérifier si l'utilisateur existe et si le mot de passe correspond
    if ($user && password_verify($data->password, $user['password'])) {
        // Connexion réussie, enregistrer l'ID utilisateur dans la session
        $_SESSION['user_ID'] = $user['ID']; // Stocker l'ID utilisateur dans la session
        http_response_code(200); // Succès
        echo json_encode(["message" => "Connexion réussie"]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(["message" => "Email ou mot de passe incorrect"]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Données incomplètes"]);
}
?>
