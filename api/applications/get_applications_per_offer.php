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
    // SQL query to count applications per job offer
    $stmt = $db->prepare("
        SELECT 
            o.ID AS offer_id,
            o.position_name,
            o.entreprise_name,
            COUNT(a.ID) AS total_applications
        FROM 
            job_offers o
        LEFT JOIN 
            applications a ON o.ID = a.offer_ID
        GROUP BY 
            o.ID, o.position_name, o.entreprise_name
        ORDER BY 
            total_applications DESC
    ");
    $stmt->execute();
    
    // Fetch all results
    $applications_per_offer = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return the response in JSON format
    echo json_encode(['status' => 'success', 'applications_per_offer' => $applications_per_offer]);
} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
