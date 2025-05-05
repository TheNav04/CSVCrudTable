import { modRowForm, delRow } from "./shared.js";


const theTable = document.getElementById('BaseTable'); //may need to put inside domcontentloaded listener
let data = [];

export async function fillTable(tableData = ['this is a default parameter', 'for when parameter isnt fullied']){  
    try{
        data = await getServerData();
        let count = 0;  
        
        

        while(data[count] != null){ //null checks for both null and undefined
            console.log('loop touched')
            let theRow = theTable.insertRow();
            theRow.insertCell(0).innerHTML = data[count].fName; //OR data[count]['fName']
            theRow.insertCell(1).innerHTML = data[count].age;
            theRow.insertCell(2).innerHTML = data[count].gender;

            const modButton = document.createElement('button'); //this is an DOM object
            modButton.textContent = 'Modify';
            modButton.addEventListener('click', () => { 
                modRowForm(theRow);
            }); 

            const delButton = document.createElement('button');
            delButton.textContent = 'Delete';
            delButton.addEventListener('click', () => {
                delRow(theRow);
            });

            const buttonWrapper = theRow.insertCell(3); //creates a DOM object for <tr> </tr>
            buttonWrapper.appendChild(modButton);
            buttonWrapper.appendChild(delButton);
            

            count++;
        }
        
    
        

    }
    catch (error) {
        console.error(error, 'some error occured yo.')
    }
}


//PROMISE attributes: PromiseState & PromiseResult
export async function getServerData(){
    //fetch will return a promise
        //how do i read data inside promise object
        try {
            const arrPromise = await fetch('/whereMyData');

            if (!arrPromise.ok) {   //arrPromise.ok == false    //! simply flips a boolean
                throw new Error('Failed to fetch data');
            }

            const data = await arrPromise.json();

            console.log('Data received:');
            console.log(data);
            return data;
        }
        catch (error) {
            console.error('There was a problem with the fetch:', error);
        }
    
}


export async function sendNewEntry(entryName, entryAge, entryGender){
    try{
        const response = await fetch('/sendEntry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'entryName': entryName,
              'entryAge': entryAge,
              'entryGender': entryGender
            }),
          });

        const confirmation = await response.text();
        console.log(confirmation);
        entryUpdater(confirmation);
    }
    catch(error){
        console.error('some error occured:', error)
    }
}

export function entryUpdater(rawData){
    const formatedData = rawData.replace('Received entry:', '').trim().split(',');
    const newRow = theTable.insertRow();

    newRow.insertCell(0).innerHTML = formatedData[0];
    newRow.insertCell(1).innerHTML = formatedData[1];
    newRow.insertCell(2).innerHTML = formatedData[2];


    const modButton = document.createElement('button'); //this is an DOM object
    modButton.textContent = 'Modify';
    modButton.addEventListener('click', () => { 
        modRowForm(newRow);
    }); 

    const delButton = document.createElement('button');
    delButton.textContent = 'Delete';
    delButton.addEventListener('click', () => {
        delRow(newRow);
    });

    const buttonWrapper = newRow.insertCell(3); //creates a DOM object for <tr> </tr>
    buttonWrapper.appendChild(modButton);
    buttonWrapper.appendChild(delButton);
}
