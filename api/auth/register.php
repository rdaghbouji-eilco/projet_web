<?php
// Start session
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->name) || empty($data->email) || empty($data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'name, surname, email, and password are required']);
    exit();
}

$query = "INSERT INTO users (name, surname, email, password, role) VALUES (:name, :surname, :email, :password, :role)";
$stmt = $db->prepare($query);

$hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
$role = 2; // Default role is 2 (user)

$stmt->bindParam(':name', $data->name);
$stmt->bindParam(':surname', $data->surname);
$stmt->bindParam(':email', $data->email);
$stmt->bindParam(':role', $role);
$stmt->bindParam(':password', $hashed_password);

if ($stmt->execute()) {
    // Get the ID of the newly created user
    $userId = $db->lastInsertId();

    // Automatically create an empty profile for the user
    createEmptyProfile($db, $userId);

    http_response_code(201); // Created
    echo json_encode(['message' => 'User created successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error']);
}

function createEmptyProfile($db, $userId) {
    // Insert an empty profile for the new user
    $query = "INSERT INTO profile_pro (user_ID, education_level, field, current_situation, experience_level, handicap, current_degree, expected_graduation_year)
              VALUES (:user_id, NULL, NULL, NULL, NULL, 0, NULL, NULL)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);

    // Execute query
    if (!$stmt->execute()) {
        echo json_encode(["message" => "Error creating empty profile"]);
    }

     // Insert an empty row into personal_info for the new user
     $query2 = "INSERT INTO personal_info (user_ID, phone, birthdate, country) VALUES (:user_id, NULL, NULL, NULL)";
    
     $stmt2 = $db->prepare($query2);
     $stmt2->bindParam(':user_id', $userId);
 
     // Execute second query
     if (!$stmt2->execute()) {
         echo json_encode(["message" => "Error creating empty personal info"]);
     }
}
?>
