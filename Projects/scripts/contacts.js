userIdNum = -1; //TODO cookies
savedFirstName = "";
savedLastName = "";
globalContactId = -1;
loadCookiesContactsPage();

//for pagination:
let cur_Page = 1;
let totalPages;

function redirectToMain() {
    window.open("http://cm.matthewe.me/testing/index.html");
}

//back to contact?
function redirectToContacts() {
    window.location = "myContacts.html";
}

function loadCookiesContactsPage() {
    let data = document.cookie;
    if (!data) {
        console.log("No cookies found.");
        setTimeout(redirectToMain, 1000);

        return;
    }

    let splits = data.split(",");
    for(let i = 0; i < splits.length; i++)
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

document.addEventListener('DOMContentLoaded', () => {
    window.retrieveContact = function() {



        let search = document.getElementById("searchBox") != null ? document.getElementById("searchBox").value : null;

        console.log(userIdNum);

        let pageNum = 1;

        let tmp = {search: search, userId: userIdNum, page: pageNum};
        if (search != null && !search) {
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

                    if (tableBody) {
                        tableBody.innerHTML = ""; // Clear existing rows

                        if (response.error) {
                            console.error(response.error);
                            return;
                        }
                        if (response.error != null) {

                            //DISPLAY ERROR.
                            //TODO
                            return;
                        }
                        response.results.forEach(function (item) {
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
                            edit.addEventListener('click', () => editData(item));
                            row.appendChild(edit);
                            tableBody.appendChild(row);
                        });
                    } else {
                        //table body not found.
                    }
                }
            };
            xml.send(searchJSON);
        } catch (error) {
            //error msg:
        }
    }
    retrieveContact();

    window.editData = function(item) {
        globalContactId = item.contactId;
        const url = "http://cm.matthewe.me/testing/editDeleteContact.html?" +
            "contactId=" + encodeURIComponent(item.contactId) +
            "&firstName=" + encodeURIComponent(item.firstName) +
            "&lastName=" + encodeURIComponent(item.lastName) +
            "&email=" + encodeURIComponent(item.email);

        //open the edit/delete page
        window.location.href = url.toString();
    }

});

function editContact(){
    event.preventDefault();

    let newFname = document.getElementById("fNameEdit").value;
    let newLname = document.getElementById("lNameEdit").value;
    let newEmail = document.getElementById("emailEdit").value;

    console.log(globalContactId);
    console.log(userIdNum);
    console.log(newFname);
    console.log(newLname);
    console.log(newEmail);

    let url = "http://cm.matthewe.me/testing/Backend/editContact.php";
    let tmp = {
        id: globalContactId,
        userId: userIdNum,
        firstName: newFname,
        lastName: newLname,
        email: newEmail
    };
    let Changes = JSON.stringify(tmp);

    let xml = new XMLHttpRequest();
    xml.open("POST", url, true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(Changes);

    try {
        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xml.responseText);
                if (response.error != null) {
                    //DISPLAY ERROR.
                    //TODO
                    console.error('Error:', response.error);
                    return;
                }
                //edit has been completed: output completion notification and go back to contact page.
                //alert('Contact updated successfully!');
                // window.location.href = "http://cm.matthewe.me/testing/myContacts.html";
                window.location.href = "myContacts.html";
            }
            else{
                console.error('HTTP Error:', this.status);
            }
        };
    }catch (error){
        //error msg:
    }
}

function prevPage(){
    //at least the first page.
    if(cur_Page > 1){
        cur_Page--;
        //go to previous data:
    }
}

function nextPage(){
    if(cur_Page < totalPages){
        cur_Page++;
        //move to the next set of data:
    }
}

function numPages(){

}