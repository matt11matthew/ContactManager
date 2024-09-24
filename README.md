# Group 17 Contact Manager
A basic contact manager with create-retrieve-update-delete (CRUD) functionality using a REST API written in PHP. \
This project was created for Dr. Gerber's COP4331C Fall 2024 class.

# Developers
This project was created by a group for Dr. Gerber's COP4331C Fall 2024 class.

|  Project Manager  |     Frontend     |   Database   |    Backend    |
|-------------------|------------------|--------------|---------------|
| Matthew Eisenberg | William Barrett  | Pedro Criado | Dennis Gorman |
|                   | Jia Jones        |              | Ahmed Salama  |

# Requirements
* This project runs off of a LAMP stack, so an [Apache 2](https://httpd.apache.org/) HTTP server must be setup on a Linux system with [MariaDB](https://mariadb.org/) and [PHP](https://www.php.net/) installed.
* A ```config.php``` is required for connecting to MariaDB. You will have to provide your own login information.
```php
<?php
$host = "hostname";
$user = "username";
$password = "password";
$database = "database_name";

# Connect to database
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    returnWithError("Success");
}

# Required by other PHP files
function sendResultInfoAsJson( $obj ) {
    header('Content-type: application/json');
    echo $obj;
}

# Required by all PHP files
function returnWithError( $err ) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}
?>
```
