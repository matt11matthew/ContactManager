let userId = 0;
let fname = "";
let lname = "";

function hideLoginError() {
    document.getElementById("loginError").innerHTML = "";
}

function onRegister(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    userId = 0;
    fname = "";
    lname = "";

    // Get information from the HTML inputs
    let firstName = document.getElementsByName("firstName")[0].value;
    let lastName = document.getElementsByName("lastName")[0].value;
    let userLogin = document.getElementsByName("username")[0].value;
    let userPass = document.getElementsByName("password")[0].value;
    let confirmPass = document.getElementsByName("confirmPassword")[0].value;

    // Turn info into JSON format
    let tmp = {
        firstName: firstName,
        lastName: lastName,
        username: userLogin,
        password: userPass,
        confPassword: confirmPass
    };
    let registerJson = JSON.stringify(tmp);

    // URL location of PHP file
    let url = "http://cm.matthewe.me/testing/Backend/register.php";

    // Post request to the REST API
    let xml = new XMLHttpRequest();

    // Using the static URL
    xml.open("POST", url, true);
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(registerJson);

    // When a response is ready
    xml.onreadystatechange = function () {
        if (xml.readyState === 4) {
            if (xml.status === 200) {
                let response;
                // Try to see if it is a JSON value, if not then it is a string and there was a login issue
                try {
                    response = JSON.parse(xml.responseText);
                } catch (error) {
                    response = null;
                    // Output error message
                    document.getElementById("loginError").innerHTML = "There was an issue with username or password.";
                }
                // If we got a JSON response
                if (response !== null) {
                    if ("error" in response) {
                        document.getElementById("loginError").innerHTML = response.error;
                        setTimeout(hideLoginError, 3000);
                        return;
                    }
                    console.log(response);
                    // Save the information we got about the user
                    userId = response.id;
                    fname = response.firstName;
                    lname = response.lastName;
                    document.getElementById("loginError").innerHTML = "Found user " + fname + " " + lname;

                    setTimeout(hideLoginError, 3000);
                    // Direct user to the menu
                    // window.open("testMenu.html");
                }
            } else {
                // Handle server errors
                document.getElementById("loginError").innerHTML = "Server error. Please try again later.";
                setTimeout(hideLoginError, 3000);
            }
        }
    };
}
