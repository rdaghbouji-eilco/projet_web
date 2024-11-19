<?php
// Headers for allowing CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

// Connect to the database
$database = new Database();
$db = $database->getConnection();

try {
    // SQL query to count applications by status
    $stmt = $db->prepare("
        SELECT 
            application_status,
            COUNT(*) AS total
        FROM 
            applications
        GROUP BY 
            application_status
        ORDER BY 
            total DESC
    ");
    $stmt->execute();
    
    // Fetch all results
    $application_statuses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return the response in JSON format
    echo json_encode(['status' => 'success', 'application_statuses' => $application_statuses]);
} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
