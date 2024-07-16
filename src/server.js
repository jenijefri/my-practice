const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS (for development purposes, restrict in production)
app.use(bodyParser.json()); // Parse incoming JSON requests

// POST endpoint to add a task
app.post('/add-task', (req, res) => {
  const task = req.body.task; // Assuming 'task' is passed in the request body

  // Example: Save 'task' to a Google Sheet or database
  // Your implementation logic here

  // Example response
  res.status(200).json({ message: 'Task added successfully' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
