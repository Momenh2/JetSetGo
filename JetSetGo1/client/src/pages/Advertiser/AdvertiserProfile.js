'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

export default function AdvertiserProfile() {
  // const params = useParams()
  // const userId = params.id
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  console.log("ana hena 3ayz a3raf el ID")
  console.log(userId)




  console.log(userId)  
  const [formValues, setFormValues] = useState({
    companyProfile: '',
    websiteLink: '',
    hotline: '',
  })
   
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:8000'

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/advertisers/profile/${userId}`)
        const data = response.data
        
        setFormValues({
          companyProfile: data.companyProfile || '',
          websiteLink: data.websiteLink || '',
          hotline: data.hotline || '',
        })
        setIsEditing(false)
      } catch (err) {
        console.error('Error fetching user data:', err)
        if (err.response) {
          setError(err.response.data.error || 'Failed to fetch')
        } else if (err.request) {
          setError('Network error occurred')
        } else {

        }
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    /*try {
      await axios.post(`/api/advertisers/createProfile/${userId}`, formValues)

      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      if (err.response) {
        setError(err.response.data.error || 'Failed to update profile')
      } else if (err.request) {
        setError('Network error occurred')
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }*/
    try {
      await axios.patch(`/api/advertisers/updateProfile/${userId}`, formValues)

      setIsEditing(true)
    } catch (err) {
      console.error('Error updating profile:', err)
      if (err.response) {
        setError(err.response.data.error || 'Failed to update profile')
      } else if (err.request) {
        setError('Network error occurred')
      } else {

      }
    } finally {
      setLoading(false)
      setIsEditing(true)
    }
  }


  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Edit Advertiser Profile</h2>
        </div>
        <div className="card-content">
          {error && <p className="error-message">Error: {error}</p>}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="companyProfile">Company Profile</label>
              <textarea
                id="companyProfile"
                name="companyProfile"
                value={formValues.companyProfile}
                onChange={handleInputChange}
                required
                placeholder="Enter your company profile"
                disabled={!isEditing}
                className="textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="websiteLink">Website Link</label>
              <input
                id="websiteLink"
                name="websiteLink"
                value={formValues.websiteLink}
                onChange={handleInputChange}
                required
                placeholder="Enter your website link"
                disabled={!isEditing}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hotline">Hotline</label>
              <input
                id="hotline"
                name="hotline"
                value={formValues.hotline}
                onChange={handleInputChange}
                required
                placeholder="Enter your hotline number"
                disabled={!isEditing}
                className="input"
              />
            </div>

            {isEditing ? (
              <button type="submit" disabled={loading} className="button">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="button">
                Edit Profile
              </button>
            )}
          </form>
                  {/* New Buttons */}
        <div>
          <button
            type="button"
            onClick={() => navigate(`/change-password/${userId}/advertisers`)}
            className="button-spacing"
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={() => navigate(`/RequestDelete/${userId}/advertisers`)}
            className="button-spacing"
          >
            Request Account Deletion
          </button>
          <button
            type="button"
            onClick={() => navigate(`/upload-image/${userId}/advertisers`)}
          >
            Upload Picture
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}