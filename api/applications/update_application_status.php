<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->status)) {
    try {
        $database = new Database();
        $db = $database->getConnection();

        $query = "UPDATE applications SET application_status = :status WHERE ID = :id";
        $stmt = $db->prepare($query);

        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Statut mis à jour avec succès.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Échec de la mise à jour.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Données invalides.']);
}
?>
