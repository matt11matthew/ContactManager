<?php

    // Include config file for database connection
    include 'config.php';

    # Get json data from frontend
    $inData = getRequestInfo();

    $firstName = $inData['firstName'];
    $lastName =  $inData['lastName'];
    $username =  $inData['username'];
    $password =  $inData['password'];
    $confirmPassword = $inData['confPassword'];

    // Ensure user input password correctly (or did it wrong twice...)
    if ($password == $confirmPassword) {
        returnWithError('Password does not match confirmation password.');
    }

    // Query to check if username already exists
    $query = 'SELECT (ID, UserName) FROM Users WHERE UserName = ?';
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
        $query = 'INSERT INTO Logins (FirstName, LastName, UserName, Password) VALUES (\'$firstName\', \'$lastName\', \'$userName\', \'$password\')';
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result != 0) returnWithError($result);
        else returnWithError('Success');
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