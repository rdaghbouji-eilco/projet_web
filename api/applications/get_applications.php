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
