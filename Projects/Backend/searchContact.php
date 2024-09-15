<?php

// Include config file for database connection
include 'config.php';
header("Access-Control-Allow-Methods: GET");

// Get JSON data from frontend
$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;
$searchTerm = isset($inData["search"]) ? strtolower($inData["search"]) : '';
$userId = isset($inData["userId"]) ? $inData["userId"] : 0;
$pageNumber = isset($inData["page"]) ? (int)$inData["page"] : null;  // Set to null if not provided

// Prepare the base SQL query
$sql = "SELECT LOWER(FirstName) AS FirstName, LOWER(LastName) AS LastName, LOWER(Email) AS Email, ID
        FROM Contacts 
        WHERE UserID = ?";

// Add search condition if search term is provided
if (!empty($searchTerm)) {
    $sql .= " AND LOWER(CONCAT(FirstName, ' ', LastName)) LIKE ? OR LOWER(Email) LIKE ? OR LOWER(FirstName) LIKE ? OR LOWER(LastName) LIKE ?";
}

// Check if pagination is needed
if (!is_null($pageNumber)) {
    $limit = 10;
    $offset = ($pageNumber - 1) * $limit;
    $sql .= " LIMIT ? OFFSET ?";
}

// Prepare the SQL statement
$stmt = $conn->prepare($sql);

// Bind parameters based on the presence of the search term and pagination
if (!empty($searchTerm) && !is_null($pageNumber)) {
    $contactName = "%" . $searchTerm . "%";
    $stmt->bind_param("sssssii", $userId, $contactName, $contactName, $contactName, $contactName, $limit, $offset);
} elseif (!empty($searchTerm)) {
    $contactName = "%" . $searchTerm . "%";
    $stmt->bind_param("sssss", $userId, $contactName, $contactName, $contactName, $contactName);
} elseif (!is_null($pageNumber)) {
    $stmt->bind_param("sii", $userId, $limit, $offset);
} else {
    $stmt->bind_param("s", $userId);
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
    $searchResults .= '{"contactId": "' . $row["ID"] . '", "firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "email": "' . $row["Email"] . '"}';
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
    global $searchCount;
    $retValue = '{"results": [' . $searchResults . '], "count": '. $searchCount .'}';
    sendResultInfoAsJson($retValue);
}


?>
