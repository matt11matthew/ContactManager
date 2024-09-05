<?php

    // Include config file for database connection
    include 'config.php';

    # Get json data from frontend
    $inData = getRequestInfo();

    $userId = 0;
    $username = '';
    $password = '';
    $firstName = '';
    $lastName = '';

    // Query to check if username already exists
    $query = 'SELECT ID,firstName FROM Users WHERE username = ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $inData['username']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_column()) {
        // Account already exists / username taken.
        returnWithError('Username already exists.');
    } else {
        // Create account
        // Query to insert new user into database
        $query = '';
        $stmt = $conn->prepare($query);
        // Bind parameters
    }

    // Close connection
    $stmt->close();
    $conn->close();

    // Function to get JSON data from frontend
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    // Function to send JSON data to frontend
    function returnWithInfo( $firstName, $lastName, $id ) {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>