// Native fetch is available in Node 18+


const API_URL = 'http://localhost:3000/tasks';

async function runTests() {
    console.log('DEBUG: Script started. Attempting to verify API...');
    console.log('Starting Verification...');

    // 1. Create a Task
    console.log('\n--- Test 1: Create Task ---');
    let response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Verify API',
            description: 'Testing the API endpoints',
            priority: 'high'
        })
    });
    let data = await response.json();
    console.log('Status:', response.status);
    console.log('Created Task:', data);

    if (response.status !== 201 || !data._id) {
        console.error('FAILED: Task creation');
        return;
    }
    const taskId = data._id;

    // 2. Get All Tasks
    console.log('\n--- Test 2: Get All Tasks ---');
    response = await fetch(API_URL);
    data = await response.json();
    console.log('Status:', response.status);
    console.log('Task Count:', data.length);
    if (!Array.isArray(data) || data.length === 0) {
        console.error('FAILED: Get all tasks');
    }

    // 3. Get Single Task
    console.log('\n--- Test 3: Get Single Task ---');
    response = await fetch(`${API_URL}/${taskId}`);
    data = await response.json();
    console.log('Status:', response.status);
    console.log('Fetched Task:', data.name);
    if (data._id !== taskId) {
        console.error('FAILED: Get single task');
    }

    // 4. Update Task
    console.log('\n--- Test 4: Update Task ---');
    response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true })
    });
    data = await response.json();
    console.log('Status:', response.status);
    console.log('Updated Task Completed:', data.completed);
    if (data.completed !== true) {
        console.error('FAILED: Update task');
    }

    // 5. Delete Task
    console.log('\n--- Test 5: Delete Task ---');
    response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
    });
    data = await response.json();
    console.log('Status:', response.status);
    console.log('Delete Response:', data);

    // 6. Verify Delete
    console.log('\n--- Test 6: Verify Deletion ---');
    response = await fetch(`${API_URL}/${taskId}`);
    console.log('Status (Should be 404):', response.status);
    if (response.status !== 404) {
        console.error('FAILED: Task still exists');
    } else {
        console.log('SUCCESS: Task deleted correctly');
    }
}

// Check if server is running, if not, tell user to start it
fetch('http://localhost:3000/status')
    .then(() => runTests())
    .catch(() => console.error('Error: Server is not running. Please start the server validation.'));
