<?php
// add_offer.php

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json"); // Ensure JSON response type


include_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Vérification des champs obligatoires
if (
    !empty($data->entreprise_name) &&
    !empty($data->position_name) &&
    !empty($data->description) &&
    !empty($data->field) &&
    !empty($data->location) &&
    !empty($data->job_type) &&
    !empty($data->duration) &&
    !empty($data->publish_date) &&
    isset($data->status) &&  // Le statut peut être 0, donc on utilise isset
    !empty($data->experience_level) &&
    !empty($data->education_level)
) {
    // Requête SQL pour insérer l'offre d'emploi
    $query = "INSERT INTO job_offers (
                entreprise_name, 
                position_name, 
                description, 
                field, 
                location, 
                job_type, 
                duration, 
                publish_date, 
                status, 
                experience_level, 
                education_level
            ) VALUES (
                :entreprise_name, 
                :position_name, 
                :description, 
                :field, 
                :location, 
                :job_type, 
                :duration, 
                :publish_date, 
                :status, 
                :experience_level, 
                :education_level
            )";

    $stmt = $db->prepare($query);

    // Liaison des paramètres
    $stmt->bindParam(':entreprise_name', $data->entreprise_name);
    $stmt->bindParam(':position_name', $data->position_name);
    $stmt->bindParam(':description', $data->description);
    $stmt->bindParam(':field', $data->field);
    $stmt->bindParam(':location', $data->location);
    $stmt->bindParam(':job_type', $data->job_type);
    $stmt->bindParam(':duration', $data->duration);
    $stmt->bindParam(':publish_date', $data->publish_date);
    $stmt->bindParam(':status', $data->status);
    $stmt->bindParam(':experience_level', $data->experience_level);
    $stmt->bindParam(':education_level', $data->education_level);

    // Exécution de la requête
    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(array("message" => "Offer added successfully."));
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("message" => "Failed to add the offer."));
    }
} else {
    // Erreur 400 (Bad Request) si des champs obligatoires sont manquants
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. Please provide all required fields."));
}
?>
