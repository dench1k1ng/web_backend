const express = require('express');
require('dotenv').config();
const path = require('path');
const connectDB = require('./db');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// GET / → return "Server is running"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /hello → return JSON { message: "Hello from server!" }
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

// GET /time → return current server time
app.get('/time', (req, res) => {
    res.json({
        currentTime: new Date().toISOString(),
        timestamp: Date.now()
    });
});

// GET /status → return 200 OK and any text/JSON
app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'OK',
        uptime: process.uptime(),
        message: 'Server is healthy'
    });
});

// GET /tasks - Read all tasks from MongoDB
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /tasks/:id - Get a single task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const { name, description, completed, priority } = req.body;

        // Validation handled by Mongoose, but we can check specific fields here too if needed
        // Basic check for required field
        if (!name) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }

        const task = await Task.create({
            name,
            description,
            completed,
            priority
        });

        res.status(201).json(task);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ error: messages });
        }
        res.status(500).json({ error: 'Server Error' });
    }
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update fields
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(task);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.deleteOne();

        res.json({ success: true, message: 'Task removed' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(500).json({ error: 'Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});