
const table = document.getElementById('BaseTable');
document.addEventListener("DOMContentLoaded", () => {
  


});

//const table = document.getElementById('BaseTable');

export function modRowForm(row){
    console.log('modRow() function called');


    let isModFormPresent = localStorage.getItem('modifyFormState');
    console.log('the current state for form: ' + isModFormPresent);


    if(isModFormPresent === null){
        console.log('\tif statement being called')
        localStorage.setItem('modifyFormState', false); //this line not woring
        console.log('\t\tthe current state for form: ' + isModFormPresent);

    }
    else if(isModFormPresent === 'true'){
        console.log('\tRemove Previous Form To add New');
        document.getElementById('forTheForm').remove();
        localStorage.setItem('modifyFormState', false); //stored as string
    }


    //Create a form at the bottom
    const newDiv = document.createElement('div');
    newDiv.id = 'forTheForm';

    const title = document.createElement('h1');
    title.innerHTML = "Modify Data"    
    const subInfo = document.createElement('h4');
    const form = document.createElement('form');

    const nameLabel = document.createElement('label');
    const nameInput = document.createElement('input');

    const ageLabel = document.createElement('label');
    const ageInput = document.createElement('input');

    const genderLabel = document.createElement('label');
    const genderSelection = document.createElement('select');
    genderSelection.id = 'iGender';
    const optionMale = document.createElement('option');
    optionMale.value = 'male';
    optionMale.innerHTML = 'Male';
    const optionFemale = document.createElement('option');
    optionFemale.value = 'female';
    optionFemale.innerHTML = 'Female';
    const optionOther = document.createElement('option');
    optionOther.value = 'other';
    optionOther.innerHTML = 'Other';

    genderSelection.appendChild(optionMale);
    genderSelection.appendChild(optionFemale);
    genderSelection.appendChild(optionOther);

    nameLabel.innerHTML = 'Name:';
    nameInput.id = 'iName';
    nameInput.type = 'text';
    nameLabel.htmlFor = nameInput.id;   //for is a reserved name in JS to make loops\

    ageLabel.innerHTML = 'Age:';
    ageInput.id = 'iAge';
    ageInput.type = 'text';
    ageLabel.htmlFor = ageInput.id; 

    genderLabel.innerHTML = 'Gender:';

    const submitButton = document.createElement('button');  //TIP: use <button> over <input type="submit">
    submitButton.textContent = 'Submit';

    submitButton.addEventListener( 'click', (event) => { //TODO: Create a function that updates and sends data to server
        event.preventDefault();
        //TODO: GET NEW DATA THAT WE PLAN ON USING
        let arr = [document.getElementById('iName').value, document.getElementById('iAge').value, document.getElementById('iGender').value];

        modFormSubmitClicked(row, arr);     //how do i make this carry the same state as row where button was clicked
                                    
    }); 

    form.appendChild(nameLabel);
    form.appendChild(document.createElement('br'));
    form.appendChild(nameInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));
    form.appendChild(ageLabel);
    form.appendChild(document.createElement('br'));
    form.appendChild(ageInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));
    form.appendChild(genderLabel);
    form.appendChild(document.createElement('br'));
    form.appendChild(genderSelection);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));
    form.appendChild(submitButton);
    
    subInfo.textContent = "Modify For: " + row.cells[0].innerHTML; 

    newDiv.appendChild(title);
    newDiv.appendChild(subInfo);
    newDiv.appendChild(form);

    //adding to page
    document.getElementById('formDemo').appendChild(newDiv);
    localStorage.setItem('modifyFormState', true);

}

export function modFormSubmitClicked(orginRow, newRow){
    console.log("Submit was clicked");
    console.log("OG row");
    console.log(orginRow);
    console.log(orginRow.cells[0]);
    console.log(orginRow.cells[0].innerHTML);

    console.log("New row");
    console.log(newRow);

    console.log('What table is data in?');
    const table = orginRow.closest('table');
    console.log(table);

    console.log('which row index is data in');
    console.log('number of rows: ');
    console.log(table.rows);

    //use forEach() to iterate through, turn HTMLDOM object into an array
    //const rowArray = Array.from(table.rows);
    //const index = rowArray.indexOf(targetRow);


    let index = -1;
    for(let i = 0; i < table.rows.length; i++){
        console.log("index i: " + i);
        console.log(table.rows[i])


        if(table.rows[i] === orginRow){
            index = i;
            console.log('row found at index: ' + index);
            console.log('seperator');
        }
    }


    //Find the row that data entry is in
    //Send new row and index to server
        //HTTP POST
    //THEN refresh page OR run fillTable()
    sendData();
    async function sendData() {
        try { 
          const response = await fetch('/sendUpdate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'newName': newRow[0],
              'newAge': newRow[1],
              'newGender': newRow[2],
              'whereIsRow': index
            }),
          });

          //error -->  Failed to execute 'json' on 'Response': Unexpected end of JSON input
          

          //since we are getting string data then .json will cause an error
          //.text() || .json()

          const data = await response.text();   //reads server response and treats it like a content-type: text/plain
          updateRow(data);
          
      
        } catch (error) {
          console.error('Error:', error);
        }

    }
      
   
    //TODO: create an API for refetching data from server
    //adding senData in update row is creating an infinite loop
    //this is responsible for using fetch API to connect to another API
    async function updateRow(data){
      console.log('data sent');
      console.log(data);

      
      //Data sent as Received: Bob, 10, male, 0;
      //perform trim()
      //tokenizer or use slit() with commas
      const dataTokens = data.replace('Received: ', '').trim().split(','); //return: ["Bob", "10", "male", "0"]

      const table = document.getElementById('BaseTable');
      
      const rowIndex = Number(dataTokens[dataTokens.length - 1]);
      

      console.log(table.outerHTML);
      console.log('..............');
      console.log(table.rows.length);
      console.log(table.rows[1]);
      console.log(dataTokens);
      //console.log(table.rows[rowIndex]);


      
      const myRow = table.rows[Number(dataTokens[dataTokens.length - 1]) + 1];  //last value is where right row is saved  //add 1 cuz index 0 header

      myRow.cells[0].innerHTML = dataTokens[0];
      myRow.cells[1].innerHTML = dataTokens[1];
      myRow.cells[2].innerHTML = dataTokens[2];
    }

}

export function delRow(row) {
    console.log("Delete was clicked");
    console.log(row);

    //Shift the data up one row from where data was deleted
    //get Server to change the index for each csv entry at and below chosen delete


    //First
      //Make it work client side
    for(let i = 0; i < table.rows.length - 1; i++){
      if(table.rows[i] == row){
        table.deleteRow(i);
      }
    }

    //Second
      //Change state on server side
      
}
