// src/components/Login.js
import React, { useState } from 'react';
//import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
      await axios.post('https://labour-management-system.onrender.com/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      });

      onLoginSuccess(username);
      navigate('/'); // ✅ redirect to home
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
