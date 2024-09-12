<?php

// Include config file for database connection
include 'config.php';

// Get JSON data from frontend
$inData = getRequestInfo();

// Variables to store userId and contact information
$userId = $inData["userId"];
$firstName = $inData["first"];
$lastName = $inData["last"];
$email = $inData["email"];

// Prepare and execute SQL query to add contact
$query = "INSERT INTO Contacts (UserID, FirstName, LastName, Email) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);

// Check if the prepare statement was successful
if (!$stmt) {
    returnWithError("Prepare failed: " . $conn->error);
    exit();
}

// Bind parameters to the SQL query
$stmt->bind_param("isss", $userId, $firstName, $lastName, $email);

// Execute the statement and check if it was successful
if ($stmt->execute()) {
    returnWithInfo($firstName, $lastName, $userId);
} else {
    returnWithError("Contact not added: " . $stmt->error);
}

// Close statement and connection
$stmt->close();
$conn->close();

// Function to get JSON data from frontend
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON data to frontend
function returnWithInfo($firstName, $lastName, $userId, $id) {
    $retValue = '{"userID":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '"}';
    sendResultInfoAsJson($retValue);
}

?>
