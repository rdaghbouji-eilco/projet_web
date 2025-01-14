<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json"); // Ensure JSON response type


// Include database connection
include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

// Fetch all countries from the database
$query = "SELECT * FROM experience_levels";
$stmt = $db->prepare($query);
$stmt->execute();

$countries = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return countries as JSON
echo json_encode($countries);
?>