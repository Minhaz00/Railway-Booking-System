// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Login.css'; // Import the Login CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic (e.g., API call)
    console.log('Logging in with:', { email, password });
  };

  const handleRegister = () => {
    navigate('/signup'); // Navigate to the registration page
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button 
        onClick={handleRegister} 
        style={{ marginTop: '10px', padding: '8px 16px' }} // Add padding and margin
      >
        Register
      </button>
    </div>
  );
};

export default Login;
