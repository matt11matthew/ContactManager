// Updated JavaScript for additional logging
let userId = 0;
let fname = "";
let lname = "";

function hideLoginError() {
    document.getElementById("loginError").innerHTML = "";
}

function onRegister(event) {
    event.preventDefault();

    userId = 0;
    fname = "";
    lname = "";

    let firstName = document.getElementsByName("firstName")[0].value;
    let lastName = document.getElementsByName("lastName")[0].value;
    let userLogin = document.getElementsByName("username")[0].value;
    let userPass = document.getElementsByName("password")[0].value;
    let confirmPass = document.getElementsByName("confirmPassword")[0].value;

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        username: userLogin,
        password: userPass,
        confPassword: confirmPass
    };

    let registerJson = JSON.stringify(tmp);
    let url = "http://cm.matthewe.me/testing/Backend/register.php";

    let xml = new XMLHttpRequest();
    xml.open("POST", url, true);
    xml.setRequestHeader("Content-Type", "application/json");

    // Debugging: Log JSON being sent
    console.log("Sending JSON:", registerJson);

    xml.send(registerJson);

    xml.onreadystatechange = function () {
        if (xml.readyState === 4) {
            // Debugging: Log status code and response text
            console.log("Status Code:", xml.status);
            console.log("Response Text:", xml.responseText);

            if (xml.status === 200) {
                try {
                    let response = JSON.parse(xml.responseText);
                    if ("error" in response) {
                        document.getElementById("loginError").innerHTML = response.error;
                        setTimeout(hideLoginError, 3000);
                    } else {
                        userId = response.id;
                        fname = response.firstName;
                        lname = response.lastName;
                        document.getElementById("loginError").innerHTML = "Found user " + fname + " " + lname;
                        setTimeout(hideLoginError, 3000);
                    }
                } catch (error) {
                    document.getElementById("loginError").innerHTML = "Invalid response format.";
                    setTimeout(hideLoginError, 3000);
                }
            } else {
                document.getElementById("loginError").innerHTML = "Server error. Please try again later.";
                setTimeout(hideLoginError, 3000);
            }
        }
    };
}
