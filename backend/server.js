//data can be stored as a JSON or a CSV file
//CRUD

//can persisting changed be made to a csv through code?

//always trim through csv just incase there is any excess space

//modules
//import <class> from <module>

import http from 'http';
import * as fs from 'fs';
import path from 'path';
import express from 'express';



import csvParser from 'csv-parser';
/* get specific function from the module.export {} defined in module  */


//can do what fs does 
import { createObjectCsvWriter } from 'csv-writer';


let arrData = [];


//To use promise you need to wrap the data we want
    //FUNCTION as wrapper so it can be called where we need it rather then where it is
    //Promise as a wrapper, to allow next code line to wait
function parseCSV(filePath) {
    //wrapping the desired data in promise
    //PROMISE represents the eventual result of succsess or failure
    //a resolve() is like a return but for the promise instead of the function
    return new Promise((resolve, reject) => {

    const results = [];

    //https://www.npmjs.com/package/csv-parse
    //this implimentation stated inside node module


    const gettingData = fs.createReadStream(filePath)
        .pipe(csvParser({
            // Trim header attribute names so your keys don’t have spaces
            mapHeaders: ({ header }) => header.trim(),
        
            // 2️⃣ Trim each field value if it’s a string
            mapValues: ({ value }) => {
                //typeof value === 'string' ? value.trim() : value
                if (typeof value === 'string') {
                    return value.trim();
                } else {
                    return value;
                }
                }
        }))
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {
            console.log(results);
            console.log('CSV file successfully processed');
            resolve(results);   //like a return but for the promise

        })
        .on('error', (err) => {
            reject(err);
        });

        })

}

async function doAfterParse(){
    try {
        const newFilePath = path.resolve(path.resolve('..', 'backend/studentWrite.csv'));
        const results = await parseCSV(path.resolve('..', 'backend/student.csv'));

        arrData = results;

        const stream = fs.createWriteStream(path.resolve('..', 'backend/studentWrite.csv'));  //WHAT GOES IN THE PARAMETER 
        //writing title for csv
        //\n to create a new line
        stream.write('id, fName, age, gender\n');

        

        console.log(results.length + "balls");

        //for iterating through array objects
        for(let i = 0; i < results.length; i++){
            let currData = results[i];

            stream.write(currData.id + ',' + currData.fName + ',' + currData.age + ',' + currData.gender + '\n');
        }


        stream.end();
        
    }
    catch (error) {
        console.error('Error processing CSV:', error);
    }
}

    doAfterParse();





const serverPath = path.resolve(); 
const publicPath = path.resolve("..", 'frontend');  //individual parameters act like an array
const projectPath = path.resolve('..');


const app = express();  //pretty much http.createserver();

//serve the static files first
//for setting the right header
app.use(express.static(path.resolve('..', 'frontend')));    //To handle GET


app.use(express.json());    //TO handle POST



app.get('/', (req, res) => {

    //this will auto collect the JS and CSS files associated with this as well
    res.sendFile(path.resolve('..', 'frontend/app.html'));
});

//TODO: update array then CSV
//req is JSON
app.post('/sendUpdate', (req, res) => {
    const { newName, newAge, newGender } = req.body; //this is shortcut for declaring each value from JSON ie const newName = req.body.name
    const whereIsRow = Number(req.body.whereIsRow) - 1;

    console.log('Received data:', req.body);
    
    //TODO:
        //iterate through arrData, change what needs to be changed
        for(let i = 0; i < arrData.length; i++){
           if(i == whereIsRow){
                console.log(arrData[i]);
                
                arrData[i]['fName'] = newName;
                arrData[i]['age'] = newAge;
                arrData[i]['gender'] = newGender;
                
                break;
            } 
        }

        //reParse into CSV studentWrite
        const stream = fs.createWriteStream(path.resolve('..', 'backend/studentWrite.csv'));  //WHAT GOES IN THE PARAMETER 
        //writing title for csv
        //\n to create a new line
        stream.write('id, fName, age, gender\n');

        //for iterating through array objects
        for(let i = 0; i < arrData.length; i++){
            let currData = arrData[i];

            stream.write(currData.id + ',' + currData.fName + ',' + currData.age + ',' + currData.gender + '\n');
        }

        stream.end();
        

    // Do something with the data, e.g., save to database or log it
    res.send(`Received: ${newName}, ${newAge}, ${newGender}, ${whereIsRow}`);

});

app.post('/sendEntry', (req, res) => {
    const { entryName, entryAge, entryGender} = req.body;
    arrData.push({'id': Number(arrData[arrData.length - 1]['id']) + 1, 'fName': entryName, 'age': entryAge, 'gender': entryGender}); 
    console.log(arrData[arrData.length - 1]);
    
    const stream = fs.createWriteStream(path.resolve('..', 'backend/studentWrite.csv'));  //WHAT GOES IN THE PARAMETER 
    stream.write(`${arrData[arrData.length - 1]['id']}, ${entryName}, ${entryAge}, ${entryGender} \n`);

    res.send(`Received entry: ${entryName}, ${entryAge}, ${entryGender}`);

});


//Client will make this requests after DOMCONTENTLOADED
app.get('/whereMyData', (req, res) => {
    //IF arr null then parser didnt run before call
    res.send(arrData);

});


//Many versions of listen()
//port, hostname(optional), lambda 
app.listen(3000, () => {
    console.log('Server online at: http://localhost:3000');
});


//how express works
    //to satisy a specific type of request like a 'GET' for a JS file
        //app.get('/script.js', (req, res) =>
            //res.send(path.resolve('..', 'frontend/script.js'))    
            //or serve an entire folder with:
                //res.send(express.static('frontend'))


    //what are the main express functions
        //starting server
            //app.listen(port)
            //const app = express();


        //the ones that are used to handle http requests
            //app.get('API', (req, res) => {})
            //app.post('API', (req, res) => {})
            //app.delete(path, (req, res) => {})
            
                //giving responsess
                    //res.json(object)  //auto parses object into JSON
                    //res.send(data)    //send text (css, html, js)  
                    
                    //res.redirect(url) -> res.redirect('/homePage')
            

        //helper functions
            //app.use(middleware) -> app.use(express.json())    