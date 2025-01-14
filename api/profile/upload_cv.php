<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$uploadDirectory = "../../uploads/cv/";

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

// Check if the user is logged in (session should be active)
if (!isset($_SESSION['user']['ID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

$user_ID = $_SESSION['user']['ID']; // Get the user ID from session

// Check if a file has been uploaded
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['cv'])) {
    $cv = $_FILES['cv'];

    // Check for upload errors
    if ($cv['error'] === UPLOAD_ERR_OK) {
        $filename = basename($cv['name']);
        $fileTmpPath = $cv['tmp_name'];
        $fileSize = $cv['size'];
        $fileType = pathinfo($filename, PATHINFO_EXTENSION);

        // Validate file size
        $maxFileSize = 2 * 1024 * 1024; // 2 MB
        if ($fileSize > $maxFileSize) {
            http_response_code(400);
            echo json_encode(["message" => "File too large. Maximum size is 2MB."]);
            exit();
        }

        // Validate file type
        $allowedFileTypes = ['pdf', 'doc', 'docx'];
        if (!in_array(strtolower($fileType), $allowedFileTypes)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid file type. Only PDF, DOC, and DOCX files are allowed."]);
            exit();
        }

        // Generate a unique name for the new file
        $newFilename = uniqid('cv_', true) . '.' . $fileType;
        $uploadPath = $uploadDirectory . $newFilename;

        // Check if a CV already exists for this user
        $query = "SELECT CV_fichier FROM cv WHERE user_ID = :user_ID";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_ID', $user_ID);
        $stmt->execute();
        $existingCV = $stmt->fetch(PDO::FETCH_ASSOC);

        // If a CV already exists, delete the old file
        if ($existingCV && file_exists($uploadDirectory . $existingCV['CV_fichier'])) {
            unlink($uploadDirectory . $existingCV['CV_fichier']); // Delete the old file
        }

        // Move the uploaded file to the server's directory
        if (move_uploaded_file($fileTmpPath, $uploadPath)) {
            if ($existingCV) {
                // Update the existing CV entry
                $query = "UPDATE cv SET CV_fichier = :CV_fichier WHERE user_ID = :user_ID";
            } else {
                // Insert a new CV entry
                $query = "INSERT INTO cv (user_ID, CV_fichier) VALUES (:user_ID, :CV_fichier)";
            }

            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_ID', $user_ID);
            $stmt->bindParam(':CV_fichier', $newFilename);

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["message" => "CV uploaded and saved to database successfully!", "filename" => $newFilename]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "CV uploaded, but failed to save to database."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to move the uploaded file."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Failed to upload file. Error: " . $cv['error']]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "No file was uploaded."]);
}
