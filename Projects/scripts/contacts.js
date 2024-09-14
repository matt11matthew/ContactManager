userIdNum = -1; //TODO cookies
savedFirstName = "";
savedLastName = "";
loadCookiesContactsPage();


function redirectToMain() {
    window.open("index.html");
}

function loadCookiesContactsPage() {
    let data = document.cookie;
    if (!data) {
        console.log("No cookies found.");
        setTimeout(redirectToMain, 3000);

        return;
    }

    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++)
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if( tokens[0] == "firstName" )
        {
            savedFirstName = tokens[1];
        }
        else if( tokens[0] == "lastName" )
        {
            savedLastName = tokens[1];
        }
        else if( tokens[0] == "userId" )
        {
            userIdNum = parseInt( tokens[1].trim() );
        }
    }

    console.log(userIdNum);
    console.log(savedFirstName);
    console.log(savedLastName);


}

function retrieveContact(){
    let search = document.getElementById("searchBox").value;

    console.log(userIdNum);

    let pageNum = 1;

    let tmp = {search: search,userId: userIdNum, page: pageNum};
    if(search != null && !search){
        tmp = {userId: userIdNum, page: pageNum};
    }
    let searchJSON = JSON.stringify(tmp);

    console.log(searchJSON);

    let xml = new XMLHttpRequest();
    let url = "http://cm.matthewe.me/testing/Backend/searchContact.php";


    xml.open("GET", url, true);
    xml.setRequestHeader("Content-type", "application/json");

    try {

        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xml.responseText);
                const tableBody = document.getElementById("tableBody");

                console.log(response);

                tableBody.innerHTML = "";
                response.results.forEach(function(item) {
                    const row = document.createElement("tr");

                    const fName = document.createElement("td");
                    fName.textContent = item.firstName;
                    row.appendChild(fName);
                    const lName = document.createElement("td");
                    lName.textContent = item.lastName;
                    row.appendChild(lName);
                    const email = document.createElement("td");
                    email.textContent = item.email;
                    row.appendChild(email);
                    const edit = document.createElement("button");
                    edit.textContent = "edit/delete";
                    edit.id = "editDeleteButton";
                    edit.onclick = function(){
                        //edit button stuff:
                    }
                    row.appendChild(edit);
                    tableBody.appendChild(row);
                });
            }
        };
        xml.send(searchJSON);
    }catch (error){
        //error msg:
    }

}

function editData(button){
    //open the edit/delete page
    window.open("http://cm.matthewe.me/testing/editDeleteContact.html");

    let contact = button.parentNode.parentNode;

    let newFirstName = document.getElementById("fName").value;
    let newLastName = document.getElementById("lName").value;
    let newEmail = document.getElementById("email").value;

    //convert to JSON:
    let tmp = {fistName: newFirstName, lastName: newLastName, email: newEmail};
    let Changes = JSON.stringify(tmp);

    //if the delete button has been clicked:
    document.getElementById("deleteContact").onclick = function(){
        //button has been clicked, send the information of contact to be deleted:
        let delFname = contact.cells[0];
        let delLname = contact.cells[1];
        let delEmail = contact.cells[2];
        let deltmp = {firstName: delFname, lastName: delLname, email: delEmail};
        let deleteString = JSON.stringify(deltmp);

        let url ="http://cm.matthewe.me/testing/Backend/deleteContact.php";
        let xml = new XMLHttpRequest();
        xml.open("POST", url, true);
        xml.send(deleteString);
        if(xml.readyState===4 && xml.status === 200) {
            let response;
            try {
                response = JSON.parse(xml.responseText);
            } catch (error) {
                //output error msg:
            }
            if ("error" in response) {
                //output error msg:
                return;
            }
            //output that the message has been deleted:
            //return to the contacts page:
        }
    }

    let url ="http://cm.matthewe.me/testing/Backend/editContact.php";

    let xml = new XMLHttpRequest();
    xml.open("POST", url, true);
    xml.send(Changes);

    xml.onreadystatechange = function (){
        if(xml.readyState===4 && xml.status === 200){
            let response;
            //get the response.
            //try to see if it is a json value, if not then it is a string and there was a login issue.
            try{
                response = JSON.parse(xml.responseText);
            }catch(error){
                response = null;
                //output error msg:

            }
            //if we got a json file
            if(response != null){
                if ("error" in response) {
                    //output error msg:

                    return;
                }
                //let user know it has been completed:
                //change "loginError" to whatever it will be----------
                document.getElementById("loginError").innerHTML = "Found user " + fname +" " + lname;
                setTimeout(hideLoginError, 3000);

                //direct user back to the menu:
                window.open("myContacts.html");
            }
        }
    }
}