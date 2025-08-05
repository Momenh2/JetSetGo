import ActivityFilter from "../components/ActivityFilter";
import Filter from "./Tourist/savedItineraries";
import IT from "../assets/images/activities.jpg";


import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
//import "./Myitinerariespage.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt,faHeart } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Components
//import ItineraryDetails from "../components/ItineraryDetails";
//import ItineraryFilter from "../components/ItineraryFilter"; // Import the filter component
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
const Activities2 = () => {
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingTags, setLoadingTags] = useState(true);
  const [category, setCategory] = useState([])
  const [tags, setTags] = useState([])
  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [savedItineraries, setSavedItineraries] = React.useState([]);

  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [actionType, setActionType] = useState(''); // 'save' or 'delete'

  const [savedid, setSavedId] = useState(null); // Store the ID of the itinerary to delete
  const [deletedid, setDeleteId] = useState(null); // Store the ID of the itinerary to delete
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/tourist/getUpcomingActivities");
        const data = await response.json();
        setActivities(data);
        setFilteredActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const filtered = activities.filter((activity) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Check if the title matches
      const titleMatch = activity.title?.toLowerCase().includes(searchLower);
  
      // Check if any category name matches
      const categoryMatch = activity.category && category.some((cat) => 
        activity.category.includes(cat._id) && cat.name.toLowerCase().includes(searchLower)
      );
  
      // Check if any tag name matches
      const tagMatch = activity.tags && activity.tags.some((tagId) => {
        const tag = tags.find((t) => t._id === tagId);
        return tag && tag.tag_name.toLowerCase().includes(searchLower);
      });
  
      return titleMatch || categoryMatch || tagMatch;
    });
  
    setFilteredActivities(filtered);
  }, [searchTerm, activities, category, tags]);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.star, 0);
    return (total / ratings.length).toFixed(1);
  };

  const renderStars = (rating) => {
    rating = calculateAverageRating(rating);
    if (!rating) return <p className="no-ratings">No ratings yet</p>;
    const stars = Array.from({ length: 5 }, (_, index) => {
      const filledValue = index + 1;
      if (filledValue <= Math.floor(rating)) return "full";
      if (filledValue - 0.5 === rating) return "half";
      return "empty";
    })};

    useEffect(() => {
        const fetchCategory = async () => {
          try {
            const response = await fetch('/api/admin/category');
            const data = await response.json();
            setCategory(data); 
          } catch (error) {
            console.error('Error fetching tags:', error);
          } finally {
            setLoadingTags(false);
          }
        };
        fetchCategory();
      }, []); 
      
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tourist/getTags');
        const data = await response.json();
        setTags(data); 
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, []); 



  // Function to handle the delete confirmation
const handleSaveClick = (savedid) => {
    setSavedId(savedid); // Store the ID of the item to be deleted
    console.log("the acticity:", savedid);
    console.log("the tourist:", id);

    setActionType('save'); // Set action type to 'save'
    setShowModal(true); // Show the confirmation modal
  };

  const handleDeleteClick = (deletedid) => {
    setDeleteId(deletedid);
    setActionType('delete'); // Set action type to 'delete'
    setShowModal(true); // Show modal for deletion
  };

  // Function to confirm deletion
  const confirmSave = () => {
    if (savedid && id) {
      console.log("This is the id of the itirnary to be saved" + savedid)
      fetch(`/api/tourist/addBookMarkedActivities/${savedid}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ touristId:id }), // Send the touristId in the body

      })
        .then((response) => {
          if (response.ok) {
            setSavedId(null);
            setShowModal(false); // Close the modal
            alert('Activity saved successfully');
          } else {
            alert('Failed to save Activity');
          }
        })
        .then((data) => {
            if (data && data.error) {
              alert('Failed to save Activity: ' + data.error); // Display error from server
            
          console.log("Error save the Activity:", savedid);
          console.log("Error save the Activity:", id);
            }

          })
        .catch((error) => {
          console.log("Error save the Activity:", savedid);
          console.log("Error save the Activity:", id);
          console.error("Error save the Activity:", error);
          alert('Error save itinerary');
        });
    }
  };

 

 // Function to confirm deletion
 const removeSave = () => {
    if (deletedid) {
      console.log("This is the id of the itirnary to be deleted" + deletedid)
      fetch(`/api/tourist/remove-bookmarkActivities/${id}/${deletedid}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            setSavedItineraries((prev) => prev.filter((item) => item._id !== deletedid));
            setShowModal(false); // Close the modal
            alert('Activity removed successfully');
          } else {
            alert('Failed to save Activity');
          }
        })
        .catch((error) => {
          console.error("Error save the Activity:", error);
          alert('Error save Activity');
        });
    }
  };
  const handleFilter = (filteredData) => {
    setFilteredActivities(filteredData);
  };





  useEffect(() => {
    const fetchBookmarkedItineraries = async () => {
      try {
        // Replace with your API endpoint
        const response = await axios.get(`/api/tourist/savedBookMarkedActivities/${id}`);
        
        setSavedItineraries(response.data.activities);
        console.log(response.data);
        //setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching the bookmarked itineraries.');
        //setLoading(false);
      }
    };

    fetchBookmarkedItineraries();
  }, [id]); // Re-fetch if touristId changes


 // Function to cancel deletion
 const cancelSave = () => {
    
  setShowModal(false); // Close the modal without deleting
  setSavedId(null); // Clear the stored ID
  setDeleteId(null); // Optional: Reset the deletedid state if needed
  };


  return (
    <div className="activities-page" style={{ display: "flex", position: "relative" }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", width: "100%" }}>
        <h1 className="page-title">Explore Activities</h1>

       {/* Search Bar */}
       <div className="search-bar">
        <input
          type="text"
          placeholder="Search for Activities"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {(<Filter isFilterOpen={isFilterOpen2} toggleFilter={setIsFilterOpen2}>
            <div className={`filter-container ${isFilterOpen2 ? 'open' : ''}`}>
              <div className="filter-header">
                <h2>Saved Activities</h2>
                <button className="close-btn" onClick={() => setIsFilterOpen2(false)}>
                  &times;
                </button>
              </div>
              <div className="filter-content">
                
                  { savedItineraries.map((itinerary) => (
                    <div key={itinerary._id} className="wishlist-item">
                      {console.log( itinerary.title)}
                      <img src={IT} alt={itinerary.title} className="wishlist-item-image" />
                      {/* <img
                        src={`http://localhost:8000/${itinerary.itinerary.picture}`}  // Add a fallback image
                        alt={product.product.name}
                        className="wishlist-item-image"
                      /> */}
                      <div className="card-price">
                    <strong>$</strong>
                    {itinerary.price || "N/A"}
                  </div>
                      <div className="wishlist-item-info">
                        <h4>{itinerary.title}</h4>
                        <button
                          className="remove-btn"
                          onClick={() => {
                            // Set the deleted itinerary's ID and open the modal
                            setDeleteId(itinerary._id);
                            setShowModal(true);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                 
                  
                
              </div>
            </div>
          </Filter>)}

                      {/* Modal for Deletion Confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
          <h2>{actionType === 'save' ? 'Confirm Save' : 'Confirm Delete'}</h2>
          <p>Are you sure you want to {actionType === 'save' ? 'save' : 'delete'} this Activity?</p>
            <div className="modal-actions">
            <button onClick={actionType === 'save' ? confirmSave : removeSave}>
                {actionType === 'save' ? 'Save' : 'Delete'}
              </button>
              <button onClick={cancelSave}>Cancel</button>
            </div>
          </div>
        </div>
      )}





        {/* <span className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </span> */}
      </div>

      {/* Itineraries Section */}
      <div className="tags">
        {filteredActivities.map((activity) => (
          <div className="itinerary-card" key={activity._id}>
            <div className="card-header">
              <img src={IT} alt={activity.title} className="card-image" />
              <button className="card-action" onClick={() => handleSaveClick(activity._id)}>
              <FontAwesomeIcon
                  icon={ faHeart}
                />              </button>  
            </div>
            <div className="card-content">
              <div className="card-title">{activity.title || "Untitled activity"}</div>
              <div className="card-rating">
                <div className="rating">{renderStars(activity.ratings)}</div>
                ★ {calculateAverageRating(activity.ratings) > 0
                  ? `${calculateAverageRating(activity.ratings)} (${activity.ratings.length})`
                  : "0 (0)"}
              </div>
              <div className="card-description">
                {activity.description || "No description available."}
              </div>
              <div className="card-tags">
                <strong>🏷️ Tags: </strong>
                {loadingTags ? (
                  <span>Loading tags...</span>
                ) : (
                  activity.tags && Array.isArray(activity.tags) && activity.tags.length > 0 ? (
                    activity.tags
                      .map((tagId) => {
                        const tagItem = tags.find((t) => t._id === tagId);
                        return tagItem ? tagItem.tag_name : '';
                      })
                      .join(', ') || "No tags available"
                  ) : (
                    <span>No tags available</span>
                  )
                )}
              </div>
              <div className="card-price">
                <strong>$</strong>
                {activity.price || "N/A"}
              </div>
              <div className="card-tags">
                <strong>🏷️ Category: </strong>
                {loadingTags ? (
                  <span>Loading tags...</span>
                ) : (
                  activity.category ? (
                    category
                      .filter(t => activity.category.includes(t._id))
                      .map(t => t.name)
                      .join(', ') || "No tags available"
                  ) : (
                    <span>No tags available</span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
          </div>
        </div>

{/* Sidebar */}
<div
  className={`sidebar ${sidebarOpen ? "open" : ""}`}
  style={{
    position: "fixed",
    right: sidebarOpen ? "0" : "-300px",
    width: "300px",
    height: "100%",
    backgroundColor: "#f8f9fa",
    boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
    padding: "20px",
    transition: "right 0.3s ease-in-out",
    zIndex: 1000,
  }}
>
  <button
    onClick={() => setSidebarOpen(false)}
    style={{
      display: "block",
      margin: "0 auto 20px auto",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Close
  </button>
  <ActivityFilter onFilter={handleFilter} />
</div>

{/* Toggle Sidebar Button */}
{!sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(true)}
    style={{
      position: "fixed",
      top: "60px",
      right: "10px",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      zIndex: 1001,
    }}
  >
    Open Filter
  </button>
)}
    </div>
  );
};

export default Activities2;