import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';

import { faCog, faTags, faComments, faBox, faTasks, } from '@fortawesome/free-solid-svg-icons';
import { Edit } from 'react-feather'; // Importing Feather's edit icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCogs, faCalendarAlt, faMapMarkerAlt, faClock, faGlobe, faDollarSign, faWheelchair, faHotel, faCar, faTag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
//import IT from "../assets/images/activities";
//import "./ViewItineraryDetailes.css";
import EditableField from '../components/EditableField';
//import { updateActivity } from '../../../server/controllers/advertiserController';

axios.defaults.baseURL = 'http://localhost:8000'; // Backend URL
function Updateavtivityadvertiser  (){
  const location = useLocation();

  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("Advertiser ID:", id);
  const { advertiserId, activityId } = useParams();

  const _id = activityId; // Get _id from URL parameters
  console.log("activity ID:", _id); // Log the itinerary ID

  const [activity, setActivity] = useState(null); // Initialize itinerary as null
  const [availableDates,setAvailableDates] = useState(null);
  const [tags, setTags] = useState([]); // State to store all available tags
  const [category, setCategory] = useState([]); // State to store all available tags

  const [isEditing, setIsEditing] = useState(false); // Track if we're in edit mode
    // Fetch the itinerary details
    useEffect(() => {
        const fetchActivity = async () => {
          try {
            if (_id) {
                console.log(_id);
              const response = await fetch(`/api/advertisers/getSingleActivity/${_id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
    
              if (!response.ok) {
                throw new Error("Failed to fetch itinerary details");
              }
    
              const data = await response.json(); // Parse the JSON response
              setActivity(data); // Set itinerary data
              
             // console.log("data.avaialable dates : " + data.availableDates[0].date)
              setFormData({
                title: data.title,
                description: data.description,
                date: data.data,
                time: data.time,
                locations: data.locations,
                price: data.price,
                category: data.category,
                language: data.language,
                tags: data.tags || [],  // Add tags to formData
                advertiser: id,
                bookingOpen: data.bookingOpen,
                specialDiscounts:data.specialDiscounts,
                flagged: data.flagged

            });
              
               // Set initial form data
              setReviews(data.comments || []); // Set reviews
              //setAvailableDates(data.availableDates)
              //calculateDuration(data[0].activity.createdAt); // Calculate the tour guide's duration
            }
          } catch (error) {
            console.error("Error fetching itinerary details:", error);
          }
        };
          
        fetchActivity();
      }, [_id]);
    
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    locations: '',
    price: '',
    category: '',
    language: '',
    tags: [],  // Add tags to formData
    advertiser: id,
    bookingOpen: '',
    specialDiscounts:'',
    flagged: ''
  });
  
  const [activities, setActivities] = useState([]);
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [showReviewModal, setShowReviewModal] = useState(false); // State to show/hide review modal
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [filterRating, setFilterRating] = useState(0); // 0 = All Ratings
  const [tourGuideDuration, setTourGuideDuration] = useState("");
  const [sortOrder, setSortOrder] = React.useState("desc"); // "desc" = Highest to Lowest
  const [activitiesData, setActivitiesData] = useState({ tags: [] });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

 
  
  const updatedActivity = async (updatedActivity) => {
    // Optimistically update the UI
    setActivity(updatedActivity);

    try {
      const response = await fetch(`/api/advertisers/updatedActivity/${updatedActivity._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedActivity),
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


  const visibleReviews = showAll ? activity.comments.length : 3; // Show 3 reviews initially
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
    let updatedTags = activity.tags; // Start with the existing tags of the itinerary
    console.log("UPDATEDDDDD 111111: ",updatedTags)

    // Check if the tag is already selected
    if (updatedTags.includes(tagId)) {
      updatedTags = updatedTags.filter(t => t !== tagId);  // Remove the tag
    } else {
      updatedTags.push(tagId); // Add the tag
      console.log("UPDATEDDDDD : ",updatedTags)
    }
  
    // Update the itinerary data with the new list of tags
    setActivitiesData({ ...activity, tags: updatedTags });
  
    // Optionally, update the backend immediately with the updated tags
    updatedActivity({ ...activity, tags: updatedTags });
  };
  
  
  
//   const toggleItineraryStatus = async (id, activate) => {
//     setMessage('');
//     setError('');

//     try {
//       const response = await fetch(`/api/tour-guides/itineraries/${activate ? 'activate' : 'deactivate'}/${id}`, {
//         method: 'PATCH',
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message);
//         setItinerary({ ...itinerary, active: activate });
//       } else {
//         setError(data.message || 'Error updating itinerary status');
//       }
//     } catch (error) {
//       setError('Error updating itinerary status');
//     }
//   };

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
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`/api/tourist/categoryName/${activity.category}`);
        setCategory(response.data);
        category = response.data;

      } catch (error) {
        console.error('Error fetching tags:', error);
        setError('Failed to load tags.');
      }
    };
    fetchTags();
  }, []);


console.log("available dates :" +availableDates)

// console.log(itinerary.availableDates)
//   const handleAvailableDatesChange = (index, field, value) => {
//     const updatedDates = [...availableDates];
//     if (field === 'date') {
//       updatedDates[index].date = value;
//     } else if (field === 'times') {
//       updatedDates[index].times = value.split(','); // Convert comma-separated times into an array
//     }
//     setAvailableDates(updatedDates);
//     updateItinerary({ ...itinerary, availableDates: updatedDates });
//   };
  // If itinerary is not loaded yet
  if (!_id) {
    return <div>No itinerary data available!</div>;
  }

  if (!activity) {
    return <div>Loading itinerary...</div>;
  }
  return (
    <div className="itinerary-view-container">
      <div className="container">
        <div className="title"></div>
        <div className="detail">
          <div className="imageAndbutton">
            <div className="image image-wrapper">
              {/* <img src={IT} alt={activity.title} className="product-image" /> */}
            </div>
            <div className="ToggleActiveButton" style={{ marginTop: '20px' }}>
        {/* <button
          onClick={() => toggleItineraryStatus(activity._id, true)}
          disabled={activity.active}
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
        </button> */}
        {/* <button
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
        </button> */}
      </div>
          </div>
          <div className="content">
            <h1 className="name">{activity.title}</h1>
            <div className="description">{activity.description}</div>
            <div className="RatingPart">
            <div className="rating">{renderStars(calculateAverageRating(activity.ratings))}</div>
            {console.log("da el ratingssss : ",)}
                 {calculateAverageRating(activity.ratings) > 0
                  ? `${calculateAverageRating(activity.ratings)} (${activity.ratings.length})`
                  : "0 (0)"}
              </div>
            <div className="price">  {activity.price} EGP 
            </div>
            <div className="price">  {activity.locations} 
            </div>
            <div className="price">  {activity.category}  
            </div>
            <div className="price">  {activity.specialDiscounts}  
            </div>
            <div className="price">  {activity.bookingOpen}  
            </div>
            
            <div>Inclusive of VAT</div>
            <p className={`itinerary-status ${activity.isBooked ? "booked" : "available"}`}>
              {activity.isBooked ? "Booked" : "Available"}
            </p>
            <div className="tour-guide-details">
              {/* <p><strong>Tour Guide: {itinerary.tourGuide.username}</strong></p> */}
              <div className="trust-bar-container">
                {/* <label>Trust Level:</label> */}
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
                value={activity.description}
                onSave={(newDescription) => updatedActivity({ ...activity, description: newDescription })}
              />
            </div>
  
            {/* <div>
              <strong><FontAwesomeIcon icon={faCogs} /> Activities:</strong>
              <EditableField
                value={activity.name.join(', ')}
                onSave={(newActivities) => updatedActivity({
                  ...activity, activities: { ...activity.activities, name: newActivities.split(', ') }
                })}
              />
            </div> */}
                
            {/* Render editable availableDates */}
            {/* <div>
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
            </div> */}
  
            {/* Other editable fields */}
            {/* <div>
              <strong><FontAwesomeIcon icon={faMapMarkerAlt} /> Locations:</strong>
              <EditableField
                value={itinerary.locations.join(', ')}
                onSave={(newLocations) => updateItinerary({
                  ...itinerary, locations: newLocations.split(', ')
                })}
              />
            </div> */}
  
            {/* <div>
              <strong><FontAwesomeIcon icon={faClock} /> Timeline:</strong>
              <EditableField
                value={itinerary.timeline.join(', ')}
                onSave={(newTimeline) => updateItinerary({
                  ...itinerary, timeline: newTimeline.split(', ')
                })}
              />
            </div> */}
  
            {/* <div>
              <strong><FontAwesomeIcon icon={faGlobe} /> Language:</strong>
              <EditableField
                value={itinerary.language}
                onSave={(newLanguage) => updateItinerary({ ...itinerary, language: newLanguage })}
              />
            </div> */}
  
  
            <div>
              <strong> locations:</strong>
              <EditableField
                value={activity.locations}
                onSave={(newlocations) => updatedActivity({ ...activity, locations: parseFloat(newlocations) })}
                inputType="text" // Ensure it's a number input
              />
            </div>
            <div>
              <strong> category:</strong>
              <EditableField
                value={activity.category}
                onSave={(newcategory) => updatedActivity({ ...activity, category: parseFloat(newcategory) })}
                inputType="text" // Ensure it's a number input
              />
            </div>           <div>
              <strong> Price:</strong>
              <EditableField
                value={activity.price}
                onSave={(newPrice) => updatedActivity({ ...activity, price: parseFloat(newPrice) })}
                inputType="number" // Ensure it's a number input
              />
            </div>            <div>
              <strong>bookingOpen:</strong>
              <EditableField
                value={activity.bookingOpen}
                onSave={(newbookingOpen) => updatedActivity({ ...activity, price: parseFloat(newbookingOpen) })}
                inputType="text" // Ensure it's a number input
              />
            </div>            <div>
              <strong> specialDiscounts:</strong>
              <EditableField
                value={activity.specialDiscounts}
                onSave={(newspecialDiscounts) => updatedActivity({ ...activity, price: parseFloat(newspecialDiscounts) })}
                inputType="text" // Ensure it's a number input
              />
            
            </div>
  
            {/* <div>
              <strong>Accessibility:</strong>
              <EditableField
                value={itinerary.accessibility}
                onSave={(newAccessibility) => updateItinerary({ ...itinerary, accessibility: newAccessibility })}
                inputType="select" // Specify it's a dropdown list
                options={["wheelchair accessible", "not accessible", "limited accessibility"]} // Pass enum values
              />
            </div> */}
  
            {/* <div>
              <strong><FontAwesomeIcon icon={faHotel} /> Pickup Location:</strong>
              <EditableField
                value={itinerary.pickupLocation}
                onSave={(newPickupLocation) => updateItinerary({
                  ...itinerary, pickupLocation: newPickupLocation
                })}
              />
            </div> */}
  
            {/* <div>
              <strong><FontAwesomeIcon icon={faCar} /> Dropoff Location:</strong>
              <EditableField
                value={itinerary.dropoffLocation}
                onSave={(newDropoffLocation) => updateItinerary({
                  ...itinerary, dropoffLocation: newDropoffLocation
                })}
              />
            </div> */}
            <div className="tags-container">
        <strong><FontAwesomeIcon icon={faTags} /> Tags:</strong>
            {console.log("Those are tags :   " + tags)}
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag._id}
                type="button"
                className={`tag-btn ${activity.tags.includes(tag._id) ? 'selected' : ''}`}
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
    {activity.comments && activity.ratings && (() => {
      const combinedReviews = [];
      
      // Loop over the comments array
      for (let i = 0; i < visibleReviews; i++) {
        const comment = activity.comments[i];
        
        // Find the matching rating for the current comment
        const matchingRating = activity.ratings.find(
          rating => rating.tourist._id === comment.tourist._id
        );
        
        // If a matching rating is found, push the combined data to the array
        if (matchingRating) {
          combinedReviews.push(
            <div key={i} className="review-box">
              <div className="review-header">
                <span className="reviewer-name">{comment.tourist.username}</span>
                {console.log("matching.rating : " , matchingRating.rating)}
                <div className="review-rating">{renderStars(matchingRating.rating)}</div>
              </div>
              
              <p className="review-text">{comment.text}</p>
              
              
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

export default Updateavtivityadvertiser;