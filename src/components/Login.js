// src/components/Login.js
import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const getCSRFToken = () => {
  const name = 'XSRF-TOKEN';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


const handleLogin = async (e) => {
  e.preventDefault();
  console.log('[Login] Login form submitted');

  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  try {
    console.log('[Login] Fetching CSRF token from /csrf...');
    const csrfRes = await axios.get('/csrf', {
      withCredentials: true
    });
    console.log('[Login] CSRF token request status:', csrfRes.status);

    const csrfToken = getCSRFToken();
    console.log('[Login] Extracted CSRF token:', csrfToken);

    if (!csrfToken) {
      console.error('[Login] CSRF token not found in cookies');
      throw new Error('CSRF token not found');
    }

    console.log('[Login] Sending login request to /login...');
    const loginRes = await axios.post('/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-XSRF-TOKEN': csrfToken,
        },
        withCredentials: true
      }
    );

    console.log('[Login] Login successful:', loginRes.status);
    onLoginSuccess(username);
    navigate('/');

  } catch (err) {
    console.error('[Login] Login failed:', err);
    setError("Login failed. Check credentials or CSRF setup.");
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
