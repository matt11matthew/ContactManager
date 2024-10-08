userIdNum = -1; //TODO cookies
savedFirstName = "";
savedLastName = "";
globalContactId = -1;
loadCookiesContactsPage();
globalfirst = "";
globallast = "";
globalemail = "";

//for pagination:
let cur_Page = 1;
let totalPages;

function redirectToMain() {
    window.open("http://cm.matthewe.me/testing/index.html");
    // window.location.href = "http://cm.matthewe.me/testing/index.html";
}


//back to contact?
function redirectToContacts() {
    window.location = "myContacts.html";
    // window.location.href = "http://cm.matthewe.me/testing/myContacts.html";
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

function updateMaxPage() {
    let xml = new XMLHttpRequest();
    let url = "http://cm.matthewe.me/testing/Backend/searchContact.php";
    xml.open("POST", url, true);
    xml.setRequestHeader("Content-type", "application/json");

    totalPages = 1;

    try {
        let search = document.getElementById("searchBox") != null ? document.getElementById("searchBox").value : null;

        let tmp = {search: search, userId: userIdNum, maxPage: true};
        if (search != null && !search) {
            tmp = {userId: userIdNum, maxPage: true};
        }
        let searchJSON = JSON.stringify(tmp);

        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xml.responseText);

                if (response.error)return;

                let count = response.count;

                // console.log("TOTAL CT:" +count);
                totalPages = Math.ceil(count / 10); // Ensures totalPages is a whole number

                renderDetails();
                console.log(response);


            }
        };
        xml.send(searchJSON);
    } catch (error) {
        //error msg:
    }
}

let lastSearch = null;

function updateLastSearch(search) {
    if (search){
        if (search!==lastSearch){
            lastSearch = search;
            cur_Page =  1;
        }
    } else {
        if (lastSearch){
            lastSearch = null;
            cur_Page =  1;
        }
    }
}

function onNoResults() {
    //TODO NO RESULT HANDLE

}

document.addEventListener('DOMContentLoaded', () => {
    window.retrieveContact = function() {



        let search = document.getElementById("searchBox") != null ? document.getElementById("searchBox").value : null;

        updateLastSearch(search);

        console.log(userIdNum);


        let tmp = {search: search, userId: userIdNum, page: cur_Page};
        if ((search != null && !search)||search==null) {
            tmp = {userId: userIdNum, page: cur_Page};
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
                            totalPages = 1;
                            contactCount = 0;
                            cur_Page = 1;

                            onNoResults();
                            renderDetails();
                            console.error(response.error);
                            return;
                        }

                        contactCount = response.count;
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
                    updateMaxPage();
                }
            };
            xml.send(searchJSON);
        } catch (error) {
            //error msg:
        }
    }

    updateMaxPage();
    retrieveContact();

    window.editData = function(item) {
        globalContactId = item.contactId;
        //temp testing url:
        const url = "editDeleteContact.html?" +
        // const url = "http://cm.matthewe.me/testing/editDeleteContact.html?" +
            "contactId=" + encodeURIComponent(item.contactId) +
            "&firstName=" + encodeURIComponent(item.firstName) +
            "&lastName=" + encodeURIComponent(item.lastName) +
            "&email=" + encodeURIComponent(item.email);

        //open the edit/delete page
        window.location.href = url.toString();
    }

});

function editContact(action){
    event.preventDefault();

    if(action === "edit") {
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
                } else {
                    // console.error('HTTP Error:', this.status);
                }
            };
        } catch (error) {
            //error msg:
        }
    }else if(action === 'delete'){
        console.log(globalContactId);
        console.log(userIdNum);
        console.log(globalfirst);
        console.log(globallast);
        console.log(globalemail);

        let url = "http://cm.matthewe.me/testing/Backend/deleteContact.php";
        let tmp = {
            id: globalContactId,
            userId: userIdNum,
            firstName: globalfirst,
            lastName: globallast,
            email: globalemail
        }
        let payload = JSON.stringify(tmp)
        let xml = new XMLHttpRequest();
        xml.open("POST", url, true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.send(payload);
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
                    //might need to change to the url. i changed it
                    // window.location.href = "http://cm.matthewe.me/testing/myContacts.html";
                    window.location = "myContacts.html";
                }
                else{
                    // console.error('HTTP Error:', this.status);
                }
            };
        }catch (error){
            //error msg:
        }
    }
}

let contactCount = 0;

window.addEventListener('DOMContentLoaded', (event) => {
    renderDetails(); // Call the function when the DOM is ready
});

function renderDetails() {
    try {
        // Validate contactCount and currentPage
        const totalContacts = (typeof contactCount === 'number' && !isNaN(contactCount) && contactCount >= 0) ? contactCount : '0';
        const currentPageNumber = (typeof cur_Page === 'number' && !isNaN(cur_Page) && cur_Page > 0) ? cur_Page : '1';
        const totalPagesNumber = (typeof totalPages === 'number' && !isNaN(totalPages) && totalPages > 0) ? totalPages : '1';

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
            currentPageElement.textContent = currentPageNumber + "/"+totalPagesNumber;
        } else {
            console.error('Element with ID "pageContactsNum" not found. Check the HTML for correct ID.');
        }
    } catch (error) {
        console.error('Error in renderDetails function:', error.message, error.stack);
    }
}
function nextPage() {
    // if (contactCount <= 10) return;

    // let totalPages = (contactCount / 10) + (contactCount % 10 > 0 ? 1 : 0);

    console.log(cur_Page+"/"+totalPages);
    if (cur_Page < totalPages) {
        console.log("NEXT");


        if (cur_Page < totalPages) {
            cur_Page++;
            renderDetails();
            retrieveContact();
            //move to the next set of data:
        }
    }

}


function prevPage() {
    //at least the first page.
    // if (contactCount <= 10) return;
    if (cur_Page > 1) {

        if (cur_Page > 1) {
            cur_Page--;
            retrieveContact();
            renderDetails();
            //go to previous data:

        }
    }

}