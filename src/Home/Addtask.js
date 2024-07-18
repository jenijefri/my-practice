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
                range: 'Sheet1!A:B', // Adjust the range as per your sheet
            });

            const tasks = response.result.values ? response.result.values.map((row, index) => ({ id: index, task: row[0], description: row[1] })) : [];
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
                                    sheetId: 0, 
                                    dimension: 'ROWS',
                                    startIndex: taskId + 1, 
                                    endIndex: taskId + 2, 
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('Error deleting task from Google Sheets:', error);
        }
    };

    const handleTaskChange = (index, field, value) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, [field]: value } : task
        );
        setTasks(updatedTasks);
    };

    const updateTaskInSheet = async (task, index) => {
        try {
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `Sheet1!A${index + 1}:B${index + 1}`, // Adjust range to update specific row
                valueInputOption: 'RAW',
                resource: {
                    values: [[task.task, task.description]],
                },
            });
            console.log('Task updated in Google Sheets');
        } catch (error) {
            console.error('Error updating task in Google Sheets:', error);
        }
    };

    const handleTaskBlur = (index) => {
        updateTaskInSheet(tasks[index], index);
    };

    const saveTasksToSheet = async (tasks) => {
        try {
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A:B',
                valueInputOption: 'RAW',
                resource: {
                    values: tasks.map(task => [task.task, task.description]),
                },
            });
            console.log('Tasks saved to Google Sheets');
        } catch (error) {
            console.error('Error saving tasks to Google Sheets:', error);
        }
    };

    const handleAddRow = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index + 1, 0, { id: tasks.length, task: '', description: '' });
        setTasks(updatedTasks);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        navigate('/login');
    };

    const handleSave = async () => {
        await saveTasksToSheet(tasks);
    };

    const handleKeyPress = (e, index) => {
        if (e.key === 'Enter') {
          expandRow(index);
        }
    };

    const expandRow = (index) => {
        const row = document.querySelectorAll('tr')[index + 1]; // +1 to account for the header row
        if (row) {
            row.style.height = 'auto'; // Expand row to fit content
        }
    };

    return (
        <div>
            <h2>Add Task Type List Page</h2>
            <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
            <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
            <br />
            <div style={{ borderCollapse: 'collapse', width: '100%', margin: '40px' }}>
                <h3>Task Type List</h3>
                <table style={{ width: '90%', border: '1px solid black', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}>Task Type</th>
                            <th style={{ border: '1px solid black' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={task.task}
                                            onChange={(e) => handleTaskChange(index, 'task', e.target.value)}
                                            onBlur={() => handleTaskBlur(index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            style={{  width: '100%',
                                                border: 'none',
                                                padding: 0,
                                                fontSize: '14px', // Adjusted font size
                                                boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                            type="text"
                                            value={task.description}
                                            onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                                            onBlur={() => handleTaskBlur(index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                padding: 0,
                                                fontSize: '14px', // Adjusted font size
                                                boxSizing: 'border-box',
                                                // Add other optional styles here as needed
                                            }}
                                        />

                                        <button onClick={() => handleDeleteTask(index)}>Delete</button>
                                        <button onClick={() => handleAddRow(index)}>+</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleSave} style={{ marginTop: '20px' }}>Save</button>
            </div>
        </div>
    );
};

export default AddTask;
