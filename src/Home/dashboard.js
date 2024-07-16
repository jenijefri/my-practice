import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div>
      <h2>DashBoard Page</h2>
      {user ? (
        <>
          <p style={{textAlign:'center',fontSize:25}}>Welcome, {user.email}! DashBoard Page</p>
          <div>
          <div className="tab-container">
      <button className="tab-button" onClick={() => navigate('/Addtask')}>Add Task</button>     
      <button className="tab-button" onClick={() => navigate('/taskview')}>Create Task</button>
      <button className="tab-button" onClick={() => navigate('/task-list')}>Task List</button>
      <button className="tab-button" onClick={() => navigate('/dailyStatus')}>Daily Status</button>
      <button className="tab-button" onClick={() => navigate('/preview')}>Preview Task</button>
    </div>
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
