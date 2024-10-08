<?php

// Include config file for database connection
include 'config.php';
header("Access-Control-Allow-Methods: GET");

// Get JSON data from frontend
$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;
$searchTerm = isset($inData["search"]) ? strtolower($inData["search"]) : '';
$userId = isset($inData["userId"]) ? $inData["userId"] : -1;
$pageNumber = isset($inData["page"]) ? (int)$inData["page"] : null;  // Set to null if not provided


if (isset($inData["contactId"])) {
    $contactId = $inData["contactId"];
    $sql = "SELECT (ID, LOWER(FirstName) AS FirstName, LOWER(LastName) AS LastName, LOWER(Email) AS Email)
        FROM Contacts 
        WHERE UserID = ? AND ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $userId, $contactId);
    $stmt->execute();

    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $searchResult = '{"contactId": "' . $row["ID"] . '", "firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "email": "' . $row["Email"] . '"}';
    sendResultInfoAsJson($searchResult);

    $stmt->close();
    $conn->close();

    return;
}
$showCount =isset($inData["maxPage"]);
// Prepare the base SQL query
//On it boss
$sql = "SELECT *
        FROM Contacts 
        WHERE UserID = ?";
# UserID 1st


// Add search condition if search term is provided
if (!empty($searchTerm)) {
    $sql .= " AND ((CONCAT(FirstName, ' ', LastName) LIKE ?) OR (Email LIKE ?) OR (FirstName LIKE ?) OR (LastName LIKE ?))";
    //$sql .= "SELECT *
    //        FROM Contacts
    //        WHERE UserID = ?
    // AND CONCAT(FirstName, ' ', LastName) LIKE ? OR Email LIKE ? OR FirstName LIKE ? OR LastName LIKE ?";
}
# if search term, ok
# if not, UserID 1st, limit 2, offset 3
# if no page, just UserId
# SwaggerHub works if no "search" provided ^ ^ ^

// Check if pagination is needed
if (!is_null($pageNumber) && !$showCount) {
    $limit = 10;
    $offset = ($pageNumber - 1) * $limit;
    $sql .= " LIMIT ? OFFSET ?";
}

// Prepare the SQL statement
$stmt = $conn->prepare($sql);

// Bind parameters based on the presence of the search term and pagination
if (!empty($searchTerm) && !is_null($pageNumber)) {
    $contactName = "%" . $searchTerm . "%";
    $stmt->bind_param("issssii", $userId, $contactName, $contactName, $contactName, $contactName, $limit, $offset);
} elseif (!empty($searchTerm)) {
    $contactName = "%" . $searchTerm . "%";
    $stmt->bind_param("issss", $userId, $contactName, $contactName, $contactName, $contactName);
} elseif (!is_null($pageNumber)) {
    $stmt->bind_param("iii", $userId, $limit, $offset);
} else {
    $stmt->bind_param("i", $userId);
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
    if (!$showCount){
        $searchResults .= '{"contactId": "' . $row["ID"] . '", "userId": "' . $row["UserID"] . '", "firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "email": "' . $row["Email"] . '"}';
    }
    //$searchResults .= '{"contactId": "' . $row["ID"] . '", "firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "email": "' . $row["Email"] . '"}';
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
    global $searchCount, $showCount;
    if ($showCount) {
        sendResultInfoAsJson('{"count": '.$searchCount.'}');
        return;
    }
    $retValue = '{"results": [' . $searchResults . '], "count": '. $searchCount .'}';
    sendResultInfoAsJson($retValue);
}


?>