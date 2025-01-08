<?php
// get_offers.php

// Headers for allowing CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

// Connect to the database
$database = new Database();
$db = $database->getConnection();

// SQL query to retrieve job offers with related foreign key data
$query = "
    SELECT * from applications;
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
            "ID" => $row['ID'],
            "offer_ID" => $row['offer_ID'],
            "user_ID" => $row['user_ID'],
            "application_date" => $row['application_date'],
            "application_status" => $row['application_status']
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
