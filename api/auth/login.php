<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Check if email and password are sent
if (!empty($data->email) && !empty($data->password)) {
    // Query to verify the user
    $query = "SELECT ID, email, password, role, name, surname FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if the user exists and if the password matches
    if ($user && password_verify($data->password, $user['password'])) {
        // Successful login, save user ID and role in the session
        $_SESSION['user'] = [
            'ID' => $user['ID'],
            'email' => $user['email'],
            'role' => $user['role'], // Add role to the session
            'name' => $user['name'], // Add name
            'surname' => $user['surname'] // Add surname
        ];
        http_response_code(200); // Success
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
