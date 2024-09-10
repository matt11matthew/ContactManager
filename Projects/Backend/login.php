<?php

    // Include config file for database connection
    include 'config.php';

    // Get json data from frontend
    $inData = getRequestInfo();



    $query = "SELECT * FROM Logins WHERE UserName=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ss', $inData['username']); // might need name changes based on front end HTML
    $stmt->execute();
    $result = $stmt->get_result();


    // Does the username/password pair exist?
    if ($row = $result->fetch_assoc()) {
        if ($inData['password']!==$row['Password']) {
            returnWithError('Invalid password');
        }
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