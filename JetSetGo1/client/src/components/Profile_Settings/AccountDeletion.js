import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AccountDeletion.css';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const RequestAccountDeletion = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("id: req", id);
  let modelName = decodedToken.userType;
  console.log("modelName: req", modelName);

  // const { id, modelName } = useParams();
  console.log(id)
  console.log(modelName)
  if(modelName == "TourGuide") modelName = "tour-guides";

  const handleDeleteRequest = async () => {
    setIsLoading(true);
    setMessage(null);

    if (!modelName || !id) {
      setMessage({ type: 'error', text: 'Missing user type or ID. Please check the URL.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:8000/api/${modelName}/requestDelete/${id}`);
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'An error occurred while processing your request.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="request-deletion-container">
      <div className="back-link" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" />
        <span className="text">Back</span>
      </div>
      <h2 className="request-deletion-title">Request Account Deletion</h2>
      <p className="request-deletion-info">
        Please note: Your account will only be deleted if you have no upcoming events, activities, or itineraries with paid bookings.
        Once requested, your account and associated content will not be visible to other users.
      </p>
      <button
        className="request-deletion-button"
        onClick={handleDeleteRequest}
        disabled={isLoading || !modelName || !id}
        aria-busy={isLoading}
      >
        {isLoading ? 'Processing...' : 'Request Account Deletion'}
      </button>
      {message && (
        <div
          className={`request-deletion-message ${message.type}`}
          role="alert"
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default RequestAccountDeletion;