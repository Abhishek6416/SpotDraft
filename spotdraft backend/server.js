const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

// Replace these with your actual API keys
const ASANA_ACCESS_TOKEN = 'YOUR_ASANA_ACCESS_TOKEN';
const AIRTABLE_API_KEY = 'patFimeT7PDgxHcOU.7519ede3091141c3a8c092b881385604348a28cc0f1253469480925ab1327b4a';
const AIRTABLE_BASE_ID = 'app44nyhwRkvn0gnU';

app.use(express.json());

// Endpoint to receive new task creation from Asana
app.post('/asana/webhook', async (req, res) => {
  try {
    const asanaTask = req.body;
    console.log('Received new Asana task:', asanaTask.name);

    // Copy the Asana task to Airtable
    await copyTaskToAirtable(asanaTask);

    res.status(200).json({ message: 'Task copied to Airtable successfully.' });
  } catch (error) {
    console.error('Error while copying task to Airtable:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to copy a task from Asana to Airtable
async function copyTaskToAirtable(asanaTask) {
  const task = {
    'Task ID': asanaTask.gid,
    'Name': asanaTask.name,
    'Assignee': asanaTask.assignee?.name || null,
    'Due Date': asanaTask.due_on || null,
    'Description': asanaTask.notes || null,
  };

  const airtableEndpoint = `https://api.airtable.com/v0/${app44nyhwRkvn0gnU}/Asana%20Tasks`;
  const airtableHeaders = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    await axios.post(airtableEndpoint, { fields: task }, { headers: airtableHeaders });
    console.log('Task copied to Airtable:', asanaTask.name);
  } catch (error) {
    console.error('Error while copying task to Airtable:', error.message);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
