import React from 'react';
import './App.scss'; 
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SideBar from './Components/SideBar';
import Navb from './Components/Nav';

function App() {
  return (
    <Router>
      <Navb/>
      <div className='flex'>
      <SideBar/>
      <div className='content'>
        
      </div>
      </div>
    </Router>
  );
}

export default App;
