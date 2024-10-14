<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Set the directory where the CVs will be uploaded
$uploadDirectory = "../../uploads/cv/";

// Check if a file has been uploaded
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['cv'])) {
    $cv = $_FILES['cv'];

    // Check for upload errors
    if ($cv['error'] === UPLOAD_ERR_OK) {
        // Extract file details
        $filename = basename($cv['name']);
        $fileTmpPath = $cv['tmp_name'];
        $fileSize = $cv['size'];
        $fileType = pathinfo($filename, PATHINFO_EXTENSION);

        // Validate file size (optional)
        $maxFileSize = 2 * 1024 * 1024; // 2 MB
        if ($fileSize > $maxFileSize) {
            http_response_code(400);
            echo json_encode(["message" => "File too large. Maximum size is 2MB."]);
            exit();
        }

        // Validate file type (PDF, DOC, DOCX)
        $allowedFileTypes = ['pdf', 'doc', 'docx'];
        if (!in_array(strtolower($fileType), $allowedFileTypes)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid file type. Only PDF, DOC, and DOCX files are allowed."]);
            exit();
        }

        // Generate a unique name for the file to avoid overwriting
        $newFilename = uniqid('cv_', true) . '.' . $fileType;
        $uploadPath = $uploadDirectory . $newFilename;

        // Move the uploaded file to the server's directory
        if (move_uploaded_file($fileTmpPath, $uploadPath)) {
            http_response_code(200);
            echo json_encode(["message" => "CV uploaded successfully!", "filename" => $newFilename]);
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
?>
