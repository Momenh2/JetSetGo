import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCogs, faMapMarkerAlt, faClock, faGlobe, faHotel, faCar, faTag, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import IT from "../../src/assets/images/ItPic.jpg";
import "./ViewItineraryDetailes.css";
import RatingVisualization from './activityListRate';
import LoadingScreen from "./loading";
import ActivityList2 from "./ActivityList-Rate-Comment2";

function TagsList({ tagIds }) {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                if (tagIds && tagIds.length > 0) {
                    const fetchedTags = await Promise.all(
                        tagIds.map(async (id) => {
                            const response = await fetch(`/api/tourist/tagName/${id}`);
                            if (!response.ok) {
                                throw new Error(`Failed to fetch tag with ID: ${id}`);
                            }
                            const data = await response.json();
                            return data.tag_name; // Assuming the API returns `tag_name`
                        })
                    );
                    setTags(fetchedTags);
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, [tagIds]);

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2px',
            marginTop: '4px',
        }}>
            {tags.length > 0 ? (
                tags.map((tag, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 'auto',
                            height: 'auto',
                            background: '#007BFF', // Blue color
                            color: '#222',
                            fontSize: '1.2em',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            transform: 'skewX(-20deg)', // Creates parallelogram effect
                            border: '1px solid #0056b3', // Darker blue border for contrast
                            padding: '0 10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <span style={{
                            transform: 'skewX(20deg)', // Corrects text skew to make it upright
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                        }}>
                            {tag}
                        </span>
                    </div>
                ))
            ) : (
                <p>Loading tags...</p>
            )}
        </div>
    );
}


function CategoryInfo({ categoryId }) {
    const [categoryName, setCategoryName] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                if (categoryId) {
                    const response = await fetch(`/api/tourist/categoryName/${categoryId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch category data');
                    }

                    const data = await response.json();
                    setCategoryName(data.name); // Assuming the API returns a `name` field
                }
            } catch (error) {
                console.error('Error fetching category:', error);
                setCategoryName('Unknown Category');
            }
        };

        fetchCategory();
    }, [categoryId]);

    return (
        <div className="info-item">
            <strong><FontAwesomeIcon icon={faGlobe} /> Category:</strong>
            <p>{categoryName || 'Loading...'}</p>
        </div>
    );
}

function formatDate(dateString) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC" // Adjust based on your time zone preference
    };

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
}

// // Example usage
// const formattedDate = formatDate("2024-08-15T10:00:00.000Z");
// console.log(formattedDate); // Output: "August 15, 2024, 10:00 AM"

function ViewActivity() {
    const location = useLocation();
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const { ItineraryID: _id } = useParams(); // Get _id from URL parameters
    console.log(_id);
    const itid = _id;

    const [activity, setActivity] = useState(null); // Updated to hold the Activity data
    const [availableDates, setAvailableDates] = useState(null);

    const fetchActivity = async () => {
        try {
            if (_id) {
                const response = await fetch(`/api/tourist/getSingleActivity/${_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch activity details");
                }

                const data = await response.json(); // Parse the JSON response
                setActivity(data); // Set activity data
            }
        } catch (error) {
            console.error("Error fetching activity details:", error);
        }
    };

    useEffect(() => {
        fetchActivity();

        const interval = setInterval(() => {
            fetchActivity();
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [_id]);

    if (!activity) {
        return <LoadingScreen />;
    }

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((acc, rating) => acc + rating.star, 0);
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

    return (
        <div className="itinerary-view-container">
            <div className="container2">
                <div className="title"></div>
                <div className="detail">
                    <div className="imageAndbutton">
                        <div className="image image-wrapper">
                            <img src={IT} alt={activity.title} className="product-image" />
                        </div>
                        {activity.ratings.length > 0 ? (
                            <RatingVisualization ratings={activity.ratings} />
                        ) : (
                            <div className="bg-zinc-900 p-6 rounded-lg max-w-md text-center">
                                <p className="text-xl font-bold text-white mb-2">No Ratings Yet</p>
                                <p className="text-sm text-zinc-400">Be the first to rate!</p>
                            </div>
                        )}
                    </div>
                    <div className='content'>
                        <h1 className="name" style={{ textTransform: "uppercase" }}>{activity.title}</h1>
                        <p
                            className="description22"
                            style={{
                                padding: "0px",
                                margin: "0px",
                                boxSizing: "border-box",
                                listStyle: "none",
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 50,
                                marginBottom: "30px",
                                marginTop: "30px",
                                bottom: "0px",
                            }}
                        >
                            {activity.description}
                        </p>

                        {/* New wrapper for price and status */}
                        <div style={{
                            marginTop: "auto", /* Push this div to the bottom in a flex container */
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            paddingTop: "20px",
                            borderTop: "1px solid #ddd", /* Optional separator line */
                        }}>
                            <div className="price" style={{ display: "flex", alignItems: "center" }}>
                                <i className="fa-solid fa-dollar-sign" style={{ fontWeight: "900", marginRight: "8px" }}></i>
                                {activity.price}
                            </div>

                            <p
                                className="activity-status"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "8px 12px",
                                    fontWeight: "bold",
                                    borderRadius: "4px",
                                    backgroundColor: activity.bookingOpen ? "green" : "red",
                                    color: "white"
                                }}
                            >
                                {activity.bookingOpen ? (
                                    <>
                                        <i className="fa-solid fa-check" style={{ marginRight: "8px", color: "white" }}></i>
                                        Available
                                    </>
                                ) : "Booked"}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="ItineraryContent">
                    <div className="itinerary-info-right" style={{ marginTop: '10px' }}>
                        {/* <div className="info-item">
                            <strong><FontAwesomeIcon icon={faAlignLeft} /> Comments:</strong>
                            <p>{activity.comments.map(comment => comment.text).join(', ')}</p>
                        </div> */}
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faMapMarkerAlt} /> Location:</strong>
                            <p>{activity.location}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faMapMarkerAlt} /> date:</strong>
                            <p>{formatDate(activity.date)}</p>
                        </div>
                        <div className="info-item">
                            <strong><FontAwesomeIcon icon={faClock} /> Time:</strong>
                            <p>{activity.time}</p>
                        </div>
                        <div className="info-item">
                            {/* <strong><FontAwesomeIcon icon={faGlobe} /> Category:</strong> */}
                            <CategoryInfo categoryId={activity.category} />
                        </div>
                        <div className="info-item">
                            <strong><i className="fa-solid fa-dollar-sign" style={{ fontWeight: "900", marginRight: "8px" }}></i>Price:</strong>
                            <p>{activity.price}</p>
                        </div>
                        <div className="info-item">
                            <strong><i className="fa-solid fa-dollar-sign" style={{ fontWeight: "900", marginRight: "8px" }}></i>Tags:</strong>
                            <TagsList tagIds={activity.tags} />
                        </div>
                    </div>
                </div>
                <br />
                <div className="separator-line"></div>
                <ActivityList2 activityId={itid} /></div>
            </div>
            
    );
}

export default ViewActivity;