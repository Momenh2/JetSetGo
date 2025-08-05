import React, { useState, useEffect } from 'react';
import { useParams,useNavigate} from 'react-router-dom'; // For extracting the tourist ID from the URL
import './TouristProfilePage.css'; // Import the CSS for styling

const TouristProfilePagehazem = () => {
  const { id } = useParams(); // Extract the tourist ID from the URL
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/tourist/profile/${id}`);
        if (!response.ok) throw new Error('Profile not found');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tourist-profile-container">
      <h2>Tourist Profile</h2>
      <p><strong>Name:</strong> {profile.username || 'N/A'}</p>
      <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
      <p><strong>Phone:</strong> {profile.mobile || 'N/A'}</p>
      <p><strong>Country:</strong> {profile.nationality || 'N/A'}</p>
      <p><strong>Date of birth:</strong> {profile.dob || 'N/A'}</p>
      <p><strong>Job:</strong> {profile.job || 'N/A'}</p>
      <p><strong>Wallet:</strong> {profile.wallet || 'N/A'}</p>
      

      {/* Button to navigate to the edit page */}
      <button onClick={() => navigate(`/edit/tourist/${id}`)}>Edit Profile</button>
    </div>
  );
};

export default TouristProfilePagehazem;
