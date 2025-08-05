import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';

import { faCog, faTags, faComments, faBox, faTasks, } from '@fortawesome/free-solid-svg-icons';
import { Edit } from 'react-feather'; // Importing Feather's edit icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCogs, faCalendarAlt, faMapMarkerAlt, faClock, faGlobe, faDollarSign, faWheelchair, faHotel, faCar, faTag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import IT from "../../assets/images/ItPic.jpg";
import "./ViewItineraryDetailes.css";
import EditableField from '../../components/EditableField';
axios.defaults.baseURL = 'http://localhost:8000'; // Backend URL
function ViewItineraryTourGuide() {
  const location = useLocation();

  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("Tour Guide ID:", id);

  const _id = useParams().ItineraryID; // Get _id from URL parameters
  console.log("Itinerary IDDDDDDD:", _id); // Log the itinerary ID

  const [itinerary, setItinerary] = useState(null); // Initialize itinerary as null
  const [availableDates,setAvailableDates] = useState(null);
  const [tags, setTags] = useState([]); // State to store all available tags
  const [isEditing, setIsEditing] = useState(false); // Track if we're in edit mode
    // Fetch the itinerary details
    useEffect(() => {
        const fetchItinerary = async () => {
          try {
            if (_id) {
              const response = await fetch(`/api/tour-guides/getSingleItinerary/${_id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
    
              if (!response.ok) {
                throw new Error("Failed to fetch itinerary details");
              }
    
              const data = await response.json(); // Parse the JSON response
              setItinerary(data); // Set itinerary data
              
              console.log("data.avaialable dates : " + data.availableDates[0].date)
              setFormData({
                title: data.title,
                description: data.description,
                price: data.price,
                locations: data.locations,
                timeline: data.timeline,
                language: data.language,
                accessibility: data.accessibility,
                pickupLocation: data.pickupLocation,
                dropoffLocation: data.dropoffLocation,
                availableDates: data.availableDates || [],  // Adding availableDates field
                tags: data.tags || [],  // Add tags to formData
                comments: data.comments || []  // Add comments to formData
              });
              
               // Set initial form data
              setReviews(data.comments || []); // Set reviews
              setAvailableDates(data.availableDates)
              //calculateDuration(data[0].tourGuide.createdAt); // Calculate the tour guide's duration
            }
          } catch (error) {
            console.error("Error fetching itinerary details:", error);
          }
        };
          
        fetchItinerary();
      }, [_id]);
    
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    locations: [],
    timeline: [],
    language: '',
    accessibility: '',
    pickupLocation: '',
    dropoffLocation: '',
    availableDates: [{ date: '', times: [''] }]  // Initialize availableDates with an array of objects
  });
  
  const [itineraries, setItineraries] = useState([]);
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [showReviewModal, setShowReviewModal] = useState(false); // State to show/hide review modal
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [filterRating, setFilterRating] = useState(0); // 0 = All Ratings
  const [tourGuideDuration, setTourGuideDuration] = useState("");
  const [sortOrder, setSortOrder] = React.useState("desc"); // "desc" = Highest to Lowest
  const [itineraryData, setItineraryData] = useState({ tags: [] });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

 
  
  const updateItinerary = async (updatedItinerary) => {
    // Optimistically update the UI
    setItinerary(updatedItinerary);

    try {
      const response = await fetch(`/api/tour-guides/updateItinerary/${updatedItinerary._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItinerary),
      });
      
      const data = await response.json();
      console.log("DATa OF GET ONE ITI :  " + data)
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || 'Error updating itinerary');
      }
    } catch (error) {
      setError('Error updating itinerary');
    }
  };
  // Toggle reviews to show more/less
  const toggleReviews = () => {
    setShowAll(!showAll);
  };
  const calculateDurationforReview = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const years = now.getFullYear() - createdDate.getFullYear();
    const months = now.getMonth() - createdDate.getMonth() + years * 12;

    const displayYears = Math.floor(months / 12);
    const displayMonths = months % 12;
    return (
      <p className="review-text">{displayMonths} and {displayYears || ""}</p>
    );
  };


  const visibleReviews = false ? itinerary.comments.length : 0; // Show 3 reviews initially
  const filteredAndSortedReviews = reviews
    .filter((review) => filterRating === 0 || review.rating === filterRating) // Filter by selected rating
    .sort((a, b) => (sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating));

  // Calculate the duration since the tour guide joined
  const calculateDuration = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const years = now.getFullYear() - createdDate.getFullYear();
    const months = now.getMonth() - createdDate.getMonth() + years * 12;

    const displayYears = Math.floor(months / 12);
    const displayMonths = months % 12;

    setTourGuideDuration(
      `${displayYears > 0 ? `${displayYears} year${displayYears > 1 ? "s" : ""}` : ""} ${
        displayMonths > 0 ? `${displayMonths} month${displayMonths > 1 ? "s" : ""}` : ""
      }`.trim()
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTagSelection = (tagId) => {
    // If the tag is already selected, remove it; otherwise, add it
    let updatedTags = itinerary.tags; // Start with the existing tags of the itinerary
    console.log("UPDATEDDDDD 111111: ",updatedTags)

    // Check if the tag is already selected
    if (updatedTags.includes(tagId)) {
      updatedTags = updatedTags.filter(t => t !== tagId);  // Remove the tag
    } else {
      updatedTags.push(tagId); // Add the tag
      console.log("UPDATEDDDDD : ",updatedTags)
    }
  
    // Update the itinerary data with the new list of tags
    setItineraryData({ ...itinerary, tags: updatedTags });
  
    // Optionally, update the backend immediately with the updated tags
     updateItinerary({ ...itinerary, tags: updatedTags });
  };
  
  
  
  const toggleItineraryStatus = async (id, activate) => {
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/tour-guides/itineraries/${activate ? 'activate' : 'deactivate'}/${id}`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setItinerary({ ...itinerary, active: activate });
      } else {
        setError(data.message || 'Error updating itinerary status');
      }
    } catch (error) {
      setError('Error updating itinerary status');
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  const renderStars = (rating) => {
    // rating = calculateAverageRating(rating);
    if (rating === null || rating === undefined) {
      return <p className="no-ratings">No ratings yet</p>;
    }
    const stars = Array.from({ length: 5 }, (_, index) => {
      const filledValue = index + 1;
      if (filledValue <= Math.floor(rating)) return "full";
      if (filledValue - 0.5 === rating) return "half";
      return "empty";
    });

    return (
      <div className="rating-stars">
        {stars.map((star, index) => (
          <span key={index} className={`star ${star}`} />
        ))}
      </div>
    );
  };

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



console.log("available dates :" +availableDates)

// console.log(itinerary.availableDates)
  const handleAvailableDatesChange = (index, field, value) => {
    const updatedDates = [...availableDates];
    if (field === 'date') {
      updatedDates[index].date = value;
    } else if (field === 'times') {
      updatedDates[index].times = value.split(','); // Convert comma-separated times into an array
    }
    setAvailableDates(updatedDates);
    updateItinerary({ ...itinerary, availableDates: updatedDates });
  };
  // If itinerary is not loaded yet
  if (!_id) {
    return <div>No itinerary data available!</div>;
  }

  if (!itinerary) {
    return <div>Loading itinerary...</div>;
  }
  return (
    <div className="itinerary-view-container">
      <div className="container">
        <div className="title"></div>
        <div className="detail">
          <div className="imageAndbutton">
            <div className="image image-wrapper">
              <img src={IT} alt={itinerary.title} className="product-image" />
            </div>
            <div className="ToggleActiveButton" style={{ marginTop: '20px' }}>
        <button
          onClick={() => toggleItineraryStatus(itinerary._id, true)}
          disabled={itinerary.active}
          style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: itinerary.active ? '#ccc' : '#28a745',
            color: '#fff',
            border: 'none',
            cursor: itinerary.active ? 'not-allowed' : 'pointer',
          }}
        >
          {itinerary.active ? 'Already Active' : 'Activate'}
        </button>
        <button
          onClick={() => toggleItineraryStatus(itinerary._id, false)}
          disabled={!itinerary.active}
          style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: !itinerary.active ? '#ccc' : '#dc3545',
            color: '#fff',
            border: 'none',
            cursor: !itinerary.active ? 'not-allowed' : 'pointer',
          }}
        >
          {!itinerary.active ? 'Already Deactivated' : 'Deactivate'}
        </button>
      </div>
          </div>
          <div className="content">
            <h1 className="name">{itinerary.title}</h1>
            <div className="description">{itinerary.description}</div>
            <div className="RatingPart">
            <div className="rating">{renderStars(calculateAverageRating(itinerary.ratings))}</div>
            {console.log("da el ratingssss : ",)}
                 {calculateAverageRating(itinerary.ratings) > 0
                  ? `${calculateAverageRating(itinerary.ratings)} (${itinerary.ratings.length})`
                  : "0 (0)"}
              </div>
            <div className="price">  {itinerary.price} EGP </div>
            <div>Inclusive of VAT</div>
            <p className={`itinerary-status ${itinerary.isBooked ? "booked" : "available"}`}>
              {itinerary.isBooked ? "Booked" : "Available"}
            </p>
            <div className="tour-guide-details">
              {/* <p><strong>Tour Guide: {itinerary.tourGuide.username}</strong></p> */}
              <div className="trust-bar-container">
                <label>Trust Level:</label>
                <div className="trust-bar">
                  <div className="trust-fill" style={{ width: `${1}%` }}></div>
                </div>
              </div>
            </div>
  
            {/* Activation/Deactivation Buttons */}
           {/* Activation/Deactivation Buttons */}
   
  
          </div>
        </div>
  
        <div className="ItineraryContent">
          <div className="itinerary-info-right" style={{ marginTop: '10px' }}>
            <button className="edit-image-btn">
              <Edit size={24} color="white" /> {/* Using Feather Edit icon */}
            </button>
  
            {/* Editable fields for itinerary details */}
            <div>
              <strong><FontAwesomeIcon icon={faAlignLeft} /> Description:</strong>
              <EditableField
                value={itinerary.description}
                onSave={(newDescription) => updateItinerary({ ...itinerary, description: newDescription })}
              />
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faCogs} /> Activities:</strong>
              <EditableField
                value={itinerary.activities.name.join(', ')}
                onSave={(newActivities) => updateItinerary({
                  ...itinerary, activities: { ...itinerary.activities, name: newActivities.split(', ') }
                })}
              />
            </div>
                
            {/* Render editable availableDates */}
            <div>
              <strong><FontAwesomeIcon icon={faCalendarAlt} /> Available Dates:</strong>
              {availableDates.map((dateObj, index) => (
                <div className ="Date_Time" key={index} style={{ marginBottom: '20px' }}>
                  <div>
                    <strong>Date:</strong>
                    <EditableField
                      value={dateObj.date}
                      onSave={(newDate) => handleAvailableDatesChange(index, 'date', newDate)}
                      inputType="date"
                    />
                  </div>
                  <div>
                    <strong>Times:</strong>
                    <EditableField
                      value={dateObj.times.join(', ')}
                      onSave={(newTimes) => handleAvailableDatesChange(index, 'times', newTimes)}
                      inputType="text"
                    />
                  </div>
                </div>
              ))}
            </div>
  
            {/* Other editable fields */}
            <div>
              <strong><FontAwesomeIcon icon={faMapMarkerAlt} /> Locations:</strong>
              <EditableField
                value={itinerary.locations.join(', ')}
                onSave={(newLocations) => updateItinerary({
                  ...itinerary, locations: newLocations.split(', ')
                })}
              />
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faClock} /> Timeline:</strong>
              <EditableField
                value={itinerary.timeline.join(', ')}
                onSave={(newTimeline) => updateItinerary({
                  ...itinerary, timeline: newTimeline.split(', ')
                })}
              />
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faGlobe} /> Language:</strong>
              <EditableField
                value={itinerary.language}
                onSave={(newLanguage) => updateItinerary({ ...itinerary, language: newLanguage })}
              />
            </div>
  
            <div>
              <strong>💲 Price:</strong>
              <EditableField
                value={itinerary.price}
                onSave={(newPrice) => updateItinerary({ ...itinerary, price: parseFloat(newPrice) })}
                inputType="number" // Ensure it's a number input
              />
            </div>
  
            <div>
              <strong>Accessibility:</strong>
              <EditableField
                value={itinerary.accessibility}
                onSave={(newAccessibility) => updateItinerary({ ...itinerary, accessibility: newAccessibility })}
                inputType="select" // Specify it's a dropdown list
                options={["wheelchair accessible", "not accessible", "limited accessibility"]} // Pass enum values
              />
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faHotel} /> Pickup Location:</strong>
              <EditableField
                value={itinerary.pickupLocation}
                onSave={(newPickupLocation) => updateItinerary({
                  ...itinerary, pickupLocation: newPickupLocation
                })}
              />
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faCar} /> Dropoff Location:</strong>
              <EditableField
                value={itinerary.dropoffLocation}
                onSave={(newDropoffLocation) => updateItinerary({
                  ...itinerary, dropoffLocation: newDropoffLocation
                })}
              />
            </div>
            <div className="tags-container">
        <strong><FontAwesomeIcon icon={faTags} /> Tags:</strong>
            {console.log("Those are tags :   " + tags)}
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag._id}
                type="button"
                className={`tag-btn ${itinerary.tags.includes(tag._id) ? 'selected' : ''}`}
                onClick={() => handleTagSelection(tag._id)}
              >
                {tag.tag_name}
              </button>
            ))
          ) : (
            <p>No tags available.</p>
          )}
        </div>
          </div>
        {/* Tags Selection */}
       
        </div>
  



      {/* Reviews Section */}
<div className="reviews-section">
  <h2>Comments from Tourists</h2>
  <div className="reviews-grid">
    {itinerary.comments && itinerary.ratings && (() => {
      const combinedReviews = [];
      
      // Loop over the comments array
      for (let i = 0; i < visibleReviews; i++) {
        {console.log(visibleReviews)}
        const comment = itinerary.comments[i];
        {console.log(comment.tourist)}
        // Find the matching rating for the current comment
        const matchingRating = itinerary.ratings.find(
          rating => rating.tourist._id === comment.tourist._id
        );

        
        // If a matching rating is found, push the combined data to the array
        if (matchingRating) {
          combinedReviews.push(
            <div key={i} className="review-box">
              <div className="review-header">
                {/* Display the tourist's name */}
                <span className="reviewer-name">{comment.tourist.username}</span>
                {console.log("matching.rating : " , matchingRating.rating)}
                {/* Display the rating using the renderStars function */}
                <div className="review-rating">{renderStars(matchingRating.rating)}</div>
              </div>
              
              {/* Display the comment */}
              <p className="review-text">{comment.text}</p>
              
              {/* Display the duration of the review */}
              {calculateDurationforReview(comment.createdAt)}
            </div>
          );
        }
      }
      
      // Return the combined reviews to be rendered
      return combinedReviews;
    })()}
  </div>

  {/* Show more/less reviews button */}
  </div>
          {filteredAndSortedReviews.length > 3 && (
            <button className="toggle-reviews-btn" onClick={toggleReviews}>
              {showAll ? "Show Less Reviews" : "See More Reviews"}
            </button>
          )}
        </div>
  
      </div>
  );
  
}

export default ViewItineraryTourGuide;
