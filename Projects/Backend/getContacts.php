<?php







    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithInfo( $firstName, $lastName, $id ) {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>