<?php
session_start();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json"); // Ensure JSON response type


include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

// Check if the user is logged in (session should be active)
if (!isset($_SESSION['user']['ID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

$user_ID = $_SESSION['user']['ID']; // Get the user ID from session

// Handle GET request - fetch user's personal info and profile picture
$query = "
    SELECT 
        pr.phone AS phone, 
        pr.birthdate AS birthdate, 
        c.country AS country,
        pr.profile_picture AS profile_picture
    FROM personal_info pr 
    LEFT JOIN countries c ON pr.country = c.ID
    WHERE pr.user_ID = :user_ID";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_ID', $user_ID);
$stmt->execute();
$personalInfo = $stmt->fetch(PDO::FETCH_ASSOC);

if ($personalInfo) {
    // Add the full path to the profile picture if it exists
    if ($personalInfo['profile_picture']) {
        $personalInfo['profile_picture_url'] = "../../uploads/profile_pictures/" . $personalInfo['profile_picture'];
    } else {
        $personalInfo['profile_picture_url'] = null; // Default to null if no picture is set
    }
    
    echo json_encode($personalInfo);
} else {
    http_response_code(404); // Not Found
    echo json_encode(["message" => "Personal information not found"]);
}
?>
