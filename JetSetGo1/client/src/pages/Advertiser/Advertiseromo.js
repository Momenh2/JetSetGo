import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./Profile.css"; // Import the Profile.css file
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie


//The advertiser mother
const Advertiseromo = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/advertisers/profile/${id}`);
        if (!response.ok) {
          throw new Error("You are not accepted on the system yet <3");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div className="profile-container">
        <p className="text-center text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        {/* Update Profile Button */}
        <button
          onClick={() => navigate(`/upload-image/${id}/advertisers`)}
          className="update-profile-btn"
        >
          <i className="fas fa-pencil-alt"></i> 
        </button>

        <img
          src={`http://localhost:8000/${profile.profileImage}`}
          alt="Profile"
        />
        
        <h1 className="UserName">{profile.username}</h1>

       
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <h2>🔎About</h2>
        <p><strong>📧:</strong> {profile.email}</p>
        <p><strong>📞:</strong> {profile.hotline || "N/A"}</p>
        <p><strong>📎:</strong> {profile.websiteLink || "N/A"}</p>
        <p><strong>🏢:</strong> {profile.companyProfile || "N/A"}</p>

        
      </div>

      

    </div>
  );
};

export default Advertiseromo;