//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Default application settings
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static('public'));
const publicPath = __dirname + "/public";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Display index page when app is run
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// Display notes pages 
app.get("/notes", (req, res) => {
    res.sendFile(path.join(publicPath, "notes.html"));
});

// Display notes stored in db.json
app.get("/api/notes", (req, res) => {
    return res.json(getData());
});

// Post new note into db.json
app.post("/api/notes", (req, res) => {
    // Get entered note and assign a unique id
    const newNote = req.body;
    newNote['id'] = uuidv4()
    // Add new note to db.json
    let currentNotes = getData()
    currentNotes.push(newNote)
    setData(currentNotes);

    return res.status(201).end();
});

// Delete specific note from db.json
app.delete("/api/notes/:id", (req, res) => {
    let currentNotes = getData()
    // Find index with unique id and splice from array
    index = currentNotes.findIndex(note => note.id === req.params.id);
    currentNotes.splice(index, 1)
    // Set new notes array without the deleted note into db.json
    setData(currentNotes);

    return res.status(202).end();
});

// Get notes array from db.json
const getData = () => {
    try {
        const jsonString = fs.readFileSync("./db/db.json")
        const notes = JSON.parse(jsonString)
        return notes
    } catch(err) {
        throw (err)
    }
}

// Add new note to db.json
const setData = (data) => {
    try {
        fs.writeFileSync("./db/db.json", JSON.stringify(data), 'utf8')
        console.log("Successfully added the note");
    } catch(err) {
        throw (err)
    }
}

// Start server
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});