// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configure Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/your/credentials.json', // replace with your credentials file path
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1nbifmC4-hynJ2Lz0qXAUfhey6nXOGH_HT9SgVOU0bQE'; // replace with your spreadsheet ID

app.post('/add-task', async (req, res) => {
  const { task } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:A1', // adjust the range as needed
      valueInputOption: 'RAW',
      resource: {
        values: [[task]],
      },
    });
    res.status(200).send('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Failed to add task');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
