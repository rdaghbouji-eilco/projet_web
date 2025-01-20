<?php
header("Access-Control-Allow-Origin: *"); // Autoriser les requêtes provenant de n'importe quelle origine
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Méthodes autorisées
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés
header("Content-Type: application/json"); // Assurer le type de réponse JSON

include_once '../../config/db.php';

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

// Requête SQL pour récupérer les candidatures avec les données de clé étrangère associées
$query = "
    SELECT * from applications;
";

// Préparer et exécuter la requête
$stmt = $db->prepare($query);
$stmt->execute();

// Vérifier si des candidatures sont trouvées
if ($stmt->rowCount() > 0) {
    $offersArr = array();

    // Boucler à travers les résultats
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $offerItem = array(
            "ID" => $row['ID'],
            "offer_ID" => $row['offer_ID'],
            "user_ID" => $row['user_ID'],
            "application_date" => $row['application_date'],
            "application_status" => $row['application_status']
        );

        array_push($offersArr, $offerItem); // Ajouter l'élément de l'offre au tableau des offres
    }

    // Réponse HTTP 200 OK
    http_response_code(200);
    echo json_encode($offersArr); // Retourner les offres au format JSON
} else {
    // Aucun résultat trouvé
    http_response_code(404);
    echo json_encode(array("message" => "Aucune offre d'emploi trouvée.")); // Message indiquant qu'aucune offre n'a été trouvée
}
?>
