import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ViewLabour from './components/ViewLabours';
import AddLabour from './components/AddLabour';
import Login from './components/Login';
import axiosInstance from './utils/axiosInstance';
import './App.css';

function Home({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();

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
