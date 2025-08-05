import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

async function getUsernameById(id) {
    try {
        const response = await fetch("http://localhost:8000/api/tourist/getTouristUsername", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ touristId: id }),
        });

        const data = await response.json();
        console.log("username:?",data);
        return data?.username || "Anonymous"; // Default to "Anonymous" if no username found
    } catch (error) {
        console.error("Error fetching username:", error);
        return "Anonymous"; // Handle errors gracefully
    }
}

function getTimeAgo(createdAt) {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

const ITeList2 = () => {
    const [activity, setActivity] = useState(null);
    const [ratings, setRatings] = useState({});
    const [comment, setComment] = useState('');
    const [usernames, setUsernames] = useState({});
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const { ItineraryID: activityId } = useParams();
    console.log(activityId);
    const touristId = id;

    useEffect(() => {
        const fetchBookedActivities = async () => {
            try {
                const response = await axios.get(`/api/tour-guides/getSingleItinerary/${activityId}`);
                const fetchedActivity = response.data;
                setActivity(fetchedActivity);

                let rating = 0;
                try {
                    const ratingRes = await axios.get(`http://localhost:8000/api/tourist/get_rating/${touristId}/${fetchedActivity._id}`);
                    rating = ratingRes.data.rating || 0;
                    console.log(rating);
                } catch (error) {
                    console.error("Error fetching rating for activity:", error);
                }

                setRatings({ [fetchedActivity._id]: rating });

                // Fetch usernames for each comment
                const usernamePromises = fetchedActivity.comments.map(comment => getUsernameById(comment.postedby));
                const usernames = await Promise.all(usernamePromises);
                const usernamesMap = fetchedActivity.comments.reduce((map, comment, index) => {
                    map[comment.postedby] = usernames[index];
                    return map;
                }, {});
                console.log(usernamesMap);
                setUsernames(usernamesMap);
            } catch (error) {
                console.error('Error fetching booked activities or ratings:', error);
            }
        };

        fetchBookedActivities();
    }, [touristId, activityId]);

    const handleRate = async (activityId, star) => {
        try {
            console.log(touristId,star,activityId);
            const response = await axios.post('http://localhost:8000/api/tourist/addItineraryRating', {
                touristId: touristId,
                rating:star,
                itineraryId:activityId
            });
            console.log(response.data);
            const updatedRating = response.data.totalrating;
            setActivity(prevActivity => ({
                ...prevActivity,
                totalrating: updatedRating
            }));
            setRatings({ ...ratings, [activityId]: star });
        } catch (error) {
            console.error('Error rating activity:', error);
        }
    };

    const handleComment = async () => {
        if (!comment.trim()) return;
        try {
            const response = await axios.post('http://localhost:8000/api/tourist/addItineraryComment', {
                itineraryId: activity._id, // Map the activity's ID as the expected itineraryId
                touristId: touristId,      // Send the touristId directly
                comment: comment           // Send the comment text directly
              });              
            setActivity(response.data);
            setComment('');
        } catch (error) {
            console.error('Error adding comment to activity:', error);
        }
    };

    

    if (!activity) return <div>Loading...</div>;

    return (
        <div className="activity-list">
            <div className="rating-section">
            
                <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <FaStar
                            key={star}
                            className={`star ${star <= (ratings[activity._id] || 0) ? 'filled' : ''}`}
                            onClick={() => handleRate(activity._id, star)}
                        />
                    ))}
                </div>
            </div>
            <div className="comment-section">
                <h3>Comments</h3>
                <div className="comment-form">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a public comment..."
                        className="comment-input"
                    />
                    <button onClick={handleComment} className="comment-button">
                        Comment
                    </button>
                </div>
                <div className="comments-list">
                    {activity.comments?.map((c, idx) => (
                        <div key={idx} className="comment">
                            <div className="comment-avatar">
                                {c.postedby && c.postedby.name ? c.postedby.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="comment-author">{c.postedby ? usernames[c.postedby] : 'Anonymous'}</span>
                                    <span className="comment-date">{getTimeAgo(c.createdAt)}</span>
                                </div>
                                <p className="comment-text">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                /* Separator Line */
                .separator-line {
                    height: 2px;
                    background-color: #ddd;
                    width: 100%;
                    margin-bottom: 20px;
                }
    
                /* Main Activity List Container */
                .activity-list {
                    width: 100%;
                    max-width: auto;
                    margin: 0 auto;
                    padding: 20px;
                    // border-top: 1px solid #ddd;
                }
    
                .rating-section, .comment-section {
                    margin-bottom: 30px;
                    // border-top: 1px solid #ddd;
                }
    
                h3 {
                    color: #030303;
                    font-size: 16px;
                    margin-bottom: 16px;
                }
    
                .stars {
                    display: flex;
                    justify-content: flex-start;
                }
    
                .star {
                    font-size: 32px;
                    color: #e0e0e0;
                    cursor: pointer;
                    transition: color 0.2s ease-in-out;
                    margin-right: 8px;
                }
    
                .star:hover, .star.filled {
                    color: #ffd700;
                }
    
                .comment-form {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    margin-bottom: 20px;
                }
    
                .comment-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    resize: vertical;
                    min-height: 80px;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
    
                .comment-button {
                    padding: 10px 16px;
                    background-color: #065fd4;
                    color: white;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    text-transform: uppercase;
                }
    
                .comment-button:hover {
                    background-color: #1a73e8;
                }
                
                .comments-list {
                    margin-top: 20px;
                }
    
                .comment {
                    display: flex;
                    margin-bottom: 20px;
                }
    
                .comment-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #065fd4;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-right: 16px;
                }
    
                .comment-content {
                    flex: 1;
                }
    
                .comment-header {
                    margin-bottom: 4px;
                }
    
                .comment-author {
                    font-weight: 500;
                    margin-right: 8px;
                }
    
                .comment-date {
                    color: #606060;
                    font-size: 12px;
                }
    
                .comment-text {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.4;
                }
    
                .delete-button {
                    background: none;
                    border: none;
                    color: #606060;
                    cursor: pointer;
                    font-size: 12px;
                    margin-top: 8px;
                    padding: 0;
                    text-decoration: underline;
                }
    
                .delete-button:hover {
                    color: #343434;
                }
            `}</style>
        </div>
    );
    
};

export default ITeList2;