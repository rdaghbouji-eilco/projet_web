<?php
// get_offers.php

// Headers pour autoriser les requêtes CORS et JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

// Requête SQL pour récupérer les offres d'emploi
$query = "SELECT 
            ID, 
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
          FROM job_offers";
$stmt = $db->prepare($query);
$stmt->execute();

// Vérification si des offres sont trouvées
if ($stmt->rowCount() > 0) {
    $offersArr = array();

    // Boucle à travers les résultats
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $offerItem = array(
            "id" => $ID,
            "entreprise_name" => $entreprise_name,
            "position_name" => $position_name,
            "description" => $description,
            "field" => $field,
            "location" => $location,
            "job_type" => $job_type,
            "duration" => $duration,
            "publish_date" => $publish_date,
            "status" => $status,
            "experience_level" => $experience_level,
            "education_level" => $education_level
        );

        array_push($offersArr, $offerItem);
    }

    // Réponse HTTP 200 OK
    http_response_code(200);
    echo json_encode($offersArr);

} else {
    // Aucun résultat trouvé
    http_response_code(404);
    echo json_encode(array("message" => "No job offers found."));
}
?>
