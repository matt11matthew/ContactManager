<?php
// register_frontend.php

// Initialize variables
$firstName = "";
$lastName = "";
$username = "";
$password = "";
$confirmPassword = "";

// Check if form data was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the submitted form data
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Example URL to the register API (adjust as needed)
    $url = 'http://cm.matthewe.me/testing/Backend/register.php';

    // Prepare data for POST request
    $data = array(
        'firstName' => $firstName,
        'lastName' => $lastName,
        'username' => $username,
        'password' => $password,
        'confPassword' => $confirmPassword
    );

    $options = array(
        'http' => array(
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ),
    );

    // Create context for POST request
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    // Check if API call was successful
    if ($result === FALSE) {
        // Error handling
        header("Location: index.php?error=" . urlencode("There was an issue with registration."));
        exit();
    }

    // Decode the JSON response
    $response = json_decode($result, true);

    // Check for errors in the response
    if (isset($response['error'])) {
        // Redirect back with error message
        header("Location: index.php?error=" . urlencode($response['error']));
        exit();
    }

    // If response is valid, extract user information
    if ($response != null) {
        $userId = $response['id'];
        $fname = $response['firstName'];
        $lname = $response['lastName'];

        // Redirect to a new page or show a success message
        echo "Account created for " . htmlspecialchars($fname) . " " . htmlspecialchars($lname);
        // You could redirect to a login page or another area
        // header("Location: welcome.php");
        exit();
    }
}
?>
