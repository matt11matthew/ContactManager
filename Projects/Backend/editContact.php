<?php

    // Include config file for database connection
    include 'config.php';
header("Access-Control-Allow-Methods: POST");

    # Get json data from frontend
    $inData = getRequestInfo();

    // Variables to store userId and contact information
    $id = $inData["id"];
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];

    // Ensure all fields are filled
    if (empty($userId) || empty($firstName || empty($lastName) || empty($email))) {
        returnWithError('One or more fields was empty.');
        exit();
    }

    // Prepare and execute SQL query to edit contact
    $query = "UPDATE Contacts SET FirstName=?, LastName=?, Email=? WHERE UserID=? AND ID=?;";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssii", $firstName, $lastName, $email, $userId, $id); ;
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result != 0) {
        returnWithInfo($firstName, $lastName, $userId);
    } else {
        returnWithError("Contact not added");
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