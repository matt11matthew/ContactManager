// const url = 'http://name.com/whatever';

let userId = 0;
let fname = "";
let lname = "";

function hideLoginError() {
    document.getElementById("loginError").innerHTML = "";
}

function UserLogin(){
    userId = 0;
    fname = "";
    lname = "";


    //get information from the html inputs.
    let userLogin = document.getElementById("username").value;
    let userPass = document.getElementById("password").value;

    //turn info into json formatting.
    let tmp = {username: userLogin, password: userPass};
    let LoginJson = JSON.stringify(tmp);

    //url location of php file.
    let url ="http://cm.matthewe.me/testing/Backend/login.php";

    //post req to the rest api:
    let xml = new XMLHttpRequest();

    //temporarily using static url:
    xml.open("POST", url, true);
    xml.send(LoginJson);
    //when a response is ready.
    xml.onreadystatechange = function (){
        //200: Successfully logged in. - via swaggerhub.
        if(xml.readyState===4 && xml.status === 200){
            let response;
            //get the response.
            //try to see if it is a json value, if not then it is a string and there was a login issue.
            try{
                response = JSON.parse(xml.responseText);
            }catch(error){
                response = null;
                //output error msg:
                document.getElementById("loginError").innerHTML = "There was an issue with username or password.";
            }
            //if we got a json file
            if(response != null){

                if ("error" in response) {
                    document.getElementById("loginError").innerHTML = response.error;
                    setTimeout(hideLoginError, 3000);
                    return;
                }
                console.log(response)
                //save the information we got about user:
                userId = response.id;
                fname = response.firstName;
                lname = response.lastName;
                document.getElementById("loginError").innerHTML = "Found user " + fname +" " + lname;

                setTimeout(hideLoginError, 3000);
                //direct user to the menu:
                // window.open("testMenu.html");
            }
        }
    }

}