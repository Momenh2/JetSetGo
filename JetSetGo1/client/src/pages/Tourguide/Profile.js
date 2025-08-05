import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css"; // Import the Profile.css file
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import Badge1 from '../../assets/images/ProfileTouristPic.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
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
        const response = await fetch(`/api/tour-guides/profile/${id}`);
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

  // Calculate the average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0; // Return 0 if there are no ratings
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (total / ratings.length).toFixed(1); // Round to 1 decimal place
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div className={styles["profile-container"]}>
        <p className="text-center text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className={styles["profile-container"]}>
       <div className="back-link" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" />
        <span className="text">Back</span>
      </div>
      {/* Header Section */}
      <div className={styles["profile-header"]}>
        {/* Update Profile Button */}
        
        <button
          onClick={() => navigate(`/update-profile/tour-guides/${id}`)}
          className={styles["update-profile-btn"]}
          type="button"
        >
          <i className="fas fa-pencil-alt"></i> 
        </button>

        <img
          src={`http://localhost:8000/${profile.profileImage}`}
          alt="Profile"
        />
        
        <h1 className={styles["UserName"]}>{profile.username}</h1>
        <p className={styles["editWidthExp"]}>{profile.experience}+ Years Experience</p>

        {/* Display Average Rating */}
        <div className={styles["average-rating"]}>
          <strong></strong> {calculateAverageRating(profile.ratings)} ⭐
        </div>
      </div>

      {/* Main Content */}
      <div className={styles["profile-content"]}>
        <h2>🔎About</h2>
        <p><strong>📧:</strong> {profile.email}</p>
        <p><strong>📞:</strong> {profile.mobile || "N/A"}</p>
        <p><strong>💼:</strong> {profile.previousWork || "N/A"}</p>
      </div>

      {/* Comments Section */}
      <div className={styles["comments-section"]}>
        <h2> 💬 Comments</h2>
        {profile.comments && profile.comments.length > 0 ? (
          profile.comments.map((comment) => (
            <div key={comment._id} className={styles["comment"]}>
              <img
                src={Badge1}
                alt={comment.tourist?.username || "Anonymous"}
              />
              <div className={styles["comment-text"]}>
                <p>{comment.text}</p>
                <div className={styles["comment-meta"]}>
                  - {comment.tourist?.username || "Anonymous"}{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

    </div>
  );
};

export default Profile;
