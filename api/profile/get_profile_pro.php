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

// Fetch user's profile with joins to related tables
$query = "
    SELECT 
        el.education_level AS education_level,
        f.field_name AS field,
        s.situation_label AS current_situation,
        ex.experience_level AS experience_level,
        CASE WHEN p.handicap = 1 THEN 'Yes' ELSE 'No' END AS handicap,
        cd.degree_name AS current_degree,
        egr.year AS expected_graduation_year
    FROM profile_pro p
    LEFT JOIN education_levels el ON p.education_level = el.ID
    LEFT JOIN fields f ON p.field = f.ID
    LEFT JOIN situations s ON p.current_situation = s.ID
    LEFT JOIN experience_levels ex ON p.experience_level = ex.ID
    LEFT JOIN current_degree cd ON p.current_degree = cd.ID
    LEFT JOIN expected_graduation_year egr ON p.expected_graduation_year = egr.ID
    WHERE p.user_ID = :user_ID";

$stmt = $db->prepare($query);
$stmt->bindParam(':user_ID', $user_ID);
$stmt->execute();
$profile = $stmt->fetch(PDO::FETCH_ASSOC);

if ($profile) {
    echo json_encode($profile);
} else {
    http_response_code(404); // Not Found
    echo json_encode(["message" => "Profile not found"]);
}
?>
