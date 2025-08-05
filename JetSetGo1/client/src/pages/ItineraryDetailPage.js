import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { faTags, faCalendarAlt, faMapMarkerAlt, faClock, faGlobe, faDollarSign, faHotel, faCar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import IT from "../assets/images/ItPic.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

axios.defaults.baseURL = 'http://localhost:8000'; // Backend URL

function ItineraryDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("Tour Guide ID:", id);

  const _id = useParams().itineraryId; // Get _id from URL parameters
  console.log("Itinerary ID:", _id); // Log the itinerary ID

  const [itinerary, setItinerary] = useState(null); // Initialize itinerary as null
  const [availableDates, setAvailableDates] = useState(null);
  const [tags, setTags] = useState([]); // State to store all available tags
  
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
  const [ID,setID] = useState(_id);
  
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

          setReviews(data.comments || []); // Set reviews
          setAvailableDates(data.availableDates);
        }
      } catch (error) {
        console.error("Error fetching itinerary details:", error);
      }
    };

    fetchItinerary();
  }, [_id]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/admin/tag');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Calculate the average rating for itinerary
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  // Render stars for the rating
  const renderStars = (rating) => {
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

  // If itinerary is not loaded yet
  if (!_id) {
    return <div>No itinerary data available!</div>;
  }

  if (!itinerary) {
    return <div>Loading itinerary...</div>;
  }

  const handleNavigate = () => {
    // Assuming you have the eventId and eventType in location.state
 
    const { eventId, eventType } = location.state || {};

    // Navigate to the checkout page and pass eventId and eventType as state
    console.log("eventid: ",ID )
    console.log("eventType: ",location.state)
    navigate("/tourist/CheckoutItinerary", {
      state: { eventId : ID, eventType: "itinerary" } // Event type is set to 'itinerary'
    });
  };

  return (
    <div className="itinerary-view-container">
      <div className="container">
        <div className="detail">
          <div className="imageAndbutton">
            <div className="image image-wrapper">
              <img src={IT} alt={itinerary.title} className="product-image" />
            </div>
          </div>

          <div className="content">
            <h1 className="name">{itinerary.title}</h1>
            <div className="description">{itinerary.description}</div>
            <div className="price">{itinerary.price} EGP</div>
            <div className="tags-container">
              <strong>Tags:</strong>
              {tags.map((tag, index) => (
                <span key={index} className="tag">{tag.name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="ItineraryContent">
          <div className="itinerary-info-right">
            <strong><FontAwesomeIcon icon={faCalendarAlt} /> Available Dates:</strong>
            {availableDates && availableDates.map((dateObj, index) => (
              <div key={index}>
                <strong>Date:</strong> {dateObj.date}
                <br />
                <strong>Times:</strong> {dateObj.times.join(', ')}
              </div>
              
            ))}
            <div>
              <strong><FontAwesomeIcon icon={faMapMarkerAlt} /> Locations:</strong>
                {itinerary.locations.join(', ')}
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faClock} /> Timeline:</strong>
                {itinerary.timeline.join(', ')}
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faGlobe} /> Language:</strong>
                {itinerary.language}
            </div>
  
            <div>
              <strong>💲 Price:</strong>
                {itinerary.price}
            </div>
  
            <div>
              <strong>Accessibility:</strong>
                {itinerary.accessibility}
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faHotel} /> Pickup Location:</strong>
                {itinerary.pickupLocation}
            </div>
  
            <div>
              <strong><FontAwesomeIcon icon={faCar} /> Dropoff Location:</strong>
                {itinerary.dropoffLocation}
            </div>  
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          
          {/* Render the reviews here */}
        </div>
        {/* Navigation Button at the end */}
      <button onClick={handleNavigate} className="navigate-button">
        Go to Checkout
      </button>
      </div>

      
    </div>
  );
}

export default ItineraryDetailPage;
