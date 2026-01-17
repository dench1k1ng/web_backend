const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

const API_URL = '/tasks';

// Fetch and display tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Render tasks to the DOM
function renderTasks(tasks) {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align:center; color:#6b7280;">No tasks found. Add one above!</p>';
        return;
    }

    // Sort by createdAt desc
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tasks.forEach(task => {
        const li = document.createElement('div');
        li.className = 'task-item';

        li.innerHTML = `
            <div class="task-info">
                <div class="task-title">${escapeHtml(task.name)}</div>
                <div class="task-desc">${escapeHtml(task.description || '')}</div>
                <div class="badges">
                    <span class="badge ${task.priority}">${task.priority}</span>
                    <span class="badge ${task.completed ? 'completed' : 'pending'}">
                        ${task.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
            </div>
            <div class="actions">
                <button class="btn-check" onclick="toggleTask('${task._id}', ${!task.completed})" title="Toggle Status">
                    ✓
                </button>
                <button class="btn-delete" onclick="deleteTask('${task._id}')" title="Delete">
                    🗑️
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Add new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;

    const newTask = { name, description, priority };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            taskForm.reset();
            fetchTasks();
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to create task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTasks();
        } else {
            alert('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Toggle task completion
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            fetchTasks();
        } else {
            alert('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Helper to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initial load
fetchTasks();
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
