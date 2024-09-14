// let fname = "";
// let lname = "";
// let emailAddress = "";
function hideLoginError() {
    document.getElementById("creationError").innerHTML = "";
}

function onCreate(event) {
    event.preventDefault();

    // fname = "";
    // lname = "";
    // emailAddress = "";

    let email = document.getElementsByName("email")[0].value;
    console.log(email);
    let firstName = document.getElementsByName("fName")[0].value;
    console.log(firstName);
    let lastName = document.getElementsByName("lName")[0].value;
    console.log(lastName);

    let tmp = {
        userId: 1,
        firstName: firstName,
        lastName: lastName,
        email: email,
    };

    /*
{"userId":1,"first":"test","last":"test","email":"test"}

 */

    let createJson = JSON.stringify(tmp);
    let url = "http://cm.matthewe.me/testing/Backend/addContact.php";

    let xml = new XMLHttpRequest();
    xml.open("POST", url, true);
    xml.setRequestHeader("Content-Type", "application/json");

    // Debugging: Log JSON being sent
    console.log("Sending JSON:", createJson);

    xml.send(createJson);

    xml.onreadystatechange = function () {
        if (xml.readyState === 4) {
            // Debugging: Log status code and response text
            console.log("Status Code:", xml.status);
            console.log("Response Text:", xml.responseText);

            if (xml.status === 200) { //check if response was successful
                try {
                    let response = JSON.parse(xml.responseText);
                    if ("error" in response) {
                        document.getElementById("creationError").innerHTML = response.error;
                        setTimeout(hideLoginError, 3000);
                    } else { //create the contact
                        // fname = response.firstName;
                        // lname = response.lastName;
                        // emailAddress = response.emailAddress;
                        document.getElementById("creationError").innerHTML = "Added contact.";
                        setTimeout(hideLoginError, 3000);
                        window.open("http://cm.matthewe.me/testing/myContacts.html");

                    }
                } catch (error) {
                    document.getElementById("creationError").innerHTML = "Invalid response format.";
                    setTimeout(hideLoginError, 3000);
                }
            } else {
                document.getElementById("creationError").innerHTML = "Server error. Please try again later.";
                setTimeout(hideLoginError, 3000);
            }
        }
    };
}
