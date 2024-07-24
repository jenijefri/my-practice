import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o'; // Replace with your API Key
const CLIENT_ID = '482753064087-45cao68n6ucmd3757s0tesp9b34qqlf3.apps.googleusercontent.com'; // Replace with your Client ID
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // Google Sheets API scope

const AddTask = () => {
    const [tasks, setTasks] = useState([{ task: '', description: '' }]);
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const navigate = useNavigate();

    const createSpreadsheet = async () => {
        try {
            console.log('Creating spreadsheet...');
            const createResponse = await gapi.client.sheets.spreadsheets.create({
                properties: {
                    title: 'AddTaskType',
                },
                sheets: [{
                    properties: {
                        title: 'Sheet1',
                    },
                }],
            });

            const newSpreadsheetId = createResponse.result.spreadsheetId;
            console.log('Created Spreadsheet ID:', newSpreadsheetId);
            setSpreadsheetId(newSpreadsheetId);
            localStorage.setItem('spreadsheetId', newSpreadsheetId);

            await addTableToSheet(newSpreadsheetId);
        } catch (error) {
            console.error('Error creating spreadsheet:', error);
        }
    };

    const fetchSpreadsheetData = async (spreadsheetId) => {
        try {
            console.log('Fetching data from spreadsheet...');
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Sheet1!A2:C',
            });

            const rows = response.result.values;
            if (rows && rows.length > 0) {
                const loadedTasks = rows.map(row => ({
                    task: row[0],
                    description: row[1],
                    date: row[2],
                }));
                setTasks(loadedTasks);
            } else {
                console.log('No data found in the spreadsheet.');
            }
        } catch (error) {
            console.error('Error fetching data from spreadsheet:', error);
        }
    };

    const addTableToSheet = async (spreadsheetId) => {
        try {
            console.log('Adding table to spreadsheet...');
            const range = 'Sheet1!A1:C1';
            const values = [
                ['Task Type', 'Description', 'Date'],
            ];

            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                resource: {
                    values: values,
                },
            });

            console.log('Table added to the new spreadsheet');
        } catch (error) {
            console.error('Error adding table to spreadsheet:', error);
        }
    };

    useEffect(() => {
        const initializeGoogleAPI = () => {
            console.log('Initializing Google API client...');
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                scope: SCOPE,
            }).then(() => {
                const savedSpreadsheetId = localStorage.getItem('spreadsheetId');
                if (savedSpreadsheetId) {
                    setSpreadsheetId(savedSpreadsheetId);
                    fetchSpreadsheetData(savedSpreadsheetId);
                } else {
                    gapi.auth2.getAuthInstance().signIn().then(createSpreadsheet);
                }
            }).catch(error => {
                console.error('Error initializing Google API client:', error);
            });
        };

        gapi.load('client:auth2', initializeGoogleAPI);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        navigate('/login');
    };

    const handleInputChange = (index, field, value) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, [field]: value } : task
        );
        setTasks(updatedTasks);
    };

    const handleAddRow = (index) => {
        const newTasks = [...tasks];
        newTasks.splice(index + 1, 0, { task: '', description: '' });
        setTasks(newTasks);
    };

    const handleDeleteRow = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const handleSave = async () => {
        try {
            if (spreadsheetId) {
                console.log('Updating spreadsheet...');
                const values = [
                    ['Task Type', 'Description', 'Date'],
                    ...tasks.map(task => [task.task, task.description, new Date().toLocaleString()]),
                ];

                await gapi.client.sheets.spreadsheets.values.clear({
                    spreadsheetId: spreadsheetId,
                    range: 'Sheet1!A1:Z1000',
                });

                await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: spreadsheetId,
                    range: 'Sheet1!A1',
                    valueInputOption: 'RAW',
                    resource: {
                        values: values,
                    },
                });

                console.log('Spreadsheet updated with new tasks');
                console.log('spreadsheet id:',spreadsheetId)
            }
        } catch (error) {
            console.error('Error updating spreadsheet:', error);
        }
    };

    return (
        <div>
            <h2>Add Task Page</h2>
            <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
            <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f4f4f4', textAlign: 'left' }}>Task</th>
                        <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f4f4f4', textAlign: 'left' }}>Description</th>
                        <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
                            <button 
                                onClick={() => handleAddRow(tasks.length - 1)} 
                                style={{ border: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
                            >
                                +
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <input
                                    type="text"
                                    value={task.task}
                                    onChange={(e) => handleInputChange(index, 'task', e.target.value)}
                                    style={{ width: '100%', border: 'none', padding: '4px', boxSizing: 'border-box' }}
                                />
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <input
                                    type="text"
                                    value={task.description}
                                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                    style={{ width: '100%', border: 'none', padding: '4px', boxSizing: 'border-box' }}
                                />
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                <button 
                                    onClick={() => handleAddRow(index)} 
                                    style={{ border: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }}
                                >
                                    +
                                </button>
                                <button 
                                    onClick={() => handleDeleteRow(index)} 
                                    style={{ border: '1px solid #ddd', backgroundColor: '#f44336', color: 'white', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    -
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button 
                onClick={handleSave} 
                style={{ border: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
            >
                Save
            </button>
        </div>
    );
};

export default AddTask;
