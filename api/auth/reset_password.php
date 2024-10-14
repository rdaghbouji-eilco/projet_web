<?php
// reset_password.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->token) && !empty($data->password)) {
    // Step 1: Find the reset token in the database
    $query = "SELECT user_ID, expires_at FROM password_resets WHERE token = :token";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $data->token);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $resetData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Step 2: Check if the token has expired
        if (new DateTime($resetData['expires_at']) > new DateTime()) {
            // Step 3: Update the user's password
            $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
            $updateQuery = "UPDATE users SET password = :password WHERE ID = :user_ID";
            $stmtUpdate = $db->prepare($updateQuery);
            $stmtUpdate->bindParam(':password', $hashedPassword);
            $stmtUpdate->bindParam(':user_ID', $resetData['user_ID']);
            $stmtUpdate->execute();

            // Step 4: Delete the used reset token
            $deleteQuery = "DELETE FROM password_resets WHERE token = :token";
            $stmtDelete = $db->prepare($deleteQuery);
            $stmtDelete->bindParam(':token', $data->token);
            $stmtDelete->execute();

            echo json_encode(["message" => "Password reset successfully."]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Reset token has expired."]);
        }
    } else {
        http_response_code(400); // Token not found
        echo json_encode(["message" => "Invalid reset token."]);
    }
} else {
    http_response_code(400); // Missing token or password
    echo json_encode(["message" => "Token and password are required."]);
}
?>
