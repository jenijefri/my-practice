
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login/login';
import './Login/login.css';
import Home from './Home/Home';
import PreviewPage from './Login/preview';
import TaskView from './TaskView/taskview';
import TaskList from './TaskView/task-list';
import CreateTask from './TaskView/createtask';
import DailySatus from './Home/dailyStatus';
import Dashboard from './Home/dashboard';
import TaskContext from './TaskView/taskcontext';
import AddTask from './Home/Addtask';





const App = () => {
  return (
  
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="Home"element={<Home/>}/>
            <Route path="Addtask"element={<AddTask/>}/>
            <Route path="dashboard"element={<Dashboard/>}/>
            <Route path="createtask"element={<CreateTask/>}/>
           <Route path="taskview" element={<TaskView/>}/>
            <Route path="login" element={<Login />} />
            <Route path="preview" element={<PreviewPage/>}/>
            <Route path="task-list" element={<TaskList/>}/>
            <Route path="dailyStatus" element={<DailySatus/>}/>
            <Route path="taskcontext" element={<TaskContext/>}/>
           
           
          </Routes>
        </Router>
      </header>
    </div>
  );
};

export default App;
