<?php
header("Access-Control-Allow-Origin: *"); // Autoriser les requêtes de n'importe quelle origine
header("Access-Control-Allow-Methods: GET"); // Méthodes autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés
header("Content-Type: application/json"); // Assurer le type de réponse JSON

include_once '../../config/db.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

try {
    // Requête SQL pour récupérer toutes les applications avec les données associées
    $stmt = $db->prepare("
        SELECT 
            a.ID AS application_id, // Identifiant de l'application
            a.application_date, // Date de l'application
            app_status.Application_status as application_status, // Statut de l'application
            o.position_name, // Nom du poste
            o.entreprise_name, // Nom de l'entreprise
            user.name AS applicant_name, // Prénom du candidat
            user.surname AS applicant_surname, // Nom de famille du candidat
            user.email AS applicant_email // Email du candidat
        FROM 
            applications a
        JOIN 
            job_offers offer ON a.offer_ID = offer.ID // Jointure avec les offres d'emploi
        JOIN 
            users u ON a.user_ID = u.ID // Jointure avec les utilisateurs
        JOIN
            application_status app_status ON a.application_status = app_status.ID // Jointure avec les statuts des applications
        ORDER BY 
            a.application_date DESC // Trier par date d'application décroissante
    ");
    $stmt->execute(); // Exécuter la requête
    
    // Récupérer tous les résultats
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Retourner la réponse au format JSON
    echo json_encode(['status' => 'success', 'applications' => $applications]);
} catch (PDOException $e) {
    // Gérer les erreurs
    error_log($e->getMessage(), 0); // Enregistrer le message d'erreur
    http_response_code(500); // Répondre avec un code d'erreur 500
    echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue lors du traitement de votre demande.']);
}
?>
