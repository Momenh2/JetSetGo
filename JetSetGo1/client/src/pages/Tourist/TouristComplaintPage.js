import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import "./addComplaint.css"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";



const TouristAddComplaintPage = () => {
    // const { id } = useParams(); // Get userId from URL params
    const location = useLocation(); // Access the location object
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    console.log("id:", id); // Access the id from state
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch(`/api/tourist/addComplaint/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to add complaint');
            } else {
                setSuccessMessage('Complaint added successfully!');
                setTitle('');
                setBody('');
                navigate(-1)
            }
        } catch (err) {
            setError('An error occurred while adding the complaint');
            console.error('Error:', err);
        }
    };

    return (<div className="complaint-section">
        <div className="complaint-header">
          <div className="back-link" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="complaint-back-arrow" />
            <span className="complaint-back-text">Back</span>
          </div>
        </div>
          <h2 className="complaint-page-title">File a Complaint</h2>
        
        <form onSubmit={handleSubmit} className="complaint-form-wrapper">
          <div className="complaint-form-group">
            <label htmlFor="title" className="complaint-form-label">Title:</label>
            <input
              id="title"
              type="text"
              className="complaint-form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="complaint-form-group">
            <label htmlFor="body" className="complaint-form-label">Body:</label>
            <textarea
              id="body"
              className="complaint-form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="complaint-submit-button">Submit Complaint</button>
        </form>
        
        {error && <p className="complaint-error-message">{error}</p>}
        {successMessage && <p className="complaint-success-message">{successMessage}</p>}
      </div>
      
      
    );
};

export default TouristAddComplaintPage;