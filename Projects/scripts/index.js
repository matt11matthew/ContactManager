userIdNum = -1; //TODO cookies
savedFirstName = "";
savedLastName = "";
loadCookies();

function redirectToContacts() {
    window.location.href = "myContacts.html";
}
function redirectToLogin() {
    window.location.hre = "testLogin.html";
}

function loadCookies() {
    let data = document.cookie;
    if (!data) {
        console.log("No cookies found.");
        setTimeout(redirectToLogin, 500);
        
        return;
    }

    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++)
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if( tokens[0] == "firstName" )
        {
            savedFirstName = tokens[1].trim() ;
        }
        else if( tokens[0] == "lastName" )
        {
            savedLastName = tokens[1].trim() ;
        }
        else if( tokens[0] == "userId" )
        {
            userIdNum = parseInt( tokens[1].trim() );
        }
    }

    console.log(userIdNum);
    console.log(savedFirstName);
    console.log(savedLastName);
    setTimeout(redirectToContacts, 1000);


}
