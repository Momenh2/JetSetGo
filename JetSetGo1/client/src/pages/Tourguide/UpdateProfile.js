import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateProfile.css";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

const UpdateProfile = () => {
  const token = Cookies.get("auth_token");
const decodedToken = jwtDecode(token);
const id = decodedToken.id;
console.log("id:",id);
const modelName = decodedToken.userType;
console.log("modelName:",modelName);

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    mobile: "",
    experience: "",
    previousWork: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/tour-guides/profile/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }
        const data = await response.json();
        setFormValues({
          username: data.username || "",
          email: data.email || "",
          mobile: data.mobile || "",
          experience: data.experience || "",
          previousWork: data.previousWork || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/api/tour-guides/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      navigate(`/profile/tour-guides/${id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="update-profile-container">
      <h2>Update Your Profile</h2>
      <form className="profile-form">
        <div className="form-group">
          <label htmlFor="username">
            Username <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            required
          />
          <small>Choose a unique username.</small>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
          <small>We’ll use this to contact you.</small>
        </div>

        <div className="form-group">
          <label htmlFor="mobile">
            Mobile <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formValues.mobile}
            onChange={handleInputChange}
            placeholder="Enter your mobile number"
            required
          />
          <small>Your contact number for communication.</small>
        </div>

        <div className="form-group">
          <label htmlFor="experience">
            Experience <span className="required">*</span>
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formValues.experience}
            onChange={handleInputChange}
            placeholder="Enter years of experience"
            required
          />
          <small>
            Enter the total number of years you’ve worked as a tour guide.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="previousWork">Previous Work</label>
          <textarea
            id="previousWork"
            name="previousWork"
            value={formValues.previousWork}
            onChange={handleInputChange}
            placeholder="Describe your previous work experience"
            rows="4"
          />
          <small>
            Briefly describe your previous experience in the industry.
          </small>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleUpdateProfile}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/tour-guides/${id}`)}
          >
            Cancel
          </button>
        </div>

        {/* New Buttons */}
        <div>
          <button
            type="button"
            onClick={() => navigate(`/change-password/${id}/tourguides`)}
            className="button-spacing"
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={() => navigate(`/RequestDelete/tour-guides/${id}`)}
            className="button-spacing"
          >
            Request Account Deletion
          </button>
          <button
            type="button"
            onClick={() => navigate(`/upload-image/${id}/tour-guides`)}
          >
            Upload Picture
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
