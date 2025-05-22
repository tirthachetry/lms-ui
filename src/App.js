import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ViewLabour from './components/ViewLabours';
import AddLabour from './components/AddLabour';
import Login from './components/Login';
import axiosInstance from './utils/axiosInstance';
import './App.css';

const getCSRFToken = () => {
    const name = "XSRF-TOKEN";  // Default name for CSRF token set by Spring Security
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        const token = parts.pop().split(';').shift();
        console.debug("✅ App.js CSRF token found:", token);
        return token;
    }

    console.warn("⚠️ App.js CSRF token not found in cookies.");
    return null;  // If no token found
};

function Home({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  await axiosInstance.get('/api/labour/location/any', {
    withCredentials: true
  });
  const csrfToken = getCSRFToken();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
    setLoggedInUser(null);
    navigate('/');
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>Labour Management System</h1>
        <div className="header-actions">
          {!loggedInUser ? (
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          ) : (
            <>
              <span className="welcome-msg">Welcome, {loggedInUser}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>

      <main>
        <ViewLabour />
        {loggedInUser && <AddLabour />}
      </main>
    </div>
  );
}


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLoginSuccess = (username) => {
    setLoggedInUser(username);
  };

  return (
    <Router>
  <Routes>
    <Route
      path="/"
      element={<Home loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />}
    />
    <Route
      path="/login"
      element={<Login onLoginSuccess={setLoggedInUser} />}
    />
  </Routes>
</Router>
  );
}

export default App;
