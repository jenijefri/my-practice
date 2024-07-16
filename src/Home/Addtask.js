import React from "react";
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        navigate('/login');
    };

    return (
        <div>
            <h2>Add task page</h2>
            <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
            <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>
                Logout
            </button>
        </div>
    );
};

export default AddTask;
