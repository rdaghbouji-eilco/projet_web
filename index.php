<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

session_start();

include_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

// Get the requested URI and HTTP method
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$method = $_SERVER['REQUEST_METHOD'];

// Extract the main endpoint (e.g., "user", "profile", etc.)
$endpoint = isset($uri[2]) ? $uri[2] : '';
$sub_endpoint = isset($uri[3]) ? $uri[3] : null;
$id = isset($uri[4]) ? (int)$uri[4] : null;

// Routing
switch ($endpoint) {

    // Authentication routes (Login/Register)
    case 'auth':
        if ($method === 'POST' && $sub_endpoint === 'login') {
            require 'api/auth/login.php';
        } elseif ($method === 'POST' && $sub_endpoint === 'register') {
            require 'api/auth/register.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Auth route not found']);
        }
        break;

    // Country routes
    case 'country':
        if ($method === 'GET') {
            require 'api/country/get_countries.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Country route not found']);
        }
        break;

    // Current Degree routes
    case 'current_degree':
        if ($method === 'GET') {
            require 'api/current_degree/get_current_degree.php'; // Assuming you'll have this file
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Current Degree route not found']);
        }
        break;

    // Education Levels routes
    case 'education_levels':
        if ($method === 'GET') {
            require 'api/education_levels/get_education_levels.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Education Levels route not found']);
        }
        break;

    // Expected Graduation Year routes
    case 'expected_graduation_year':
        if ($method === 'GET') {
            require 'api/expected_graduation_year/get_expected_graduation_year.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Expected Graduation Year route not found']);
        }
        break;

    // Experience Levels routes
    case 'experience_levels':
        if ($method === 'GET') {
            require 'api/experience_levels/get_experience_levels.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Experience Levels route not found']);
        }
        break;

    // Field routes
    case 'fields':
        if ($method === 'GET') {
            require 'api/fields/get_fields.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Fields route not found']);
        }
        break;

    // Spoken Languages routes
    case 'spoken_languages':
        if ($method === 'GET') {
            require 'api/spoken_languages/get_spoken_languages.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Spoken Languages route not found']);
        }
        break;

    // Profile routes
    case 'profile':
        if ($sub_endpoint === 'pro') {
            if ($method === 'GET') {
                require 'api/profile/get_profile_pro.php';
            } elseif ($method === 'POST') {
                require 'api/profile/update_profile_pro.php';
            } else {
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
            }
        } elseif ($sub_endpoint === 'personal_info') {
            if ($method === 'GET') {
                require 'api/profile/get_personal_info.php';
            } elseif ($method === 'POST') {
                require 'api/profile/update_personal_info.php';
            } else {
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Profile route not found']);
        }
        break;

    // User routes
    case 'user':
        if ($method === 'GET' && $id) {
            require 'api/user/get_user.php';
        } elseif ($method === 'POST') {
            require 'api/user/create_user.php';
        } elseif ($method === 'PUT' && $id) {
            require 'api/user/update_user.php';
        } elseif ($method === 'DELETE' && $id) {
            require 'api/user/delete_user.php';
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User route not found']);
        }
        break;

    // Default route if no endpoint matches
    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint not found']);
        break;
}

?>
