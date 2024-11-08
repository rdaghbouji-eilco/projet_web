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
$query = "
        SELECT 
            jo.entreprise_name AS entreprise_name, 
            jo.position_name AS position_name, 
            jo.description AS description, 
            f.field_name AS field, 
            l.location AS location, 
            jt.job_type AS job_type, 
            d.Duration AS duration, 
            jo.publish_date AS publish_date, 
            jo.status AS status, 
            exp.experience_level AS experience_level, 
            el.education_level AS education_level
        FROM job_offers jo 
        LEFT JOIN fields f ON jo.field = f.ID
        LEFT JOIN education_levels el ON jo.education_level = el.ID
        LEFT JOIN experience_levels exp ON jo.experience_level = exp.ID
        LEFT JOIN Locations l ON jo.location = l.ID
        LEFT JOIN job_types jt ON jo.job_type = jt.ID
        LEFT JOIN durations d ON jo.duration = d.ID
          ";

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
