<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
$database = new Database();
$db = $database->getConnection();

// Check if the user is logged in (session should be active)
if (!isset($_SESSION['user_ID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

$user_ID = $_SESSION['user_ID']; // Get the user ID from session

// Directory for profile picture uploads
$uploadDirectory = "../../uploads/profile_pictures/";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Handle profile picture upload if a file is provided
    $profilePictureName = null;

    if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
        $picture = $_FILES['profile_picture'];
        $fileType = strtolower(pathinfo($picture['name'], PATHINFO_EXTENSION));
        $allowedFileTypes = ['jpg', 'jpeg', 'png'];

        // Validate file type
        if (!in_array($fileType, $allowedFileTypes)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid file type. Only JPG, JPEG, and PNG are allowed."]);
            exit();
        }

        // Generate unique filename and save the file
        $profilePictureName = uniqid("profile_", true) . '.' . $fileType;
        $uploadPath = $uploadDirectory . $profilePictureName;

        if (!move_uploaded_file($picture['tmp_name'], $uploadPath)) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to move the uploaded file"]);
            exit();
        }
    }

    // Handle personal info update
    if (isset($_POST['phone']) && isset($_POST['birthdate']) && isset($_POST['country'])) {
        // Update personal info in database
        $query = "UPDATE personal_info SET phone = :phone, birthdate = :birthdate, country = :country";

        // If profile picture was uploaded, update the `profile_picture` column
        if ($profilePictureName) {
            $query .= ", profile_picture = :profile_picture";
        }
        
        $query .= " WHERE user_ID = :user_ID";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_ID', $user_ID);
        $stmt->bindParam(':phone', $_POST['phone']);
        $stmt->bindParam(':birthdate', $_POST['birthdate']);
        $stmt->bindParam(':country', $_POST['country']);
        
        if ($profilePictureName) {
            $stmt->bindParam(':profile_picture', $profilePictureName);
        }

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "message" => "Personal information updated successfully",
                "profile_picture" => $profilePictureName
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error updating personal information"]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Incomplete personal information"]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Method not allowed"]);
}
?>
