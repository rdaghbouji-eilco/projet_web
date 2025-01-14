<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

if (!isset($_SESSION['user']['ID'])) {
    http_response_code(401);
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

$user_ID = $_SESSION['user']['ID'];
$uploadDirectory = "../../uploads/profile_pictures/";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['profile_picture'])) {
    $picture = $_FILES['profile_picture'];

    if ($picture['error'] === UPLOAD_ERR_OK) {
        $fileType = strtolower(pathinfo($picture['name'], PATHINFO_EXTENSION));
        $allowedFileTypes = ['jpg', 'jpeg', 'png'];

        if (!in_array($fileType, $allowedFileTypes)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid file type. Only JPG, JPEG, and PNG are allowed."]);
            exit();
        }

        $newFilename = uniqid("profile_", true) . '.' . $fileType;
        $uploadPath = $uploadDirectory . $newFilename;

        if (move_uploaded_file($picture['tmp_name'], $uploadPath)) {
            $query = "UPDATE personal_info SET profile_picture = :profile_picture WHERE user_ID = :user_ID";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':profile_picture', $newFilename);
            $stmt->bindParam(':user_ID', $user_ID);

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["message" => "Profile picture uploaded successfully", "filename" => $newFilename]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to update profile picture in the database"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to move the uploaded file"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Failed to upload file. Error: " . $picture['error']]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "No file was uploaded"]);
}
?>
