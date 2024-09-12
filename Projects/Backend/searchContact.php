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
$searchTerm = isset($inData["search"]) ? strtolower($inData["search"]) : '';
$userId = isset($inData["userId"]) ? $inData["userId"] : 0;
$pageNumber = isset($inData["page"]) ? (int)$inData["page"] : 1;  // Default to page 1 if not provided

// Set the default limit and calculate offset based on the page number
$limit = 10;
$offset = ($pageNumber - 1) * $limit;

// Prepare the base SQL query
$sql = "SELECT LOWER(FirstName) AS FirstName, LOWER(LastName) AS LastName, LOWER(Email) AS Email 
        FROM Contacts 
        WHERE UserID = ?";

// Add search condition if search term is provided
if (!empty($searchTerm)) {
    $sql .= " AND LOWER(CONCAT(FirstName, ' ', LastName)) LIKE ?";
}

// Add pagination
$sql .= " LIMIT ? OFFSET ?";

// Prepare the SQL statement
$stmt = $conn->prepare($sql);

// Bind parameters based on the presence of the search term
if (!empty($searchTerm)) {
    $contactName = "%" . $searchTerm . "%";
    $stmt->bind_param("ssii", $userId, $contactName, $limit, $offset);
} else {
    $stmt->bind_param("sii", $userId, $limit, $offset);
}

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
