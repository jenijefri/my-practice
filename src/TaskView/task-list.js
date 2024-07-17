import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div>
      <h2>Task List</h2>
      <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
      <br></br>
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
      <div >
      <table style={{ borderCollapse: 'collapse', width: '90%', margin: '40px' }}>
        <thead>
          <tr>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'left' }}>Task Details</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'left' }}>External Link</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'left' }}>Start Date</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'left' }}>Close Date</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} style={{ border: '1px solid #ccc' }}>
              <td style={{ border: '2px solid black', padding: '8px' }}>{task.taskDetail}</td>
              <td style={{ border:'2px solid black', padding: '8px' }}><a href={task.taskLink} target="_blank" rel="noopener noreferrer">{task.taskLink}</a></td>
              <td style={{ border: '2px solid black', padding: '8px' }}>{task.startDate}</td>
              <td style={{ border: '2px solid black', padding: '8px' }}>{task.closeDate}</td>
              <td style={{ border: '2px solid black', padding: '8px' }}><span style={{ backgroundColor: task.taskStatusColor, padding: '2px 4px', borderRadius: '4px', color: '#fff' }}>{task.taskStatus}</span></td>
              <td style={{ border: '2px solid black', padding: '8px' }}><button onClick={() => handleDelete(index)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TaskList;
