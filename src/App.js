
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login/login';
import './Login/login.css';
import Home from './Home/Home';
import PreviewPage from './Login/preview';
import TaskView from './TaskView/taskview';
import CreateTask from './TaskView/create-task';
import TaskList from './TaskView/task-list';




const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
          
            <Route path="/" element={<Login />} />
           <Route path="taskview" element={<TaskView/>}/>
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="preview" element={<PreviewPage/>}/>
            <Route path="create-task" element={<CreateTask/>}/>
            <Route path="task-list" element={<TaskList/>}/>
           
           
          </Routes>
        </Router>
      </header>
    </div>
  );
};

export default App;
