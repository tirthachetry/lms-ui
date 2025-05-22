import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';  // Import the axiosInstance
import './AddLabour.css';

const AddLabour = () => {
  const [labour, setLabour] = useState({
    name: '',
    phone: '',
    skill: '',
    location: '',
    hourlyRate: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setLabour({ ...labour, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, skill, location, hourlyRate } = labour;
    if (!name || !phone || !skill || !location || !hourlyRate) {
      setError('All fields are required.');
      setSuccessMessage('');
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const res = await axiosInstance.post('/api/labour/add', labour, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });  // Use axiosInstance for POST request
      setSuccessMessage(res.data);  // Success message from backend
      setError('');
      setLabour({ name: '', phone: '', skill: '', location: '', hourlyRate: '' });
    } catch (error) {
      console.error(error);
      setError('Failed to add labour.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      <h2>Add Labour</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={labour.name}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={labour.phone}
          onChange={handleChange}
          required
        />
        <input
          name="skill"
          placeholder="Skill"
          value={labour.skill}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={labour.location}
          onChange={handleChange}
          required
        />
        <input
          name="hourlyRate"
          placeholder="Hourly Rate"
          type="number"
          value={labour.hourlyRate}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Labour</button>
      </form>
    </div>
  );
};

export default AddLabour;
