const urlBase = 'http://cm.matthewe.me';
const apiPath = '';
const extension = 'php';

// NOTE: ALL document.getElementById() calls need updated tags from frontend

// Variables
let userId = 0;
let username = '';
let password = '';
let firstName = '';
let lastName = '';
let email = '';
let phone = '';
let address = '';

// Registers a new user account
function register() {
    // Default to userId 0
    userId = 0;

    // Get login information
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    document.getElementById('username').innerHTML = '';

    let loginInfo = {username: username, password: password};
    let payload = JSON.stringify(loginInfo);

    let url = urlBase + apiPath + '/register.' + extension;

    // Open HTTP request (POST)
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    try {
        xhr.onreadystatechange = function() {
            // 200 response
            if (this.readyState == 4 && this.status == 200) {
                // Parse JSON response and get userId
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById('registerResult').innerHTML = 'Registration failed';
                    console.log('Registration failed');
                    return;
                }

                // Store user information
                firstName = document.getElementById('firstName').value;
                lastName = document.getElementById('lastName').value;
                // Unknown if including at the moment
                // email = document.getElementById('email').value;
                // phone = document.getElementById('phone').value;
                // address = document.getElementById('address').value;

                // Return to home page
                window.location.href = 'index.html';
            }
        }
        // Send JSON response
        console.log('Sending payload: ' + payload);
        xhr.send(payload);
    } catch(err) {
        console.log('Unexpected error: ' + err);
    }
}

// Logs a user into their account
function login() {
    // Default to userId 0
    userId = 0;

    // Get login information
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    document.getElementById('username').innerHTML = '';

    let loginInfo = {username: username, password: password};
    let payload = JSON.stringify(loginInfo);

    let url = urlBase + apiPath + '/register.' + extension;

    // Open HTTP request (POST)
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    try {
        xhr.onreadystatechange = function() {
            // 200 response
            if (this.readyState == 4 && this.status == 200) {
                // Parse JSON response and get userId
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById('loginResult').innerHTML = 'Username and password combination incorrect';
                    console.log('Login failed');
                    return;
                }

                // Store user information
                username = jsonObject.username;
                password = jsonObject.password;

                // Go to account page
                window.location.href = 'account.html'; // NEEDS ADJUSTMENT
            }
        }
        // Send JSON response
        console.log('Sending payload: ' + payload);
        xhr.send(payload);
    } catch(err) {
        console.log('Unexpected error: ' + err);
    }
}

// Logs a user out of their account
function logout() {
    // Reset all variables and return to home page
    userId = 0;
    username = '';
    password = '';
    firstName = '';
    lastName = '';
    email = '';
    phone = '';
    address = '';
    window.location.href = 'index.html';
}

// Get user's specific contacts using their userId as key
function getContacts() {
    // Default to userId 0
    userId = 0;

    //

    let url = urlBase + apiPath + '/getContacts.' + extension;

    // Open HTTP request (GET)
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
}

// Adds a new contact to userId's account
function addContact() {

}

// Deletes a contact from userId's account
function deleteContact() {

}

// Updates a contact in userId's account
function updateContact() {

}

// Finds a specific contact in userId's account
function findContact() {

}
