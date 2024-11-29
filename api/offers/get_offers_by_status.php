<?php
// Headers pour autoriser les requêtes CORS et JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

// Initialiser la connexion à la base de données
$database = new Database();
$db = $database->getConnection();

try {
    // Requête SQL pour récupérer les statuts et compter les offres associées
    $sql = "
        SELECT 
            job_offer_status.Job_offer_status AS status_name,
            COUNT(job_offers.id) AS offer_count
        FROM 
            job_offers
        JOIN 
            job_offer_status
        ON 
            job_offers.status = job_offer_status.id
        GROUP BY 
            job_offer_status.Job_offer_status;
    ";

    // Préparer et exécuter la requête
    $stmt = $db->prepare($sql); // Utilisation de $db au lieu de $pdo
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retourner les résultats en JSON
    echo json_encode($results);
} catch (PDOException $e) {
    // Gestion des erreurs
    echo json_encode([
        "error" => "Error executing query",
        "message" => $e->getMessage()
    ]);
}
?>
