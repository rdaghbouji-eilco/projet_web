<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

// Fetch all countries from the database
$query = "SELECT * FROM durations";
$stmt = $db->prepare($query);
$stmt->execute();

$countries = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return countries as JSON
echo json_encode($countries);
?>