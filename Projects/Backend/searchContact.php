<?php

    // Include config file for database connection
    include 'config.php';
header("Access-Control-Allow-Origin: *");  // Allow all origins (adjust as necessary for security)
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

    # Get json data from frontend
    $inData = getRequestInfo();

    $userId = 0;

    $searchResults = "";
    $searchCount = 0;

    $stmt = $conn->prepare("SELECT (FirstName, LastName, Email) FROM Contacts WHERE UserName OR Email LIKE %?%");
    $contactName = "%" . $inData["search"] . "%";
    $stmt->bind_param("ss", $contactName, $inData["userId"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while($row = $result->fetch_assoc()) {
        if($searchCount > 0){
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '"' . $row["Name"] . '"';
    }

    if($searchCount == 0){
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
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