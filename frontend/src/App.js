// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import './App.css'; // Import the CSS file
import TrainBooking from './components/SearchTrain/SearchTrain';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <h1>Railway System</h1>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route to show Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<TrainBooking />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
