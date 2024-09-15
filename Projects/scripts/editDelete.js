userIdNum = -1; //TODO cookies
savedFirstName = "";
savedLastName = "";
loadCookiesContactsPage();

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

document.addEventListener("DOMContentLoaded", function() {
    // Extract contactId from the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const contactId = urlParams.get('contactId');

    // Log or use the contactId as needed
    console.log("Extracted ContactId:", contactId);

    triggerOnWindowLoad(contactId);

});


function triggerOnWindowLoad( contactID) {
    //open the edit/delete page
    // window.location.href = "http://cm.matthewe.me/testing/editDeleteContact.html?userId="+userId+"&contactId="+contactID;

    let newFirstName = document.getElementById("fNameEdit").value;
    let newLastName = document.getElementById("lNameEdit").value;
    let newEmail = document.getElementById("emailEdit").value;

    //convert to JSON:
    let tmp = {id: contactID, userId: userIdNum, firstName: newFirstName, lastName: newLastName, email: newEmail};
    let Changes = JSON.stringify(tmp);

    //if the delete button has been clicked:
    document.getElementById("deleteContact").onclick = function () {
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

        let url = "http://cm.matthewe.me/testing/Backend/deleteContact.php";
        let xml = new XMLHttpRequest();
        xml.open("POST", url, true);
        xml.send(deleteString);
        if (xml.readyState === 4 && xml.status === 200) {
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

    let url = "http://cm.matthewe.me/testing/Backend/editContact.php";

    let xml = new XMLHttpRequest();
    xml.open("POST", url, true);
    xml.send(Changes);

    xml.onreadystatechange = function () {
        if (xml.readyState === 4 && xml.status === 200) {
            let response;
            //get the response.
            //try to see if it is a json value, if not then it is a string and there was a issue.
            try {
                response = JSON.parse(xml.responseText);
            } catch (error) {
                response = null;
                //output error msg:
            }
            //if we got a json file
            if (response != null) {
                if ("error" in response) {
                    //output error msg:
                    return;
                }

                //direct user back to the menu:
                window.location.href = "myContacts.html";

            }
        }
    }

}

