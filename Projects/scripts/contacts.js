function retrieveContact(){
    let search = document.getElementById("searchCrit");
    let table = document.getElementById("contactTable");

    let tmp = {search: search,userID: 1};
    let searchJSON = JSON.stringify(tmp);
    let xml = new XMLHttpRequest();
    let url = "http://cm.matthewe.me/testing/Backend/searchContact.php";

    xml.open("GET", url, true);
    xml.send(searchJSON);

    xml.onreadystatechange = function(){
        if(xml.readyState ===4 && xml.status === 200){
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
            console.log(response);
            if(response != null){
                if ("error" in response) {
                    //output error msg:

                    return;
                }
                //add the info to the table:
                for(let i=0; i<response.length; i++) {
                    let newContact = table.insertRow(table.rows.length);
                    newContact.insertCell(0).innerHTML = response.firstName;
                    newContact.insertCell(1).innerHTML = response.lastName;
                    newContact.insertCell(2).innerHTML = response.email;
                    newContact.insertCell(3).innerHTML =
                        '<button type="button" onClick={editData(this)}>Edit/Delete</button>'
                }
            }
        }
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