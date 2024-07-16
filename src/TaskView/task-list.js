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
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <div>Task Details: {task.taskDetail}</div>
            <div>External Link: <a href={task.taskLink} target="_blank" rel="noopener noreferrer">{task.taskLink}</a></div>
            <div>Start Date: {task.startDate}</div>
            <div>Close Date: {task.closeDate}</div>
            <div>
              Status: <span style={{ backgroundColor: task.taskStatusColor, padding: '2px 4px', borderRadius: '4px', color: '#fff' }}>{task.taskStatus}</span>
            </div>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
