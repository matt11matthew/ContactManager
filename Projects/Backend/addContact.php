<?php

    // Include config file for database connection
    include 'config.php';

    # Get json data from frontend
    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $firstName = $inData["first"];
    $lastName = $inData["last"];
    $email = $inData["email"];

    $stmt = $conm->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, UserName, Email) VALUES ('$id', '$firstName', '$lastName', /*'$userName',*/ '$email')");
    $stmt->bind_param("ss",$userId,$color);
    $stmt->execute();

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