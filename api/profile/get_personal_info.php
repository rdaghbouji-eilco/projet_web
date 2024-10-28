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

// Handle GET request - fetch user's personal info
$query = "
    SELECT 
    pr.phone AS phone, 
    pr.birthdate AS birthdate, 
    c.country AS country
    FROM personal_info pr 
    LEFT JOIN countries c ON pr.country = c.ID
    WHERE user_ID = :user_ID";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_ID', $user_ID);
$stmt->execute();
$personalInfo = $stmt->fetch(PDO::FETCH_ASSOC);

if ($personalInfo) {
    echo json_encode($personalInfo);
} else {
    http_response_code(404); // Not Found
    echo json_encode(["message" => "Personal information not found"]);
}
?>
