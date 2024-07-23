import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o'; // Your API Key
const SPREADSHEET_ID = '1nbifmC4-hynJ2Lz0qXAUfhey6nXOGH_HT9SgVOU0bQE';
const RANGE = 'Sheet1!A:B'; // Define the range you need

const AddTask = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
            const data = await response.json();
            if (response.ok) {
                const tasks = data.values ? data.values.map((row, index) => ({ id: index, task: row[0], description: row[1] })) : [];
                setTasks(tasks);
            } else {
                console.error('Error fetching tasks:', data);
            }
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
        // Note: Deleting rows directly with API Key might not be supported. Use alternative methods if required.
        // Implement an alternative if deletion is not supported with API Key.
    };

    const handleTaskChange = (index, field, value) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, [field]: value } : task
        );
        setTasks(updatedTasks);
    };

    const updateTaskInSheet = async (task, index) => {
        try {
            await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A${index + 1}:B${index + 1}?key=${API_KEY}&valueInputOption=RAW`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: [[task.task, task.description]],
                }),
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
            await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:B?key=${API_KEY}&valueInputOption=RAW`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: tasks.map(task => [task.task, task.description]),
                }),
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
        // API Key does not involve user sign-in, so this can be removed or customized
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
                                            style={{ width: '100%', border: 'none', padding: 0, fontSize: '14px', boxSizing: 'border-box' }}
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
                                            style={{ width: '100%', border: 'none', padding: 0, fontSize: '14px', boxSizing: 'border-box' }}
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
