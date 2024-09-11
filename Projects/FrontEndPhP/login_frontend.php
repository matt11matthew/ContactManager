<?php
// login.php

// Initialize variables
$userId = 0;
$fname = "";
$lname = "";

// Check if form data was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the submitted username and password
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Example URL to the API (adjust as needed)
    $url = 'http://cm.matthewe.me/testing/Backend/login.php';

    // Prepare data for POST request
    $data = array('username' => $username, 'password' => $password);
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
        header("Location: index.php?error=" . urlencode("There was an issue with username or password."));
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
        echo "Found user " . htmlspecialchars($fname) . " " . htmlspecialchars($lname);
        // You could redirect to a logged-in area or menu page here
        // header("Location: menu.php");
        exit();
    }
}
?>
