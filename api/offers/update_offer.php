<?php
// update_offer.php

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

$query = "UPDATE job_offers 
          SET entreprise_name = :entreprise_name,
              position_name = :position_name,
              description = :description,
              field = :field,
              location = :location,
              job_type = :job_type,
              duration = :duration,
              status = :status,
              experience_level = :experience_level,
              education_level = :education_level,
              publish_date = :publish_date
          WHERE ID = :id";

$stmt = $db->prepare($query);

// Bind the parameters
$stmt->bindParam(':entreprise_name', $data->entreprise_name);
$stmt->bindParam(':position_name', $data->position_name);
$stmt->bindParam(':description', $data->description);
$stmt->bindParam(':field', $data->field);
$stmt->bindParam(':location', $data->location);
$stmt->bindParam(':job_type', $data->job_type);
$stmt->bindParam(':duration', $data->duration);
$stmt->bindParam(':status', $data->status);
$stmt->bindParam(':experience_level', $data->experience_level);
$stmt->bindParam(':education_level', $data->education_level);
$stmt->bindParam(':publish_date', $data->publish_date);
$stmt->bindParam(':id', $data->id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Offer updated successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update offer."]);
}
?>
