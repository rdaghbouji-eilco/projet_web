<?php
header("Access-Control-Allow-Origin: *"); // Autoriser l'accès à toutes les origines
header("Access-Control-Allow-Methods: POST"); // Autoriser uniquement les requêtes POST
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Autoriser les en-têtes Content-Type et Authorization
header("Content-Type: application/json"); // Définir le type de contenu comme JSON

// Inclure le fichier de configuration de la base de données
include_once '../../config/db.php';

// Récupérer les données JSON envoyées dans la requête
$data = json_decode(file_get_contents("php://input"));

// Vérifier si les données nécessaires sont présentes
if (!empty($data->id) && !empty($data->status)) {
    try {
        // Créer une nouvelle instance de la base de données et obtenir la connexion
        $database = new Database();
        $db = $database->getConnection();

        // Préparer la requête SQL pour mettre à jour le statut de l'application
        $query = "UPDATE applications SET application_status = :status WHERE ID = :id";
        $stmt = $db->prepare($query);

        // Lier les paramètres de la requête SQL aux valeurs des données reçues
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);

        // Exécuter la requête et vérifier si elle a réussi
        if ($stmt->execute()) {
            // Répondre avec un message de succès
            echo json_encode(['status' => 'success', 'message' => 'Statut mis à jour avec succès.']);
        } else {
            // Répondre avec un message d'erreur si la mise à jour a échoué
            echo json_encode(['status' => 'error', 'message' => 'Échec de la mise à jour.']);
        }
    } catch (PDOException $e) {
        // Répondre avec un code d'erreur 500 et le message d'erreur en cas d'exception
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    // Répondre avec un code d'erreur 400 et un message d'erreur si les données sont invalides
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Données invalides.']);
}
?>
