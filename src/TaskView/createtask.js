import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CreateTask = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCreateTaskClick = () => {
    // Redirect to TaskView page
    navigate('/taskview');
  };
  const handleTaskList=()=>{
    navigate('/task-list');
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div className="create-task-container">
      <h2>Welcome to task over view Page</h2>
      <button onClick={() => navigate('/dashboard')}>Go Back to Home</button> <br></br> 
      <br></br>
      <div className="tab-container">
      <button className="tab-button" onClick={(handleCreateTaskClick)}>Create Task</button>
      <button className="tab-button" onClick={(handleTaskList)}>Task List</button>
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
    </div>
    </div>
  );
};

export default CreateTask;
