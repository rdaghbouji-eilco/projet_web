<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';
$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    handlePost($db);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}

function handlePost($db) {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->name) && !empty($data->surname) && !empty($data->email) && !empty($data->password)) {
        // First, check if the email already exists
        $query = "SELECT COUNT(*) as count FROM users WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['count'] > 0) {
            // Email already exists, return error message
            http_response_code(400);
            echo json_encode(["message" => "Email already exists"]);
        } else {
            // Email doesn't exist, proceed with inserting the user
            $query = "INSERT INTO users (name, surname, email, password) VALUES (:name, :surname, :email, :password)";
            $stmt = $db->prepare($query);

            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':surname', $data->surname);
            $stmt->bindParam(':email', $data->email);
            $passwordHash = password_hash($data->password, PASSWORD_DEFAULT);
            $stmt->bindParam(':password', $passwordHash);

            if ($stmt->execute()) {
                // Get the ID of the newly created user
                $userId = $db->lastInsertId();

                // Automatically create an empty profile for the user
                createEmptyProfile($db, $userId);

                http_response_code(201);
                echo json_encode(["message" => "User and profile created successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Unable to create user"]);
            }
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Incomplete data"]);
    }
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
}
?>
