<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

if (!isset($id)) {
    http_response_code(400);
    echo json_encode(['message' => 'User ID is required']);
    exit();
}

$query = "SELECT * FROM users WHERE ID = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $id);

if ($stmt->execute()) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'User not found']);
    }
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error']);
}

?>
