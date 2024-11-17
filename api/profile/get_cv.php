<?php
session_start();
header("Access-Control-Allow-Origin: *");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

if (!isset($_SESSION['user_ID'])) {
    http_response_code(401);
    header("Content-Type: application/json");
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

$user_ID = $_SESSION['user_ID'];

$query = "SELECT CV_fichier FROM cv WHERE user_ID = :user_ID";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_ID', $user_ID);
$stmt->execute();
$cvData = $stmt->fetch(PDO::FETCH_ASSOC);

if ($cvData && $cvData['CV_fichier']) {
    $filePath = "../../uploads/cv/" . $cvData['CV_fichier'];
    if (file_exists($filePath)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));

        ob_clean();
        flush();
        readfile($filePath);
        exit();
    } else {
        http_response_code(404);
        header("Content-Type: application/json");
        echo json_encode(["message" => "CV file not found."]);
    }
} else {
    http_response_code(404);
    header("Content-Type: application/json");
    echo json_encode(["message" => "No CV found for this user."]);
}
?>
