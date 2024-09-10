<?php

// Include config file for database connection
include 'config.php';

// Get JSON data from frontend
$inData = getRequestInfo();

$query = "SELECT * FROM Logins WHERE UserName=?";
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $inData['username']);  // Correct binding: only one parameter is expected
$stmt->execute();
$result = $stmt->get_result();

// Check if the username exists
if ($row = $result->fetch_assoc()) {
    // Use password_verify for secure password comparison (if passwords are hashed)
    if ($inData['password'] !== $row['Password']) {  // Replace with password_verify if hashed
        returnWithError('Invalid password');
    } else {
        returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
    }
} else {
    returnWithError('Account not found.');
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Function to get JSON data from frontend
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON data to frontend
function returnWithInfo($firstName, $lastName, $id) {
    $retValue = json_encode(['id' => $id, 'firstName' => $firstName, 'lastName' => $lastName]);
    sendResultInfoAsJson($retValue);
}
?>
