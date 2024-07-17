import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '482753064087-45cao68n6ucmd3757s0tesp9b34qqlf3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o';
const SPREADSHEET_ID = '1nbifmC4-hynJ2Lz0qXAUfhey6nXOGH_HT9SgVOU0bQE';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

const AddTask = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                scope: SCOPE,
            }).then(fetchTasks);
        }
        gapi.load('client:auth2', start);
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A:A', // Adjust the range as per your sheet
            });

            const tasks = response.result.values ? response.result.values.map((row, index) => ({ id: index, text: row[0] })) : [];
            setTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks from Google Sheets:', error);
        }
    };
    const handleDeleteTask = async (index) => {
        const taskId = tasks[index].id;
        console.log('Deleting task with taskId:', taskId);
    
        const updatedTasks = tasks.filter((task, i) => i !== index);
        setTasks(updatedTasks);
    
        try {
            await deleteTaskFromSheet(taskId);
            console.log('Task deleted from Google Sheets');
        } catch (error) {
            console.error('Error deleting task from Google Sheets:', error);
        }
    };
    
    const deleteTaskFromSheet = async (taskId) => {
        try {
            await gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                resource: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId: 0, // Assuming sheetId 0 for the first sheet
                                    dimension: 'ROWS',
                                    startIndex: taskId,
                                    endIndex: taskId + 1, // Delete single row
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            throw new Error('Error deleting task from Google Sheets:', error);
        }
    };
    

    const handleTaskChange = (index, text) => {
        const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, text } : task));
        setTasks(updatedTasks);
    };

    const handleTaskBlur = async (index) => {
        await saveTasksToSheet(tasks);
    };

    const saveTasksToSheet = async (tasks) => {
        try {
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A:A',
                valueInputOption: 'RAW',
                resource: {
                    values: tasks.map(task => [task.text]),
                },
            });
            console.log('Tasks saved to Google Sheets');
        } catch (error) {
            console.error('Error saving tasks to Google Sheets:', error);
        }
    };

    const handleAddRow = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index + 1, 0, { id: index + 1, text: '' });
        setTasks(updatedTasks);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        navigate('/login');
    };

    return (
        <div>
            <h2>Add Task Page</h2>
            <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
            <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
            <br></br>
            <div style={{ borderCollapse: 'collapse', width: '90%', margin: '40px' }}>
                <h3>Task List</h3>
                <table style={{ width: '90%', border: '1px solid black', borderCollapse: 'collapse' }}>
    <thead>
        <tr>
            <th style={{ border: '1px solid black' }}>Task</th>
        </tr>
    </thead>
    <tbody>
        {tasks.map((task, index) => (
            <tr key={index}>
                <td style={{ border: '1px solid black' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={task.text}
                            onChange={(e) => handleTaskChange(index, e.target.value)}
                            onBlur={() => handleTaskBlur(index)}
                            style={{ width: '100%', marginRight: '10px' }}
                        />
                        <button onClick={() => handleDeleteTask(index)}>Delete</button>
                        <button onClick={() => handleAddRow(index)}>+</button>
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
</table>

                
            </div>
        </div>
    );
};

export default AddTask;
