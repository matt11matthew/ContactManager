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
        // Echo error message directly
        echo "<p style='color: red;'>Error: There was an issue connecting to the registration service. Please try again later.</p>";
        exit();
    }

    // Decode the JSON response
    $response = json_decode($result, true);

    // Check for errors in the response
    if (isset($response['error'])) {
        // Echo the error message from the backend
        echo "<p style='color: red;'>Error: " . htmlspecialchars($response['error']) . "</p>";
        exit();
    }

    // If response is valid, extract user information
    if ($response != null) {
        $userId = $response['id'];
        $fname = $response['firstName'];
        $lname = $response['lastName'];

        // Display a success message
        echo "<p style='color: green;'>Account created successfully for " . htmlspecialchars($fname) . " " . htmlspecialchars($lname) . ".</p>";
        // Optionally, redirect to another page
        // header("Location: welcome.php");
        exit();
    }
}
?>
