<?php
// forgot_password.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
include_once '../../config/mail.php'; // A file to handle email sending (e.g., PHPMailer)
require __DIR__ . '/../../vendor/autoload.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    // Step 1: Check if the email exists in the database
    $query = "SELECT ID, email FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $userId = $user['ID'];

        // Step 2: Generate a reset token and expiry time
        $resetToken = bin2hex(random_bytes(16)); // Generate a random token
        $expiresAt = date("Y-m-d H:i:s", strtotime('+1 hour')); // Set expiry to 1 hour

        // Step 3: Store token and expiry in the database
        $insertQuery = "INSERT INTO password_resets (user_ID, token, expires_at) VALUES (:user_ID, :token, :expires_at)";
        $stmtInsert = $db->prepare($insertQuery);
        $stmtInsert->bindParam(':user_ID', $userId);
        $stmtInsert->bindParam(':token', $resetToken);
        $stmtInsert->bindParam(':expires_at', $expiresAt);
        $stmtInsert->execute();

        // Step 4: Send the reset email
        $resetLink = "http://localhost/projet_web/frontend/html/reset_password.html?token=" . $resetToken;
        $subject = "Password Reset Request";
        $body = "Hello, \n\nWe received a request to reset your password. You can reset it by clicking the following link:\n" . $resetLink . "\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nYour Website Team";
        
        // Call your mail function, e.g., using PHPMailer or another email library
        if (sendEmail($user['email'], $subject, $body)) {
            echo json_encode(["message" => "Password reset link sent!"]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["message" => "Failed to send the reset email."]);
        }

    } else {
        http_response_code(404); // Email not found
        echo json_encode(["message" => "Email not found."]);
    }
} else {
    http_response_code(400); // Bad request
    echo json_encode(["message" => "Email is required."]);
}

/**
 * Function to send email (modify based on your email sending library, e.g., PHPMailer)
 */
function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Specify SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'rdaghbouji@gmail.com'; // SMTP username
        $mail->Password   = 'oatz icxj xvwt rexb'; // SMTP password
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('no-reply@example.com', 'Your Website');
        $mail->addAddress($to); // Add recipient

        // Content
        $mail->isHTML(false); // Set email format to plain text
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>
