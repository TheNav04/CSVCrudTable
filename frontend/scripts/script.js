import { fillTable, sendNewEntry } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM event");
    localStorage.removeItem('modifyFormState');
    document.getElementById('formButton').addEventListener('click', (event) => {
        event.preventDefault();
        console.log('user form clicked!'); 

        sendNewEntry(document.getElementById('formName').value, document.getElementById('formAge').value, document.getElementById('formGender').value);
    });

    //async chain for server data
    fillTable();

    console.log('-------------');    
});

//how to strucuter my code?
//use fill table in getServerData() function or after it was called in global scope

//will probably need to be async
//uses data from server





