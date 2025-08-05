import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from'./ItineraryAdd.module.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

axios.defaults.baseURL = 'http://localhost:8000'; // Backend URL

const ItineraryManager = () => {
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const tourGuide_ID = decodedToken.id;
  const navigate = useNavigate(); // Initialize useNavigate

  // State for form data
  const [itineraryData, setItineraryData] = useState({
    title: '',
    description: '',
    tourGuide: tourGuide_ID,
    activities: { name: [], duration: [] },
    locations: [],
    timeline: [],  // Timeline added
    tags: [], // This will hold selected tags
    language: '',
    price: '', // Price field
    availableDates: [{ date: '', times: [] }],
    accessibility: '', // Accessibility dropdown
    pickupLocation: '', // Pickup location
    dropoffLocation: '', // Dropoff location
    rating: 0,
    isBooked: false,
  });

  // State for fetched tags and country options
  const [tags, setTags] = useState([]);
  const [countryOptions] = useState([
    { value: 'US', label: 'United States' },
    { value: 'IN', label: 'India' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'BR', label: 'Brazil' },
    { value: 'JP', label: 'Japan' },
    { value: 'MX', label: 'Mexico' },
    { value: 'CN', label: 'China' },
    { value: 'RU', label: 'Russia' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'KR', label: 'South Korea' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'EG', label: 'Egypt' },
    { value: 'KE', label: 'Kenya' },
    { value: 'PH', label: 'Philippines' },
    { value: 'TH', label: 'Thailand' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'AR', label: 'Argentina' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colombia' },
    { value: 'PE', label: 'Peru' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'TR', label: 'Turkey' },
    { value: 'SE', label: 'Sweden' },
    { value: 'NO', label: 'Norway' },
    { value: 'FI', label: 'Finland' },
    { value: 'DK', label: 'Denmark' },
    { value: 'PL', label: 'Poland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'AT', label: 'Austria' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'BE', label: 'Belgium' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'GR', label: 'Greece' },
    { value: 'CZ', label: 'Czech Republic' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'HU', label: 'Hungary' },
    { value: 'RO', label: 'Romania' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'HR', label: 'Croatia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'BA', label: 'Bosnia and Herzegovina' },
    { value: 'RS', label: 'Serbia' },
    { value: 'MK', label: 'North Macedonia' },
    { value: 'AL', label: 'Albania' },
    { value: 'ME', label: 'Montenegro' },
    { value: 'AM', label: 'Armenia' },
    { value: 'AZ', label: 'Azerbaijan' },
    { value: 'BY', label: 'Belarus' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'MD', label: 'Moldova' },
    { value: 'LT', label: 'Lithuania' },
    { value: 'LV', label: 'Latvia' },
    { value: 'EE', label: 'Estonia' },
    { value: 'IS', label: 'Iceland' },
    { value: 'MT', label: 'Malta' },
    { value: 'LI', label: 'Liechtenstein' },
    { value: 'FO', label: 'Faroe Islands' },
    { value: 'IM', label: 'Isle of Man' },
    { value: 'JE', label: 'Jersey' },
    { value: 'GG', label: 'Guernsey' }
  ]);

  // Error and Success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/admin/tag');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setError('Failed to load tags.');
      }
    };
    fetchTags();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setItineraryData({
      ...itineraryData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle adding/removing activities
  const handleActivityChange = (index, type, value) => {
    const updatedActivities = { ...itineraryData.activities };
    updatedActivities[type][index] = value;
    setItineraryData({
      ...itineraryData,
      activities: updatedActivities,
    });
  };

  const addActivity = () => {
    setItineraryData({
      ...itineraryData,
      activities: {
        name: [...itineraryData.activities.name, ''],
        duration: [...itineraryData.activities.duration, ''],
      },
    });
  };

  const removeActivity = (index) => {
    const updatedActivities = { ...itineraryData.activities };
    updatedActivities.name.splice(index, 1);
    updatedActivities.duration.splice(index, 1);
    setItineraryData({
      ...itineraryData,
      activities: updatedActivities,
    });
  };

  // Handle adding/removing available dates
  const handleAvailableDateChange = (index, value) => {
    const updatedDates = [...itineraryData.availableDates];
    updatedDates[index].date = value;
    setItineraryData({
      ...itineraryData,
      availableDates: updatedDates,
    });
  };

  const handleAvailableTimeChange = (dateIndex, timeIndex, value) => {
    const updatedDates = [...itineraryData.availableDates];
    updatedDates[dateIndex].times[timeIndex] = value;
    setItineraryData({
      ...itineraryData,
      availableDates: updatedDates,
    });
  };

  const addAvailableDate = () => {
    setItineraryData({
      ...itineraryData,
      availableDates: [...itineraryData.availableDates, { date: '', times: [] }],
    });
  };

  const removeAvailableDate = (index) => {
    const updatedDates = itineraryData.availableDates.filter((_, idx) => idx !== index);
    setItineraryData({
      ...itineraryData,
      availableDates: updatedDates,
    });
  };

  // Handle adding/removing locations
  const handleLocationChange = (index, value) => {
    const updatedLocations = [...itineraryData.locations];
    updatedLocations[index] = value;
    setItineraryData({
      ...itineraryData,
      locations: updatedLocations,
    });
  };

  const addLocation = () => {
    setItineraryData({
      ...itineraryData,
      locations: [...itineraryData.locations, ''],
    });
  };

  const removeLocation = (index) => {
    const updatedLocations = itineraryData.locations.filter((_, idx) => idx !== index);
    setItineraryData({
      ...itineraryData,
      locations: updatedLocations,
    });
  };

  // Handle tag selection
  const handleTagSelection = (tagId) => {
    setItineraryData((prevData) => {
      const selectedTags = prevData.tags.includes(tagId)
        ? prevData.tags.filter((id) => id !== tagId) // Remove tag if already selected
        : [...prevData.tags, tagId]; // Add tag if not selected
      return { ...prevData, tags: selectedTags };
    });
  };

  // Handle timeline change
  const handleTimelineChange = (index, value) => {
    const updatedTimeline = [...itineraryData.timeline];
    updatedTimeline[index] = value;
    setItineraryData({
      ...itineraryData,
      timeline: updatedTimeline,
    });
  };

  const removeTimeline = (index) => {
    const updatedTimeline = itineraryData.timeline.filter((_, idx) => idx !== index);
    setItineraryData({
      ...itineraryData,
      timeline: updatedTimeline,
    });
  };

  const addTimeline = () => {
    setItineraryData({
      ...itineraryData,
      timeline: [...itineraryData.timeline, ''],
    });
  };

  // Submit form (create itinerary)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Correct URL format for your backend route
        await axios.post(`/api/tour-guides/createItinerary/${tourGuide_ID}`, itineraryData);
        setSuccess('Itinerary created successfully!');
        resetForm();
        setError('');
    } catch (error) {
        setError('Error submitting itinerary');
    }
};

  // Reset form
  const resetForm = () => {
    setItineraryData({
      title: '',
      description: '',
      tourGuide: tourGuide_ID,
      activities: { name: [], duration: [] },
      locations: [],
      timeline: [],  // Reset timeline here
      tags: [],
      language: '',
      price: '', // Reset price here
      availableDates: [{ date: '', times: [] }],
      accessibility: '', // Reset accessibility here
      pickupLocation: '', // Reset pickupLocation here
      dropoffLocation: '', // Reset dropoffLocation here
      rating: 0,
      isBooked: false,
    });
  };

 // Handle Cancel button click (go back)
 const handleCancel = () => {
  navigate(-1); // Go back to the previous page
};

return (
  <div className={styles["itinerary-manager"]}>
    <h1 className={styles.title}>
            <div className="back-link" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" />
              <span className="text">Back</span>
            </div>
  <FontAwesomeIcon icon={faMapMarkedAlt} style={{ marginRight: '10px' }} />
  <strong>Create New Itinerary</strong>
  <FontAwesomeIcon icon={faMapMarkedAlt} style={{ marginLeft: '10px' }} />
</h1>

    {error && <div className={styles["error-message"]}>{error}</div>}
    {success && <div className={styles["success-message"]}>{success}</div>}

    <form onSubmit={handleSubmit} className={styles["itinerary-form"]}>
      {/* Title and Description */}
      <input type="text" name="title" placeholder="Title" value={itineraryData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={itineraryData.description} onChange={handleChange} required />

      {/* Price */}
      <input type="number" name="price" placeholder="Price" value={itineraryData.price} onChange={handleChange} required />

      {/* Accessibility */}
      <select name="accessibility" value={itineraryData.accessibility} onChange={handleChange} required>
        <option value="">Select Accessibility</option>
        <option value="wheelchair accessible">Wheelchair Accessible</option>
        <option value="not accessible">Not Accessible</option>
        <option value="limited accessibility">Limited Accessibility</option>
      </select>

      {/* Pickup Location */}
      <input type="text" name="pickupLocation" placeholder="Pickup Location" value={itineraryData.pickupLocation} onChange={handleChange} required />

      {/* Dropoff Location */}
      <input type="text" name="dropoffLocation" placeholder="Dropoff Location" value={itineraryData.dropoffLocation} onChange={handleChange} required />

      {/* Country Selection Dropdown */}
      <select name="language" value={itineraryData.language} onChange={e => handleChange(e)} required>
        <option value="">Select Language</option>
        {countryOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

{/* Tags Selection */}
<div>
  <label className={styles["tags-label"]}>Select Tags:</label> {/* Added label */}
  <div className={styles["tags-container"]}>
    {tags.map((tag) => (
      <button
        key={tag._id}
        type="button"
        className={`tag-btn ${itineraryData.tags.includes(tag._id) ? 'selected' : ''}`}
        onClick={() => handleTagSelection(tag._id)}
      >
        {tag.tag_name}
      </button>
    ))}
  </div>
</div>

      {/* Activities */}
      <h3>Activities</h3>
      {itineraryData.activities.name.map((_, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Activity Name"
            value={itineraryData.activities.name[index]}
            onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Activity Duration"
            value={itineraryData.activities.duration[index]}
            onChange={(e) => handleActivityChange(index, 'duration', e.target.value)}
          />
          <button
  type="button"
  className={styles["remove-button"]}
  onClick={() => removeActivity(index)} // replace with the correct remove function
>
  X
</button>
        </div>
      ))}
      <button className={styles["add-button"]} type="button" onClick={addActivity}>+</button>

      {/* Timeline */}
      <h3>Timeline</h3>
      {itineraryData.timeline.map((entry, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Timeline Entry"
            value={entry}
            onChange={(e) => handleTimelineChange(index, e.target.value)}
          />
          <button
  type="button"
  className={styles["remove-button"]}
  onClick={() => removeTimeline(index)} // replace with the correct remove function
>
  X
</button>
        </div>
      ))}
      <button className={styles["add-button"]} type="button" onClick={addTimeline}>+</button>

      {/* Available Dates */}
      <h3>Available Dates</h3>
      {itineraryData.availableDates.map((dateItem, dateIndex) => (
        <div key={dateIndex}>
          <input
            type="date"
            value={dateItem.date}
            onChange={(e) => handleAvailableDateChange(dateIndex, e.target.value)}
          />
          {dateItem.times.map((time, timeIndex) => (
            <input
              type="time"
              key={timeIndex}
              value={time}
              onChange={(e) => handleAvailableTimeChange(dateIndex, timeIndex, e.target.value)}
            />
          ))}
          <button
  type="button"
  className={styles["remove-button"]}
  onClick={() => removeAvailableDate(dateIndex)} // replace with the correct remove function
>
  X
</button>
        </div>
      ))}
      <button className={styles["add-button"]} type="button" onClick={addAvailableDate}>+</button>

      {/* Locations */}
      <h3>Locations</h3>
      {itineraryData.locations.map((location, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => handleLocationChange(index, e.target.value)}
          />
                    <button
  type="button"
  className={styles["remove-button"]}
  onClick={() => removeLocation(index)} // replace with the correct remove function
>
  X
</button>
        </div>
      ))}
      <button className={styles["add-button"]} type="button" onClick={addLocation}>+</button>
      <div className={styles["SubmitCancel"]}>
          {/* Cancel Button */}
      <button className={styles["cancel-button"]} type="button" onClick={handleCancel}>Cancel</button>
      {/* Submit Button */}
      <button className={styles["SubmitButtonCreate"]} type="submit">Create</button>

    
      </div>
    </form>
  </div>
);
};

export default ItineraryManager;