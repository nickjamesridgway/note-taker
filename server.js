const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;
const db = require('./db/db.json')
const app = express();
const fs = require('fs');
const util = require('util');
const test = util.promisify(fs.readFile)

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedEdit = JSON.parse(data);

      for (let i = 0; i < parsedEdit.length; i++) {
        if (parsedEdit[i].id == id){
          console.log('Removed', parsedEdit[i])
          parsedEdit.splice(i, 1)     
          console.log('New array', parsedEdit)
        }     
      }

      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedEdit, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully delete the note!')
      );
    }
  });
});

app.get('/api/notes', (req, res) => {
  console.log(db)
return test("./db/db.json", "utf8").then(data => res.json(JSON.parse(data)))

})


app.get('/api/test',(req,res)=>{
  res.json(db)
  console.log(db)
})


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} post`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text, 
      id: uuid()
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log("🚀 ~ file: server.js ~ line 62 ~ fs.readFile ~ err", err);
      } else {
        const parsedNotes = JSON.parse(data)
        parsedNotes.push(newNote)
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Note added.')
        )
      }

    })

    const response = {
      status: 'success',
      body: newNote,
    }
    console.log("file: server.js - line 82 - app.post - response", response)
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting database.")
  }
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);