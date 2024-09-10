<?php

// Include config file for database connection
include 'config.php';

// Get JSON data from frontend
$inData = getRequestInfo();

$firstName = $inData['firstName'];
$lastName = $inData['lastName'];
$username = $inData['username'];
$password = $inData['password'];
$confirmPassword = $inData['confPassword'];

// Check if passwords match
if ($password !== $confirmPassword) {
    returnWithError('Password does not match confirmation password.');
    exit();
}

// Ensure all fields are filled
if (empty($firstName) || empty($lastName) || empty($username) || empty($password) || empty($confirmPassword)) {
    returnWithError('One or more fields was empty.');
    exit();
}

// Query to check if username already exists
$query = 'SELECT ID, UserName FROM Logins WHERE UserName = ?';
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->fetch_assoc()) {
    // Account already exists / username taken.
    returnWithError('Username already exists.');
} else {
    // Insert new user into database
    $query = "INSERT INTO Logins (FirstName, LastName, UserName, Password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssss', $firstName, $lastName, $username, $password); // Consider hashing the password
    if ($stmt->execute()) {
        // Successfully inserted, fetch the newly created user ID
        $userId = $stmt->insert_id;
        returnWithInfo($userId, $username, $firstName, $lastName);
    } else {
        returnWithError('Error inserting new user.');
    }
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Function to get JSON data from frontend
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON response to frontend
function returnWithInfo($id, $username, $firstName, $lastName) {
    $retValue = json_encode([
        'id' => $id,
        'username' => $username,
        'firstName' => $firstName,
        'lastName' => $lastName
    ]);
    sendResultInfoAsJson($retValue);
}

// Function to send error JSON to frontend
function returnWithError($error) {
    $retValue = json_encode(['error' => $error]);
    sendResultInfoAsJson($retValue);
}

// Function to send JSON response
function sendResultInfoAsJson($obj) {
    header('Content-Type: application/json');
    echo $obj;
}
?>
