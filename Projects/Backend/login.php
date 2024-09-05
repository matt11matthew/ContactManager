<?php

    // Include config file for database connection
    include 'config.php';

    // Get json data from frontend
    $inData = getRequestInfo();

    // Variables for user information
    $userId = 0;
    $username = '';
    $password = '';

    $query = 'SELECT ID, FirstName, LastName FROM Logins WHERE UserName=? AND Password=?';
    $stmt = $conn->prepare();
    $stmt->bind_param('ss', $inData['username'], $inData['password']); // might need name changes based on front end HTML
    $stmt->execute();
    $result = $stmt->get_result();

    // Does the username/password pair exist?
    if ($row = $result->fetch_assoc()) {
        returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
    } else returnWithError('Account not found.');

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