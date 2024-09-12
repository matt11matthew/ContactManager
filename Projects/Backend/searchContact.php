<?php

// Include config file for database connection
include 'config.php';
header("Access-Control-Allow-Origin: *");  // Allow all origins (adjust as necessary for security)
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Get JSON data from frontend
$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

// Prepare the SQL statement with proper placeholders and LIKE syntax
$stmt = $conn->prepare("SELECT FirstName, LastName, Email FROM Contacts WHERE (LOWER(CONCAT(FirstName, ' ', LastName)) LIKE ?) AND UserID = ?");
$contactName = "%" . strtolower($inData["search"]) . "%";

$userId = $inData["userId"];

// Bind parameters
$stmt->bind_param("sssi", $contactName, $contactName, $contactName, $userId);
$stmt->execute();

// Get the result set
$result = $stmt->get_result();

// Fetch results
while ($row = $result->fetch_assoc()) {
    if ($searchCount > 0) {
        $searchResults .= ",";
    }
    $searchCount++;
    $searchResults .= '{"firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "email": "' . $row["Email"] . '"}';
}

// Handle the output based on search results
if ($searchCount == 0) {
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
function returnWithInfo($searchResults) {
    $retValue = '{"results": [' . $searchResults . ']}';
    sendResultInfoAsJson($retValue);
}

// Function to send error response


?>
