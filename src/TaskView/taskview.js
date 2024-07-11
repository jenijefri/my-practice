import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const TaskView = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  useEffect(() => {
  }, []); 

  return (
    <div>
      <h2> Welcome to Task View Page</h2>
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <button onClick={() => navigate('/create-task')} style={{ margin: '10px', padding: '10px 20px' }}>Create Task</button>
        <button onClick={() => navigate('/task-list')} style={{ margin: '10px', padding: '10px 20px' }}>Task List</button>
      </div>
    <button onClick={() => navigate('/home')} style={{ position: 'absolute', left: '10px', top: '10px' }}>&rarr;</button>
    </div>
  );
};

export default TaskView;
