import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const [task, setTask] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/add-task', { task });
      alert('Task added successfully');
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div>
    <h2>Add Task</h2>
    <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
    <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
    <div style={{ textAlign: 'center' }}>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'center' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          required
          style={{ padding: '10px', margin: '10px', fontSize: '16px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>Submit</button>
      </form>
    </div>
    </div>
  );
};

export default AddTask;
