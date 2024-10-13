<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

// Check if the user is logged in (session should be active)
if (!isset($_SESSION['user_ID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

$user_ID = $_SESSION['user_ID']; // Get the user ID from session

// Handle POST request - update user's personal info

$data = json_decode(file_get_contents("php://input"));

// Ensure all required fields are present
if (!empty($data->phone) && !empty($data->birthdate) && !empty($data->country)) {
    $query = "UPDATE personal_info SET phone = :phone, birthdate = :birthdate, country = :country WHERE user_ID = :user_ID";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_ID', $user_ID);
    $stmt->bindParam(':phone', $data->phone);
    $stmt->bindParam(':birthdate', $data->birthdate);
    $stmt->bindParam(':country', $data->country);

    // Execute the update query
    if ($stmt->execute()) {
        http_response_code(200); // OK
        echo json_encode(["message" => "Personal information updated successfully"]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Error updating personal information"]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Incomplete personal information"]);
}

echo json_encode(["message" => "Method not allowed"]);

?>
