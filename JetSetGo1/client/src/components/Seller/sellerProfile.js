import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sellerProfile.css"; // Import the Profile.css file
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  
  

  // Configure axios defaults
  //axios.defaults.baseURL = 'http://localhost:8000'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/sellers/profile/${id}`);
        
        if (!response.ok) {
          throw new Error("ERROR");
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
      <div className="back-link" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" />
        <span className="text">Back</span>
      </div>
      <div className="profile-header">
        {/* Update Profile Button */}
        <button
          onClick={() => navigate(`/Seller/upload-image/${id}/Seller`)}
          className="update-profile-btn"
        >
          <i className="fas fa-edit"></i> 
        </button>

         <img
          src={`http://localhost:8000/${profile.profileImage}`}
          alt="Profile"
        />
         
        <h1 className="UserName">{profile.username}</h1>
        {/* <p className="accepted">{profile.accepted}</p> */}

        {/* Main Content */}
      <div className="profile-content">
        <h2><i className="fa-solid fa-info-circle"></i> About</h2>
        <p className="description"><i className="fa-solid fa-user"></i> {profile.name}</p>
        <p><strong><i className="fa-solid fa-envelope"></i> </strong>  {profile.email}</p>
        <p className="description"><i className="fa-solid fa-align-left"></i>   {profile.description}</p>
      </div>
        
        
       
      </div>
        
      

      

    </div>
  );
};

export default SellerProfile;