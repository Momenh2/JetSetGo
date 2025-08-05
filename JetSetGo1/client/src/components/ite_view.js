import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';

import { faCog, faTags, faComments, faBox, faTasks, } from '@fortawesome/free-solid-svg-icons';
import { Edit } from 'react-feather'; // Importing Feather's edit icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCogs, faCalendarAlt, faMapMarkerAlt, faClock, faGlobe, faDollarSign, faWheelchair, faHotel, faCar, faTag } from '@fortawesome/free-solid-svg-icons';

import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import IT from "../../src/assets/images/ItPic.jpg";
import "./ViewItineraryDetailes.css";
import RatingVisualization from './activityListRate';
import ITeList2 from './ActivityList-Rate-Comment'


function ViewItineraryTourGuide() {
    const location = useLocation();

    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    console.log("Tour Guide ID:", id);

    const _id = useParams().ItineraryID; // Get _id from URL parameters
    console.log("Itinerary ID:", _id); // Log the itinerary ID

    const [itinerary, setItinerary] = useState(null); // Initialize itinerary as null
    const [availableDates, setAvailableDates] = useState(null);
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
                        availableDates: data.availableDates || []  // Adding availableDates field
                    });
                    // Set initial form data
                    setReviews(data.reviews || []); // Set reviews
                    setAvailableDates(data.availableDates)
                    calculateDuration(data[0].tourGuide.createdAt); // Calculate the tour guide's duration
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
        try {
            const response = await fetch(`/api/tour-guides/updateItinerary/${updatedItinerary._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItinerary),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setItineraries(itineraries.map(itinerary =>
                    itinerary._id === updatedItinerary._id ? updatedItinerary : itinerary
                ));
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
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }
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


    const visibleReviews = showAll ? reviews.length : 3; // Show 3 reviews initially
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
            `${displayYears > 0 ? `${displayYears} year${displayYears > 1 ? "s" : ""}` : ""} ${displayMonths > 0 ? `${displayMonths} month${displayMonths > 1 ? "s" : ""}` : ""
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



    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        return (total / ratings.length).toFixed(1);
    };

    const renderStars = (rating) => {
        rating = calculateAverageRating(rating);
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



    console.log("available dates :" + availableDates)

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
            <div className="container2">
                <div className="title"></div>
                <div className="detail">
                    <div className="imageAndbutton">
                        <div className="image image-wrapper">
                            <img src={IT} alt={itinerary.title} className="product-image" />

                        </div>
                        {itinerary.ratings.length > 0 ? (
                            <RatingVisualization ratings={itinerary.ratings} />
                        ) : (
                            <div className="bg-zinc-900 p-6 rounded-lg max-w-md text-center">
                                <p className="text-xl font-bold text-white mb-2">No Ratings Yet</p>
                                <p className="text-sm text-zinc-400">Be the first to rate!</p>
                            </div>
                        )}
                    </div>
                    <div className='content'>
                        <h1 className="name">{itinerary.title}</h1>
                        <div className="description">{itinerary.description}</div>
                        {/* <div className="RatingPart">
                            <div className="rating">{renderStars(itinerary.ratings)}</div>
                            {calculateAverageRating(itinerary.ratings) > 0
                                ? `${calculateAverageRating(itinerary.ratings)} (${itinerary.ratings.length})`
                                : "0 (0)"}
                        </div> */}

                        <div className="price">{itinerary.price} </div>
                        {/* <div>Inclusive of VAT</div> */}
                        <p className={`itinerary-status ${itinerary.isBooked ? "booked" : "available"}`}>
                            {itinerary.isBooked ? "Booked" : "Available"}
                        </p>
                        <div className="tour-guide-details">
                            {/* <p><strong>Tour Guide: {itinerary.tourGuide.name}</strong></p>
                            <div className="trust-bar-container">
                                <label>Trust Level:</label>
                                <div className="trust-bar">
                                    <div className="trust-fill" style={{ width: `${1}%` }}></div>
                                </div>
                            </div> */}
                        </div>

                    </div>
                </div>

                <div className="ItineraryContent">
                    <div className="itinerary-info-right" style={{ marginTop: '10px' }}>

                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faAlignLeft} /> Description:</strong>
                            <p>{itinerary.description}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faCogs} /> Activities:</strong>
                            <p>{itinerary.activities.name.join(', ')}</p>
                        </div>


                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faMapMarkerAlt} /> Locations:</strong>
                            <p>{itinerary.locations.join(', ')}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faClock} /> Timeline:</strong>
                            <p>{itinerary.timeline.join(', ')}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faGlobe} /> Language:</strong>
                            <p>{itinerary.language}</p>
                        </div>
                        <div className="info-item">
                            <strong>💲Price:</strong>
                            <p>{itinerary.price}</p>
                        </div>
                        <div className="info-item">
                            <strong>Accessibility:</strong>
                            <p>{itinerary.accessibility}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faHotel} /> Pickup Location:</strong>
                            <p>{itinerary.pickupLocation}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faCar} /> Dropoff Location:</strong>
                            <p>{itinerary.dropoffLocation}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faTag} /> Tags:</strong>
                            <p>{itinerary.tags.join(', ')}</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    {/* <h2>Reviews from Tourists</h2> */}
                    {/* <div className="reviews-grid">
                        {filteredAndSortedReviews.slice(0, visibleReviews).map((review, index) => (
                            <div key={index} className="review-box">
                                <div className="review-header">
                                    <span className="reviewer-name">{review.Tourists.username}</span>
                                    <div className="review-rating">{renderStars(review.ratings)}</div>
                                </div>
                                <p className="review-text">{review.reviews}</p>
                                {calculateDurationforReview(review.createdAt)}
                            </div>
                        ))}
                    </div> */}
                    {filteredAndSortedReviews.length > 3 && (
                        <button className="toggle-reviews-btn" onClick={toggleReviews}>
                            {showAll ? "Show Less Reviews" : "See More Reviews"}
                        </button>
                    )}
                </div>
                <ITeList2 />
            </div>

        </div>
    );
}

export default ViewItineraryTourGuide;