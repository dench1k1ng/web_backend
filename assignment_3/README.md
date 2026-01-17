# Task API - Express.js Backend Assignment

A simple RESTful API built with **Node.js** and **Express.js** for managing tasks. This project uses a JSON file for data persistence.

## 📝 Project Description

This is a backend API that implements full CRUD (Create, Read, Update, Delete) operations for managing tasks. The chosen object for this assignment is **Task**, which has the following properties:

| Field       | Type    | Description                          |
|-------------|---------|--------------------------------------|
| id          | Number  | Unique identifier                    |
| name        | String  | Task name (required)                 |
| description | String  | Task description                     |
| completed   | Boolean | Whether task is completed            |
| priority    | String  | Priority level (low, medium, high)   |

## 🚀 How to Install Dependencies

1. Make sure you have [Node.js](https://nodejs.org/) installed on your system
2. Clone this repository:
   ```bash
   git clone https://github.com/dench1k1ng/web_backend.git
   cd web_backend/assignment_1
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## ▶️ How to Run the Server

Start the server with:
```bash
node server.js
```

The server will run at: `http://localhost:3000`

## 📡 API Routes

### Demo Routes

| Method | Endpoint   | Description                    |
|--------|------------|--------------------------------|
| GET    | `/`        | Returns "Server is running"    |
| GET    | `/hello`   | Returns JSON greeting message  |
| GET    | `/time`    | Returns current server time    |
| GET    | `/status`  | Returns server status (200 OK) |

### CRUD Routes for Tasks

| Method | Endpoint      | Description             |
|--------|---------------|-------------------------|
| GET    | `/tasks`      | Get all tasks           |
| GET    | `/tasks/:id`  | Get a single task by ID |
| POST   | `/tasks`      | Create a new task       |
| PUT    | `/tasks/:id`  | Update a task by ID     |
| DELETE | `/tasks/:id`  | Delete a task by ID     |

## 📮 Example Postman Requests

### 1. GET / - Check if server is running
```
GET http://localhost:3000/
```
**Response:** `Server is running`

---

### 2. GET /hello - Get greeting message
```
GET http://localhost:3000/hello
```
**Response:**
```json
{
  "message": "Hello from server!"
}
```

---

### 3. GET /time - Get current server time
```
GET http://localhost:3000/time
```
**Response:**
```json
{
  "currentTime": "2025-12-21T10:30:00.000Z",
  "timestamp": 1734779400000
}
```

---

### 4. GET /status - Get server status
```
GET http://localhost:3000/status
```
**Response:**
```json
{
  "status": "OK",
  "uptime": 123.456,
  "message": "Server is healthy"
}
```

---

### 5. GET /tasks - Get all tasks
```
GET http://localhost:3000/tasks
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Complete assignment",
    "description": "Finish the Express API assignment",
    "completed": false,
    "priority": "high"
  },
  {
    "id": 2,
    "name": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": true,
    "priority": "medium"
  }
]
```

---

### 6. GET /tasks/:id - Get a single task
```
GET http://localhost:3000/tasks/1
```
**Response:**
```json
{
  "id": 1,
  "name": "Complete assignment",
  "description": "Finish the Express API assignment",
  "completed": false,
  "priority": "high"
}
```

---

### 7. POST /tasks - Create a new task
```
POST http://localhost:3000/tasks
Content-Type: application/json

{
  "name": "Study for exam",
  "description": "Prepare for the midterm exam",
  "completed": false,
  "priority": "high"
}
```
**Response (201 Created):**
```json
{
  "id": 4,
  "name": "Study for exam",
  "description": "Prepare for the midterm exam",
  "completed": false,
  "priority": "high"
}
```

---

### 8. PUT /tasks/:id - Update a task
```
PUT http://localhost:3000/tasks/1
Content-Type: application/json

{
  "completed": true
}
```
**Response:**
```json
{
  "id": 1,
  "name": "Complete assignment",
  "description": "Finish the Express API assignment",
  "completed": true,
  "priority": "high"
}
```

---

### 9. DELETE /tasks/:id - Delete a task
```
DELETE http://localhost:3000/tasks/1
```
**Response:**
```json
{
  "success": true
}
```

---

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **File System (fs)** - For JSON file persistence

## 📁 Project Structure

```
assignment_1/
├── server.js      # Main server file with all routes
├── data.json      # JSON file for data storage
├── package.json   # Project dependencies
└── README.md      # Project documentation
```

## 👤 Author

Denis - AITU Student

## 📄 License

ISC