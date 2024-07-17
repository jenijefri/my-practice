import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '482753064087-45cao68n6ucmd3757s0tesp9b34qqlf3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o';
const SPREADSHEET_ID = '1nbifmC4-hynJ2Lz0qXAUfhey6nXOGH_HT9SgVOU0bQE';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

const AddTask = () => {
    const [task, setTask] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                scope: SCOPE,
            });
        }
        gapi.load('client:auth2', start);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A:A', // Adjust the range as per your sheet
                valueInputOption: 'RAW',
                resource: {
                    values: [[task]],
                },
            });

            console.log('Task added:', response.result);
            setTask(''); // Clear the input field after submission
            alert('Task added Successfuly');
        } catch (error) {
            console.error('Error adding task to Google Sheets:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        navigate('/login');
      };

    return (
        <div>
        <h2> Add Task Page</h2>
        <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
        <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
            <br></br>
        <div style={{ borderCollapse: 'collapse', width: '90%', margin: '40px' }}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter task"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default AddTask;
