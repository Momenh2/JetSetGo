import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use React Router to navigate to the UpdateProfile component
import '../pages/Tourguide/Profile.css';
import { useParams } from 'react-router-dom';

const CreateProfile = () => {
    const {id} = useParams();
    const [formValues, setFormValues] = useState({
        mobile: '',
        experience: '',
        previousWork: '',
      });
   
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

      // Handle form input changes
  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to create a profile
  const handleCreateProfile = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    setLoading(true);

    try {
      const response = await fetch(`/api/tour-guides/create/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }

      const createdProfile = await response.json();

      // Navigate to the profile view page after successful creation
      navigate(`/profile/tour-guides/${id}`);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-container">
      <h2>Create Tour Guide Profile</h2>

      {error && <p className="error-message">Error: {error}</p>}

      <form onSubmit={handleCreateProfile}>
        <div>
          <label>Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formValues.mobile}
            onChange={handleInputChange}
            required
            placeholder="Enter mobile number"
          />
        </div>

        <div>
          <label>Experience</label>
          <textarea
            name="experience"
            value={formValues.experience}
            onChange={handleInputChange}
            required
            placeholder="Describe your experience"
          />
        </div>

        <div>
          <label>Previous Work</label>
          <textarea
            name="previousWork"
            value={formValues.previousWork}
            onChange={handleInputChange}
            placeholder="Describe previous work experience"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );

};

export default CreateProfile;

