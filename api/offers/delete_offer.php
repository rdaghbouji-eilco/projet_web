<?php
// delete_offer.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

// Get the data from the request
$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(["message" => "Offer ID is required."]);
    exit();
}

$query = "DELETE FROM job_offers WHERE ID = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $data->id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Offer deleted (hard delete) successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to delete offer."]);
}

?>
