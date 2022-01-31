const express = require('express');
const app = express();
const fs = require('fs');
const util = require('util');
const uuid = require('../helpers/uuid');

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

const readAndDelete = (note_id, file) => {

    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.length; i++) {
            if (parsedData[i].id == note_id) {
                parsedData.splice(i)
            }
        }

        writeToFile(file, parsedData);
      }
    });
  };
   
  

app.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req.body);
  
    const { title, text} = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding note');
    }
  });

  app.delete('/:id', (req, res) => {
    console.info(`${req.method} request received to delete a note`);
    const requestedTerm = req.params.id
    if (requestedTerm) {      
        readAndDelete(requestedTerm,'./db/db.json')
        res.json('Note deleted');
        } else {
            res.error('Error in deleting note');
        }
});
  
  module.exports = app;
  