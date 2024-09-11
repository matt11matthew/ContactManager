<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");  // Allow all origins (adjust as necessary for security)
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Include config file for database connection
include 'config.php';

// Get JSON data from frontend
$inData = getRequestInfo();

$firstName = trim($inData['firstName']);
$lastName = trim($inData['lastName']);
$username = trim($inData['username']);
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

// Fetch the result as an associative array
$user = $result->fetch_assoc();

if ($user) {
    // Now $user is an associative array, you can access it safely
    if ($user['UserName'] === $username) {
        returnWithError('Username already exists.');
        return;
    }
} else {
    // Insert new user into the database without hashing the password
    $query = "INSERT INTO Logins (FirstName, LastName, UserName, Password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssss', $firstName, $lastName, $username, $password);

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
        'message'=> 'Created user',
        'id' => $id,
        'username' => $username,
        'firstName' => $firstName,
        'lastName' => $lastName
    ]);
    sendResultInfoAsJson($retValue);
}

?>
