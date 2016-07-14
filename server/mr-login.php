<?php

require_once 'controllers/np-connect.php';
require_once 'controllers/np-login.php';


secure_session_start(); // Our custom secure way of starting a PHP session.

if (isset($_GET['email'], $_GET['password'])) {
    $email = $_GET['email'];
    $password = hash('sha512', $_GET['password']); // The hashed password.
 
    if (login($email, $password, $mysqli) == true) {
        // Login success 
        echo json_encode(array("login" => true));
    } else {
        // Login failed 
        return false;
    }
} else {
    // The correct POST variables were not sent to this page. 
    return 'Invalid Request';
}