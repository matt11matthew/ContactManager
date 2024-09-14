<?php
// Include config file for database connection
include 'config.php';
header("Access-Control-Allow-Methods: POST");

// Get JSON data from frontend
    $inData = getRequestInfo();

    // Create variables to store userId and contact information
    $id = $inData["id"];
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];

    // Prepare and execute SQL query to delete contact
    $query = "DELETE FROM Contacts WHERE UserID=? AND ID=? AND FirstName=? AND LastName=? AND Email=?";
    $stmt = $conn->prepare($query);

    // Check if the prepare statement was successful
    if (!$stmt) {
        returnWithError("Prepare failed: " . $conn->error);
        exit();
    }

    // Bind parameters to SQL query and execute
    $stmt->bind_param("iisss", $userId, $id, $firstName, $lastName, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // If contact is found, return deleted contact information
    // Since delete, no need for ($result->errno != 0)
    if ($result != 0) {
        returnWithInfo($userId, $firstName, $lastName, $email);
    } else {
        returnWithError("Contact not found" . $stmt->error);
    }

    // Close connection
    $stmt->close();
    $conn->close();

    // Function to get JSON data from frontend
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    // Function to send JSON data to frontend
    function returnWithInfo( $id, $firstName, $lastName, $email ) {
        $retValue = json_encode(['id' => $id,
                                        'firstName' => $firstName,
                                        'lastName' => $lastName,
                                        'email' => $email
                                       ]);
        sendResultInfoAsJson( $retValue );
    }

?>