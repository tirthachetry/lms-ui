import React, { useState } from 'react';
import axios from 'axios';
import './ViewLabours.css';

const ViewLabours = () => {
  const [location, setLocation] = useState('');
  const [labours, setLabours] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchLabours = async () => {
    if (!location.trim()) {
      setError('Location is required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`https://labour-management-system.onrender.com/api/labour/location/${location}`);
      setLabours(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching labour list');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (labour) => {
    setEditingId(labour.id);
    setEditData({ ...labour });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/api/labour/${editingId}`, editData);
      setLabours((prev) =>
        prev.map((labour) => (labour.id === editingId ? { ...editData } : labour))
      );
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error(err);
      alert('Failed to update labour');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  return (
    <div className="container">
      <h2>View Labour by Location</h2>
      {error && <p className="error">{error}</p>}
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter Location"
        required
      />
      <button onClick={fetchLabours}>Search</button>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="labour-list">
          {labours.length === 0 && !error && <p>No labours found.</p>}
          {labours.map((labour) => (
            <div className="labour-card" key={labour.id}>
              <h3>{labour.name}</h3>
              <p><strong>Phone:</strong> {labour.phone}</p>
              {editingId === labour.id ? (
                <>
                  <p>
                    <strong>Skill:</strong>{' '}
                    <input name="skill" value={editData.skill} onChange={handleEditChange} />
                  </p>
                  <p>
                    <strong>Location:</strong>{' '}
                    <input name="location" value={editData.location} onChange={handleEditChange} />
                  </p>
                  <p>
                    <strong>Hourly Rate:</strong>{' '}
                    <input
                      type="number"
                      name="hourlyRate"
                      value={editData.hourlyRate}
                      onChange={handleEditChange}
                    />
                  </p>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>Skill:</strong> {labour.skill}</p>
                  <p><strong>Location:</strong> {labour.location}</p>
                  <p><strong>Hourly Rate:</strong> ₹{labour.hourlyRate}</p>
                  <button onClick={() => startEditing(labour)}>Edit</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewLabours;
