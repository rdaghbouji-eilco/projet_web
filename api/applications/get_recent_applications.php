<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json"); // Ensure JSON response type


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
            aa.Application_status as application_status,
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
        JOIN
            application_status aa ON a.application_status=aa.ID
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
