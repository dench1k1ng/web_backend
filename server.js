const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const DATA_FILE = './data.json';

// Helper functions to read/write JSON
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// --- REQUIRED DEMO ROUTES ---
app.get('/', (req, res) => res.send("Server is running"));
app.get('/hello', (req, res) => res.json({ message: "Hello from server!" }));
app.get('/time', (req, res) => res.send(new Date().toISOString()));
app.get('/status', (req, res) => res.status(200).json({ status: "OK", uptime: process.uptime() }));

// --- CRUD ROUTES ---

// 1. GET ALL
app.get('/movies', (req, res) => {
    const data = readData();
    res.json(data.movies);
});

// 2. POST (Create)
app.post('/movies', (req, res) => {
    const data = readData();
    const newMovie = {
        id: Date.now(), // Unique ID
        name: req.body.name,
        genre: req.body.genre || "N/A"
    };
    data.movies.push(newMovie);
    writeData(data);
    res.status(201).json(newMovie);
});

// 3. PUT (Update)
app.put('/movies/:id', (req, res) => {
    const data = readData();
    const movieIndex = data.movies.findIndex(m => m.id == req.params.id);

    if (movieIndex === -1) return res.status(404).send("Movie not found");

    data.movies[movieIndex].name = req.body.name || data.movies[movieIndex].name;
    writeData(data);
    res.json(data.movies[movieIndex]);
});

// 4. DELETE
app.delete('/movies/:id', (req, res) => {
    let data = readData();
    const movieExists = data.movies.find(m => m.id == req.params.id);

    if (!movieExists) return res.status(404).send("Movie not found");

    data.movies = data.movies.filter(m => m.id != req.params.id);
    writeData(data);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));