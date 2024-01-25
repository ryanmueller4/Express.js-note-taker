const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
// http://localhost:3001/api/notes/
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// DELETE Route for a specific note
notes.delete('/:note_Id', (req, res) => {
  const noteId = req.params.note_Id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(result);
    });
});

// POST Route for a new UX/UI note
// http://localhost:3001/api/notes/
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newnote = {
      title,
      text,
      id: uuidv4(),
    };
  
    const parsedData = readAndAppend(newnote, './db/db.json');
    res.json(parsedData);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
