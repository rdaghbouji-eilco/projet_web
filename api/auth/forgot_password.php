<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/db.php';
include_once '../../config/mail.php'; // Un fichier pour gérer l'envoi d'e-mails (par exemple, PHPMailer)
require __DIR__ . '/../../vendor/autoload.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    // Étape 1 : Vérifier si l'email existe dans la base de données
    $query = "SELECT ID, email FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $userId = $user['ID'];

        // Étape 2 : Générer un jeton de réinitialisation et une heure d'expiration
        $resetToken = bin2hex(random_bytes(16)); // Générer un jeton aléatoire
        $expiresAt = date("Y-m-d H:i:s", strtotime('+1 hour')); // Définir l'expiration à 1 heure

        // Étape 3 : Stocker le jeton et l'expiration dans la base de données
        $insertQuery = "INSERT INTO password_resets (user_ID, token, expires_at) VALUES (:user_ID, :token, :expires_at)";
        $stmtInsert = $db->prepare($insertQuery);
        $stmtInsert->bindParam(':user_ID', $userId);
        $stmtInsert->bindParam(':token', $resetToken);
        $stmtInsert->bindParam(':expires_at', $expiresAt);
        $stmtInsert->execute();

        // Étape 4 : Envoyer l'e-mail de réinitialisation
        $resetLink = "http://localhost/repo-projet_web/frontend/html/reset_password.html?token=" . $resetToken;
        $subject = "Demande de réinitialisation de mot de passe";
        $body = "Bonjour, \n\nNous avons reçu une demande de réinitialisation de votre mot de passe. Vous pouvez le réinitialiser en cliquant sur le lien suivant :\n" . $resetLink . "\n\nSi vous n'avez pas demandé cela, veuillez ignorer cet e-mail.\n\nCordialement,\nVotre équipe du site web";
        
        // Appelez votre fonction d'envoi de mail, par exemple, en utilisant PHPMailer ou une autre bibliothèque d'e-mails
        if (sendEmail($user['email'], $subject, $body)) {
            echo json_encode(["message" => "Lien de réinitialisation du mot de passe envoyé !"]);
        } else {
            http_response_code(500); // Erreur interne du serveur
            echo json_encode(["message" => "Échec de l'envoi de l'e-mail de réinitialisation."]);
        }

    } else {
        http_response_code(404); // Email non trouvé
        echo json_encode(["message" => "Email non trouvé."]);
    }
} else {
    http_response_code(400); // Mauvaise requête
    echo json_encode(["message" => "L'email est requis."]);
}

/**
 * Fonction pour envoyer un e-mail (modifier en fonction de votre bibliothèque d'envoi d'e-mails, par exemple, PHPMailer)
 */
function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    
    try {
        // Paramètres du serveur
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Spécifiez le serveur SMTP
        $mail->SMTPAuth   = true;
        $mail->Username   = 'rdaghbouji@gmail.com'; // Nom d'utilisateur SMTP
        $mail->Password   = 'oatz icxj xvwt rexb'; // Mot de passe SMTP
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Destinataires
        $mail->setFrom('no-reply@example.com', 'Votre site web');
        $mail->addAddress($to); // Ajouter un destinataire

        // Contenu
        $mail->isHTML(false); // Définir le format de l'e-mail en texte brut
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Le message n'a pas pu être envoyé. Erreur de Mailer : {$mail->ErrorInfo}");
        return false;
    }
}
?>
