import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login/login';
import './Login/login.css';
import Home from './Home/Home';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
};

export default App;
