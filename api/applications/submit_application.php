<?php
// submit_application.php

// Headers for allowing CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/db.php';

// Start the session to access session variables
session_start();

// Connect to the database
$database = new Database();
$db = $database->getConnection();

// Check if user_ID is set in the session
if (!isset($_SESSION['user']['ID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("message" => "User not authenticated."));
    exit;
}

// Get the user_ID from the session
$user_ID = $_SESSION['user']['ID'];

// Get the input data
$data = json_decode(file_get_contents("php://input"));

// Validate input data
if (!empty($data->offer_ID)) {
    // Prepare the SQL query to insert the application
    $query = "
        INSERT INTO applications (offer_ID, user_ID, application_date, application_status)
        VALUES (:offer_ID, :user_ID, NOW(), :application_status)
    ";

    $stmt = $db->prepare($query);

    // Bind the parameters
    $stmt->bindParam(":offer_ID", $data->offer_ID);
    $stmt->bindParam(":user_ID", $user_ID); // Use user_ID from session
    $stmt->bindParam(":application_status", $application_status);

    // Default application status (e.g., "pending")
    $application_status = 1;

    // Execute the query
    if ($stmt->execute()) {
        // HTTP 201 Created response
        http_response_code(201);
        echo json_encode(array("message" => "Application submitted successfully."));
    } else {
        // HTTP 500 Internal Server Error response
        http_response_code(500);
        echo json_encode(array("message" => "Unable to submit the application."));
    }
} else {
    // HTTP 400 Bad Request response for missing data
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. offer_ID is required."));
}
?>
