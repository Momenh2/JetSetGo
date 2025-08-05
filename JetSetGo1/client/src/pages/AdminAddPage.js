import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAddPage.css';

const AdminAddPage = () => {
  const [formValues, setFormValues] = useState({
    
    username: '',
    password: '',
   
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to add admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add admin');
      }

      const newAdmin = await response.json();
      console.log('Admin added:', newAdmin);
      navigate('/admin/profile'); // Redirect to the admin list or dashboard page after successful addition

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-container">
      <h2>Add New Admin</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleAddAdmin}>
        <input
          type="text"
          name="username"
          value={formValues.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
       
        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Admin...' : 'Add Admin'}
        </button>
      </form>
      <button onClick={() => navigate('/admin/profile')}>Cancel</button>
    </div>
  );
};

export default AdminAddPage;
