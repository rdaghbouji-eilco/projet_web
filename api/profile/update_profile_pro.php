<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

$data = json_decode(file_get_contents("php://input"));

// Ensure all required fields are present
if (!empty($data->education_level) && !empty($data->field) && isset($data->current_situation) && !empty($data->experience_level) && isset($data->handicap) && !empty($data->current_degree) && !empty($data->expected_graduation_year)) {

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

    // Bind parameters
    $stmt->bindParam(':education_level', $data->education_level);
    $stmt->bindParam(':field', $data->field);
    $stmt->bindParam(':current_situation', $data->current_situation);
    $stmt->bindParam(':experience_level', $data->experience_level);
    $stmt->bindParam(':handicap', $data->handicap);
    $stmt->bindParam(':current_degree', $data->current_degree);
    $stmt->bindParam(':expected_graduation_year', $data->expected_graduation_year);
    $stmt->bindParam(':user_ID', $user_ID);

    // Execute the query
    if ($stmt->execute()) {
        http_response_code(200); // OK
        echo json_encode(["message" => "Profile updated successfully"]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Error updating profile"]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Incomplete profile data"]);
}

?>
