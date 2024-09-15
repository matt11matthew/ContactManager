// userIdNum = -1; //TODO cookies
// savedFirstName = "";
// savedLastName = "";
// // loadCookiesContactsPage();
//
// // console.log(globalEdit.globalUserId);
// // console.log(globalEdit.globalContactId);
// // console.log(globalEdit.globalFname);
// // console.log(globalEdit.globalLname);
// // console.log(globalEdit.globalEmail);
// //
// // //populate the fields with the information:
// // window.onload = function (){
// //     document.getElementById("fName").value = globalEdit.globalFname;
// //     document.getElementById("lName").valkue = globalEdit.globalLname;
// //     document.getElementById("email").value = globalEdit.globalEmail;
// // }
//
// // function loadCookiesContactsPage() {
// //     let data = document.cookie;
// //     if (!data) {
// //         console.log("No cookies found.");
// //         setTimeout(redirectToMain, 1000);
// //
// //         return;
// //     }
// //
// //     let splits = data.split(",");
// //     for(var i = 0; i < splits.length; i++)
// //     {
// //         let thisOne = splits[i].trim();
// //         let tokens = thisOne.split("=");
// //         if( tokens[0] == "firstName" )
// //         {
// //             savedFirstName = tokens[1];
// //         }
// //         else if( tokens[0] == "lastName" )
// //         {
// //             savedLastName = tokens[1];
// //         }
// //         else if( tokens[0] == "userId" )
// //         {
// //             userIdNum = parseInt( tokens[1].trim() );
// //         }
// //     }
// //
// //     console.log(userIdNum);
// //     console.log(savedFirstName);
// //     console.log(savedLastName);
// // }
//
// // document.addEventListener("DOMContentLoaded", function() {
// //     // Extract contactId from the current URL
// //     const urlParams = new URLSearchParams(window.location.search);
// //     const contactId = urlParams.get('contactId');
// //
// //     // Log or use the contactId as needed
// //     console.log("Extracted ContactId:", contactId);
// //
// //     triggerOnWindowLoad(contactId);
// //
// // });
//
//
// // function setupDeleteOnClick(contactID) {
// //     //convert to JSON:
// //     // let tmp = {id: contactID, userId: userIdNum, firstName: newFirstName, lastName: newLastName, email: newEmail};
// //     // let Changes = JSON.stringify(tmp);
// //
// //     //if the delete button has been clicked:
// //     document.getElementById("deleteContact").onclick = function () {
// //         //button has been clicked, send the information of contact to be deleted:
// //         let delFname = item.firstName;
// //         let delLname = item.lastName;
// //         let delEmail = item.email;
// //
// //         console.log(contactID);
// //         console.log(userIdNum);
// //         console.log(delFname);
// //         console.log(delLname);
// //         console.log(delEmail);
// //
// //         let deltmp = {id: contactID, userId: userIdNum, firstName: delFname, lastName: delLname, email: delEmail};
// //         let deleteString = JSON.stringify(deltmp);
// //
// //         let url = "http://cm.matthewe.me/testing/Backend/deleteContact.php";
// //         let xml = new XMLHttpRequest();
// //         xml.open("POST", url, true);
// //         xml.send(deleteString);
// //         if (xml.readyState === 4 && xml.status === 200) {
// //             let response;
// //
// //             try {
// //                 response = JSON.parse(xml.responseText);
// //                 console.log(response);
// //             } catch (error) {
// //                 // could only be issue with json.parse
// //                 response = null;
// //                 //output error msg:
// //                 document.getElementById("deleteError").innerHTML = "There was an issue with deleting the contact.";
// //             }
// //             // could only be a php issue
// //             if ("error" in response) {
// //                 document.getElementById("deleteError").innerHTML = response.error;
// //                 setTimeout(hideLoginError, 3000);
// //                 return;
// //             }
// //             //output that the message has been deleted:
// //
// //             //return to the contacts page:
// //             window.location.href = "http://cm.matthewe.me/testing/myContacts.html";
// //         }
// //     }
// // }
//
// // function triggerOnWindowLoad(contactID) {
// //
// //     let newFirstName = document.getElementById("fNameEdit");
// //     let newLastName = document.getElementById("lNameEdit");
// //     let newEmail = document.getElementById("emailEdit");
// //
// //     setupDeleteOnClick();
// //
// // }
//
// //on confirm edit button press.
// // function editContact(){
// //     let url = "http://cm.matthewe.me/testing/Backend/editContact.php";
// //     let tmp = {contactId: globalEdit.globalContactId, userId: globalEdit.globalUserId, firstName: globalEdit.globalFname, lastName: globalEdit.globalLname, email: globalEdit.globalEmail};
// //     let Changes = JSON.stringify(tmp);
// //
// //     let xml = new XMLHttpRequest();
// //     xml.open("POST", url, true);
// //     xml.send(Changes);
// //
// //     try {
// //         xml.onreadystatechange = function () {
// //             if (this.readyState === 4 && this.status === 200) {
// //                 let response = JSON.parse(xml.responseText);
// //                 if (response.error != null) {
// //                     //DISPLAY ERROR.
// //                     //TODO
// //                     return;
// //                 }
// //                 //edit has been completed: output completion notification and go back to contact page.
// //             }
// //         };
// //     }catch (error){
// //         //error msg:
// //     }
// // }
//
