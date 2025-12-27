const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
// app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Helper functions to read/write JSON
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { tasks: [] };
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};



// GET / → return "Server is running"
app.get('/', (req, res) => {
    res.send('Server is running');
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



// GET /tasks - Read all tasks from data.json
app.get('/tasks', (req, res) => {
    const data = readData();
    res.json(data.tasks);
});

// GET /tasks/:id - Get a single task by ID
app.get('/tasks/:id', (req, res) => {
    const data = readData();
    const task = data.tasks.find(t => t.id == req.params.id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { name, description, completed, priority } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const data = readData();

    // Create new task with auto-increment ID
    const newId = data.tasks.length > 0
        ? Math.max(...data.tasks.map(t => t.id)) + 1
        : 1;

    const newTask = {
        id: newId,
        name: name,
        description: description || '',
        completed: completed || false,
        priority: priority || 'medium'
    };

    data.tasks.push(newTask);
    writeData(data);

    res.status(201).json(newTask);
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
    const data = readData();
    const taskIndex = data.tasks.findIndex(t => t.id == req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Update fields if provided
    const { name, description, completed, priority } = req.body;

    if (name !== undefined) data.tasks[taskIndex].name = name;
    if (description !== undefined) data.tasks[taskIndex].description = description;
    if (completed !== undefined) data.tasks[taskIndex].completed = completed;
    if (priority !== undefined) data.tasks[taskIndex].priority = priority;

    writeData(data);

    res.json(data.tasks[taskIndex]);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const data = readData();
    const taskIndex = data.tasks.findIndex(t => t.id == req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    data.tasks.splice(taskIndex, 1);
    writeData(data);

    res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});