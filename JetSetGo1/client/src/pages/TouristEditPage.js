import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TouristEditPage.css';

const TouristEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    mobile: '',
    country: '',
    languages: '',
    interests: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTouristInfo = async () => {
      try {
        const response = await fetch(`/api/tourist/profile/${id}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setFormValues({
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          country: data.country || '',
          languages: data.languages?.join(', ') || '',
          interests: data.interests?.join(', ') || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTouristInfo();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to update tourist information
  const handleUpdateTourist = async () => {
    try {
      const response = await fetch(`/api/tourist/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formValues,
          languages: formValues.languages.split(',').map(lang => lang.trim()), // Split languages by comma
          interests: formValues.interests.split(',').map(interest => interest.trim()), // Split interests by comma
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      navigate(`/profile/tourist/${id}`); // Redirect back to the profile page
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tourist-edit-container">
      <h2>Edit Tourist Profile</h2>
      <input
        type="email"
        name="email"
        value={formValues.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        type="tel"
        name="mobile"
        value={formValues.mobile}
        onChange={handleInputChange}
        placeholder="Mobile"
      />
      <input
        type="text"
        name="nationality"
        value={formValues.nationality}
        onChange={handleInputChange}
        placeholder="Nationality"
      />
      <input
        type="text"
        name="job"
        value={formValues.job}
        onChange={handleInputChange}
        placeholder="Job"
      />
      <button onClick={handleUpdateTourist}>Save Changes</button>
      <button onClick={() => navigate(`/profile/tourist/${id}`)}>Cancel</button>
    </div>
  );
};

export default TouristEditPage;
