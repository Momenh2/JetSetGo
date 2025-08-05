import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import './changePassword.css'
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation(); // Access the location object
  const token = Cookies.get("auth_token");
  
  const decodedToken = jwtDecode(token);
  //const id = decodedToken.id;
  const id = decodedToken.id;
  console.log("id:", id);
  const modelName = decodedToken.userType;
  console.log("modelName:", modelName);
  
  console.log(id, modelName)
  // const userId = useLocation().state.id
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)
    console.log(id);
    console.log(modelName);

    if (!id || !modelName) {
      setError('Missing required parameters')
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setIsLoading(false)
      return
    }


    const userTypeEndpoints = {
      "Advertisers": 'api/advertisers',
      'TourismGoverner': 'api/tourism-governer',
      "Seller": 'api/sellers',
      'TourGuide': 'api/tour-guides',
      "Admin": 'api/admin',
      "Tourist": 'api/tourist'
    }

    const endpoint = userTypeEndpoints[modelName];
      
       console.log(endpoint)

    try {
      const response = await axios.patch(
        `http://localhost:8000/${endpoint}/change-password/${id}/${modelName}`,
        {
          oldPassword,
          newPassword
        }
      )

      if (response.data.message) {
        setSuccess(true)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while changing the password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="change-password-container">
      <div className="back-link" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" />
        <span className="text">Back</span>
      </div>
      <div className="change-password-form">
        <h2 className="change-password-title">Change Password</h2>

        {error && (
          <div className="alert alert-error" role="alert">
            <strong className="alert-title">Error!</strong>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            <strong className="alert-title">Success!</strong>
            <span>Your password has been changed successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              Current Password
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}