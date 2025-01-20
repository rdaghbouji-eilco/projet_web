<?php
// reset_password.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->token) && !empty($data->password)) {
    // Étape 1 : Trouver le jeton de réinitialisation dans la base de données
    $query = "SELECT user_ID, expires_at FROM password_resets WHERE token = :token";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $data->token);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $resetData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Étape 2 : Vérifier si le jeton a expiré
        if (new DateTime($resetData['expires_at']) > new DateTime()) {
            // Étape 3 : Mettre à jour le mot de passe de l'utilisateur
            $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
            $updateQuery = "UPDATE users SET password = :password WHERE ID = :user_ID";
            $stmtUpdate = $db->prepare($updateQuery);
            $stmtUpdate->bindParam(':password', $hashedPassword);
            $stmtUpdate->bindParam(':user_ID', $resetData['user_ID']);
            $stmtUpdate->execute();

            // Étape 4 : Supprimer le jeton de réinitialisation utilisé
            $deleteQuery = "DELETE FROM password_resets WHERE token = :token";
            $stmtDelete = $db->prepare($deleteQuery);
            $stmtDelete->bindParam(':token', $data->token);
            $stmtDelete->execute();

            echo json_encode(["message" => "Mot de passe réinitialisé avec succès."]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Le jeton de réinitialisation a expiré."]);
        }
    } else {
        http_response_code(400); // Jeton non trouvé
        echo json_encode(["message" => "Jeton de réinitialisation invalide."]);
    }
} else {
    http_response_code(400); // Jeton ou mot de passe manquant
    echo json_encode(["message" => "Le jeton et le mot de passe sont requis."]);
}
?>
