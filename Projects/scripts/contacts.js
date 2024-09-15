userIdNum = -1; //TODO cookies
savedFirstName = "";
savedLastName = "";
loadCookiesContactsPage();

//for pagination:
let currentPage = 1;
let contactCount = 0;



function redirectToMain() {
    window.open("index.html");
}



function loadCookiesContactsPage() {
    let data = document.cookie;
    if (!data) {
        console.log("No cookies found.");
        setTimeout(redirectToMain, 1000);

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


function onEditDeleteClick(item, contactID) {
    // let contactId = item.contactId;
    let lastName = item.lastName;
    let firstName = item.firstName;
    let email = item.email;
    console.log("EDIT DELETE " + contactID +" : " + email);

    editData(item, contactID);

}

function retrieveContact(){

    let search = document.getElementById("searchBox")!=null? document.getElementById("searchBox").value : null;


    console.log(userIdNum);

    let pageNum =currentPage;

    let tmp = {search: search,userId: userIdNum, page: pageNum};
    if(search != null && !search){
        tmp = {userId: userIdNum, page: pageNum};
    }
    let searchJSON = JSON.stringify(tmp);

    console.log(searchJSON);

    let xml = new XMLHttpRequest();
    let url = "http://cm.matthewe.me/testing/Backend/searchContact.php";


    xml.open("POST", url, true);
    xml.setRequestHeader("Content-type", "application/json");

    try {

        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xml.responseText);
                const tableBody = document.getElementById("tableBody");

                console.log(response);

                tableBody.innerHTML = "";
                if (response.error != null) {

                    //DISPLAY ERROR.
                    //TODO
                    return;
                }
                contactCount = response.count;
                renderDetails();
                response.results.forEach(function(item) {
                    let contactID = item.contactId;
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
                        onEditDeleteClick(item, contactID);
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

retrieveContact(); //Original search.

function editData(item, contactID){
    //open the edit/delete page
    window.location.href = "http://cm.matthewe.me/testing/editDeleteContact.html";

    let newFirstName = document.getElementById("fNameEdit").value;
    let newLastName = document.getElementById("lNameEdit").value;
    let newEmail = document.getElementById("emailEdit").value;

    //convert to JSON:
    let tmp = {id: contactID, userId: userIdNum, firstName: newFirstName, lastName: newLastName, email: newEmail};
    let Changes = JSON.stringify(tmp);

    //if the delete button has been clicked:
    document.getElementById("deleteContact").onclick = function(){
        //button has been clicked, send the information of contact to be deleted:
        let delFname = item.firstName;
        let delLname = item.lastName;
        let delEmail = item.email;

        console.log(contactID);
        console.log(userIdNum);
        console.log(delFname);
        console.log(delLname);
        console.log(delEmail);

        let deltmp = {id: contactID, userId: userIdNum, firstName: delFname, lastName: delLname, email: delEmail};
        let deleteString = JSON.stringify(deltmp);

        let url ="http://cm.matthewe.me/testing/Backend/deleteContact.php";
        let xml = new XMLHttpRequest();
        xml.open("POST", url, true);
        xml.send(deleteString);
        if(xml.readyState===4 && xml.status === 200) {
            let response;

            try {
                response = JSON.parse(xml.responseText);
                console.log(response);
            } catch (error) {
                //output error msg:
            }
            if ("error" in response) {
                //output error msg:
                return;
            }
            //output that the message has been deleted:

            //return to the contacts page:
            window.location.href = "http://cm.matthewe.me/testing/myContacts.html";
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
            //try to see if it is a json value, if not then it is a string and there was a issue.
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

                //direct user back to the menu:
                window.open("myContacts.html");
            }
        }
    }
}
window.addEventListener('DOMContentLoaded', (event) => {
    renderDetails(); // Call the function when the DOM is ready
});

function renderDetails() {
    try {
        // Validate contactCount and currentPage
        const totalContacts = (typeof contactCount === 'number' && !isNaN(contactCount) && contactCount >= 0) ? contactCount : '0';
        const currentPageNumber = (typeof currentPage === 'number' && !isNaN(currentPage) && currentPage > 0) ? currentPage : '1';

        // Retrieve and validate the HTML elements
        const totalContactsElement = document.getElementById("totalContactsNum");
        const currentPageElement = document.getElementById("pageContactsNum");

        // Check if elements exist and update them
        if (totalContactsElement) {
            totalContactsElement.textContent = totalContacts;
        } else {
            console.error('Element with ID "totalContactsNum" not found. Check the HTML for correct ID.');
        }

        if (currentPageElement) {
            currentPageElement.textContent = currentPageNumber;
        } else {
            console.error('Element with ID "pageContactsNum" not found. Check the HTML for correct ID.');
        }
    } catch (error) {
        console.error('Error in renderDetails function:', error.message, error.stack);
    }
}

function prevPage(){
    //at least the first page.
    if (contactCount<=10)return;
    if(currentPage > 1){

        currentPage--;
        retrieveContact();
        //go to previous data:

    }
}


function nextPage(){
    if (contactCount<=10)return;

    let totalPages = (contactCount / 10) + (contactCount % 10 > 0 ? 1 : 0);

    if(currentPage < totalPages){
        currentPage++;
        retrieveContact();

        //move to the next set of data:
    }
}
