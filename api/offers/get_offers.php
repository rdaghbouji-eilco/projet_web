<?php
// get_offers.php

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json"); // Ensure JSON response type

include_once '../../config/db.php';

// Connect to the database
$database = new Database();
$db = $database->getConnection();

// SQL query to retrieve job offers with related foreign key data
$query = "
    SELECT 
        jo.id as id,
        jo.entreprise_name AS entreprise_name, 
        jo.position_name AS position_name, 
        jo.description AS description, 
        f.field_name AS field, 
        l.location AS location, 
        jt.job_type AS job_type, 
        d.Duration AS duration, 
        jo.publish_date AS publish_date, 
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

// Prepare and execute the query
$stmt = $db->prepare($query);
$stmt->execute();

// Check if any offers are found
if ($stmt->rowCount() > 0) {
    $offersArr = array();

    // Loop through the results
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $offerItem = array(
            "id" => $row['id'],
            "entreprise_name" => $row['entreprise_name'],
            "position_name" => $row['position_name'],
            "description" => $row['description'],
            "field" => $row['field'],
            "location" => $row['location'],
            "job_type" => $row['job_type'],
            "duration" => $row['duration'],
            "publish_date" => $row['publish_date'],
            "experience_level" => $row['experience_level'],
            "education_level" => $row['education_level']
        );

        array_push($offersArr, $offerItem);
    }

    // HTTP 200 OK response
    http_response_code(200);
    echo json_encode($offersArr);
} else {
    // No results found
    http_response_code(404);
    echo json_encode(array("message" => "No job offers found."));
}
?>
