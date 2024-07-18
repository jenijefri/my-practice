import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';

const TaskView = () => {
  const navigate = useNavigate();
  const [taskDetail, setTaskDetail] = useState('');
  const [taskLink, setTaskLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskStatusColor, setTaskStatusColor] = useState('');
  const [assignTask, setAssignTask] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const SPREADSHEET_ID = '1nbifmC4-hynJ2Lz0qXAUfhey6nXOGH_HT9SgVOU0bQE';
  const RANGE = 'Sheet1!A:A';
  const API_KEY = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o';

  useEffect(() => {
    const loadGapi = () => {
      if (typeof gapi === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          console.log('GAPI script loaded');
          gapi.load('client', initializeGapiClient);
        };
        document.body.appendChild(script);
      } else {
        gapi.load('client', initializeGapiClient);
      }
    };

    const initializeGapiClient = async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        });

        fetchDataFromSheet();
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
      }
    };

    const fetchDataFromSheet = async () => {
      try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: RANGE,
        });

        const values = response.result.values;
        console.log('Fetched values:', values);

        if (values) {
          const options = values.map(row => row[0]);
          setDropdownOptions(options);
        } else {
          console.log('No data found.');
        }
      } catch (error) {
        console.error('Error fetching data from Google Sheet:', error);
      }
    };

    loadGapi();
  }, []);

  const handleTaskDetailChange = (e) => {
    setTaskDetail(e.target.value);
  };

  const handleTaskLinkChange = (e) => {
    setTaskLink(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleCloseDateChange = (e) => {
    setCloseDate(e.target.value);
  };

  const handleTaskStatusChange = (e) => {
    const value = e.target.value;
    let color = '';

    switch (value) {
      case 'High Priority':
        color = 'red';
        break;
      case 'Medium Priority':
        color = 'orange';
        break;
      case 'Low Priority':
        color = 'green';
        break;
      case 'Bug':
        color = 'purple';
        break;
        case 'No Priority':
        color = 'gray';
        break;
      default:
        color = '';
        break;
    }

    setTaskStatus(value);
    setTaskStatusColor(color);
  };

  const handleAssignTaskChange = (e) => {
    setAssignTask(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const task = {
      taskDetail,
      taskLink,
      startDate,
      closeDate,
      taskStatus,
      taskStatusColor,
      assignTask
    };

    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    existingTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(existingTasks));

    setTaskDetail('');
    setTaskLink('');
    setStartDate('');
    setCloseDate('');
    setTaskStatus('');
    setTaskStatusColor('');
    setAssignTask('');

    navigate('/task-list');
  };

  return (
    <div>
      <h2>Task Create Page</h2>
      <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
      <form onSubmit={handleFormSubmit} className="task-form">
        <div>
          <label>Task Details:</label>
          <select value={taskDetail} onChange={handleTaskDetailChange} required>
            <option value="" disabled>Select Task Detail</option>
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label>External Link:</label>
          <input type="text" value={taskLink} onChange={handleTaskLinkChange} required />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={handleStartDateChange} required />
        </div>
        <div>
          <label>Close Date:</label>
          <input type="date" value={closeDate} onChange={handleCloseDateChange} required />
        </div>
        <div className="custom-dropdown">
          <label>Priority:</label>
          <select
            value={taskStatus}
            onChange={handleTaskStatusChange}
            required
            style={{ backgroundColor: taskStatusColor }}
          >
            <option value="" disabled>Select Status</option>
            <option value="High Priority">High Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="Low Priority">Low Priority</option>
            <option value="Bug">Bug</option>
            <option value ="No Priority">No Priority</option>
          </select>
        </div>
        <div className="custom-dropdown">
          <label>Assign Member:</label>
          <select
            value={assignTask}
            onChange={handleAssignTaskChange}
            required
          >
            <option value="" disabled>Select Person</option>
            <option value="jenitta">Jenitta</option>
            <option value="jeni">Jeni</option>
            <option value="jenijefri">JeniJefri</option>
            <option value="jefrinasujil">Jefrinasujil</option>
            <option value="UnAssign Person">Un Assign Person</option>
          </select>
        </div>
        <button type="submit">Submit Task</button>
      </form>
    </div>
  );
};

export default TaskView;
