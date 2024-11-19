<?php
// Headers for allowing CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

// Connect to the database
$database = new Database();
$db = $database->getConnection();

try {
    // SQL query to fetch the 5 most recent applications with offer and user details
    $stmt = $db->prepare("
        SELECT 
            a.ID AS application_id,
            a.application_date,
            a.application_status,
            o.position_name,
            o.entreprise_name,
            u.name AS applicant_name,
            u.surname AS applicant_surname,
            u.email AS applicant_email
        FROM 
            applications a
        JOIN 
            job_offers o ON a.offer_ID = o.ID
        JOIN 
            users u ON a.user_ID = u.ID
        ORDER BY 
            a.application_date DESC
        LIMIT 5
    ");
    $stmt->execute();
    
    // Fetch all results
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return the response in JSON format
    echo json_encode(['status' => 'success', 'recent_applications' => $applications]);
} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
