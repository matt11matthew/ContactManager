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


function onEditDeleteClick(item) {
    let contactId = item.contactId;
    let lastName = item.lastName;
    let firstName = item.firstName;
    let email = item.email;
    console.log("EDIT DELETE " + contactId +" : " + email);

    editData(item);

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
                        onEditDeleteClick(item);
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

function editData(item){
    //open the edit/delete page
    window.location.href = "http://cm.matthewe.me/testing/editDeleteContact.html";

    let newFirstName = document.getElementById("fNameEdit").value;
    let newLastName = document.getElementById("lNameEdit").value;
    let newEmail = document.getElementById("emailEdit").value;

    //convert to JSON:
    let tmp = {fistName: newFirstName, lastName: newLastName, email: newEmail};
    let Changes = JSON.stringify(tmp);

    //if the delete button has been clicked:
    document.getElementById("deleteContact").onclick = function(){
        //button has been clicked, send the information of contact to be deleted:
        let delFname = item.firstName;
        let delLname = item.lastName;
        let delEmail = item.email;
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

function renderDetails() {
    try {
        // Safely retrieve the total contacts and current page, defaulting if invalid
        const totalContacts = (typeof contactCount === 'number' && !isNaN(contactCount)) ? contactCount : '0';
        const currentPageNumber = (typeof currentPage === 'number' && !isNaN(currentPage)) ? currentPage : '1';

        // Retrieve the elements and check if they exist before updating
        const totalContactsElement = document.getElementById("totalContactsNum");
        const currentPageElement = document.getElementById("pageContactsNum");

        if (totalContactsElement) {
            totalContactsElement.textContent = totalContacts;
        } else {
            console.error('Element with ID "totalContactsNum" not found.');
        }

        if (currentPageElement) {
            currentPageElement.textContent = currentPageNumber;
        } else {
            console.error('Element with ID "pageContactsNum" not found.');
        }
    } catch (error) {
        console.error('Error in renderDetails function:', error);
    }
}

renderDetails();


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
