<?php
// get_offers_filtres.php

// Headers for allowing CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

// Connect to the database
$database = new Database();
$db = $database->getConnection();

// Base query to retrieve job offers with related foreign key data
$query = "
    SELECT 
        jo.id AS id,
        jo.entreprise_name AS entreprise_name, 
        jo.position_name AS position_name, 
        jo.description AS description, 
        f.field_name AS field, 
        l.location AS location, 
        jt.job_type AS job_type, 
        d.Duration AS duration, 
        jo.publish_date AS publish_date, 
        re.remote_label AS remote, 
        exp.experience_level AS experience_level, 
        el.education_level AS education_level
    FROM job_offers jo 
    LEFT JOIN fields f ON jo.field = f.ID
    LEFT JOIN education_levels el ON jo.education_level = el.ID
    LEFT JOIN experience_levels exp ON jo.experience_level = exp.ID
    LEFT JOIN Locations l ON jo.location = l.ID
    LEFT JOIN job_types jt ON jo.job_type = jt.ID
    LEFT JOIN durations d ON jo.duration = d.ID
    LEFT JOIN remote re ON jo.remote = re.ID
    WHERE 1=1
";

// Add filters dynamically based on GET parameters
$filters = [];
$params = []; // Store parameters to bind later

if (!empty($_GET['field'])) {
    $filters[] = "jo.field = :field";
    $params[':field'] = $_GET['field'];
}
if (!empty($_GET['location'])) {
    $filters[] = "jo.location = :location";
    $params[':location'] = $_GET['location'];
}
if (!empty($_GET['experience_level'])) {
    $filters[] = "jo.experience_level = :experience_level";
    $params[':experience_level'] = $_GET['experience_level'];
}
if (!empty($_GET['education_level'])) {
    $filters[] = "jo.education_level = :education_level";
    $params[':education_level'] = $_GET['education_level'];
}
if (!empty($_GET['job_type'])) {
    $filters[] = "jo.job_type = :job_type";
    $params[':job_type'] = $_GET['job_type'];
}
if (!empty($_GET['duration'])) {
    $filters[] = "jo.Duration = :duration";
    $params[':duration'] = $_GET['duration'];
}
if (!empty($_GET['remote'])) {
    $filters[] = "jo.remote = :remote";
    $params[':remote'] = $_GET['remote'];
}

// Append filters to the query
if (count($filters) > 0) {
    $query .= " AND " . implode(" AND ", $filters);
}

// Prepare the query
$stmt = $db->prepare($query);

// Bind parameters dynamically
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}

// Execute the query
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
            "duration" => $row['duration'] ?? 'Not specified', // Handle NULL values
            "publish_date" => $row['publish_date'],
            "remote" => $row['remote'] ?? 'Not specified', // Handle NULL values
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
