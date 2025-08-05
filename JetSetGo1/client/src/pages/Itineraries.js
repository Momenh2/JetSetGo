// Itineraries.js
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import IT from "../assets/images/activities.jpg";
//import "./Myitinerariespage.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt,faHeart } from '@fortawesome/free-solid-svg-icons';
import Filter from "./Tourist/savedItineraries";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

const Itineraries2 = () => {
    const location = useLocation(); // Access the location object
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    console.log("id: ITE", id);
    const navigate = useNavigate();

    const modelName = decodedToken.userType;
    console.log("modelName: ite", modelName);

    const [upcomingItineraries, setUpcomingItineraries] = useState();
    const [filteredItinerary, setFilteredItinerary] = useState([]); // State for filtered itineraries
    const [sortOrder, setSortOrder] = useState(''); // State for sorting order
    const [loadingTags, setLoadingTags] = useState(true); 
    const [tags, setTags] = useState([]); 
    const [error, setError] = useState('');
    const [isFilterOpen2, setIsFilterOpen2] = useState(false);

    const [isFilterOpen1, setIsFilterOpen1] = useState(false);
    const [savedItineraries, setSavedItineraries] = React.useState([]);
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [actionType, setActionType] = useState(''); // 'save' or 'delete'

    const [savedid, setSavedId] = useState(null); // Store the ID of the itinerary to delete
    const [deletedid, setDeleteId] = useState(null); // Store the ID of the itinerary to delete

    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    useEffect(() => {
        const fetchItineraries = async () => {
          try {
            const response = await fetch('/api/guests/getUpcomingItineraries');
            const data = await response.json();
            setUpcomingItineraries(data);
          } catch (error) {
            setError('You don’t have itineraries yet.');
          }
        };
        fetchItineraries();
      }, [id]);

      useEffect(() => {
        const fetchTags = async () => {
          try {
            const response = await fetch('/api/admin/tag');
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

    //   const itinerariesToShow = upcomingItineraries.filter((itinerary) =>
    //     itinerary.title.toLowerCase().includes(searchTerm.toLowerCase())
    //   );

  // When search term changes, filter itineraries
  // useEffect(() => {
  //   if (searchTerm) {
  //     const filtered = savedItineraries.filter((itinerary) =>
  //       itinerary.title.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredItinerary(filtered);
  //   } else {
  //     // If no search term, show all itineraries
  //     setFilteredItinerary(savedItineraries);
  //   }
  // }, [searchTerm, savedItineraries]);




    // Sorting functions
    const sortByPrice = () => {
        const sorted = [...(filteredItinerary.length > 0 ? filteredItinerary : upcomingItineraries)].sort((a, b) => a.price - b.price);
        setFilteredItinerary(sorted);
        setSortOrder('price'); // Update sort order
    };

    const sortByRating = () => {
        const sorted = [...(filteredItinerary.length > 0 ? filteredItinerary : upcomingItineraries)].sort((a, b) => a.rating - b.rating);
        setFilteredItinerary(sorted);
        setSortOrder('rating'); // Update sort order
    };

   // const itinerariesToShow = filteredItinerary.length > 0 ? filteredItinerary : upcomingItineraries;
  

   

   const itinerariesToShow = (upcomingItineraries || []).filter((itinerary) => {
    const searchQuery = searchTerm.toLowerCase();
  
    // Check if the itinerary title matches the search query
    const matchesTitle = itinerary.title.toLowerCase().includes(searchQuery);
  
    // Check if any of the itinerary's tags match the search query
    const matchesTags = itinerary.tags.some(tagId => {
      const tag = tags.find(t => t._id === tagId);  // Assuming `tags` is an array with tag objects
      return tag ? tag.tag_name.toLowerCase().includes(searchQuery) : false;
    });
  
    // Return true if either title or tags match the search term
    return matchesTitle || matchesTags;
  });
  
// Function to handle the delete confirmation
const handleSaveClick = (savedid) => {
    setSavedId(savedid); // Store the ID of the item to be deleted
    console.log("the itinerary:", savedid);
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
      fetch(`/api/tourist/addBookMarked/${savedid}`, {
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
            alert('Itinerary saved successfully');
          } else {
            alert('Failed to save itinerary');
          }
        })
        .then((data) => {
            if (data && data.error) {
              alert('Failed to save itinerary: ' + data.error); // Display error from server
            
          console.log("Error save the itinerary:", savedid);
          console.log("Error save the itinerary:", id);
            }

          })
        .catch((error) => {
          console.log("Error save the itinerary:", savedid);
          console.log("Error save the itinerary:", id);
          console.error("Error save the itinerary:", error);
          alert('Error save itinerary');
        });
    }
  };

 

 // Function to confirm deletion
 const removeSave = () => {
    if (deletedid) {
      console.log("This is the id of the itirnary to be deleted" + deletedid)
      fetch(`/api/tourist/remove-bookmark/${id}/${deletedid}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            setSavedItineraries((prev) => prev.filter((item) => item._id !== deletedid));
            setShowModal(false); // Close the modal
            alert('Itinerary removed successfully');
          } else {
            alert('Failed to save itinerary');
          }
        })
        .catch((error) => {
          console.error("Error save the itinerary:", error);
          alert('Error save itinerary');
        });
    }
  };






  useEffect(() => {
    const fetchBookmarkedItineraries = async () => {
      try {
        // Replace with your API endpoint
        const response = await axios.get(`/api/tourist/savedBookMarked/${id}`);
        
        setSavedItineraries(response.data.itineraries);
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
        <div className="home">
          <h1 className="page-title">All Itineraries</h1>

      
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for itineraries"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             {(<Filter isFilterOpen={isFilterOpen2} toggleFilter={setIsFilterOpen2}>
            <div className={`filter-container ${isFilterOpen2 ? 'open' : ''}`}>
              <div className="filter-header">
                <h2>Saved Itineraries</h2>
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

          <Filter isFilterOpen={isFilterOpen1} toggleFilter={setIsFilterOpen1}>
  <div className={`filter-container ${isFilterOpen1 ? "open" : ""}`}>
    <div className="filter-header">
      <h2>SORT</h2>
      <button className="close-btn" onClick={() => setIsFilterOpen1(false)}>
        &times;
      </button>
    </div>
    <div className="filter-content">
      {/* Buttons to trigger sorting */}
      <button onClick={sortByPrice}>Sort by Price</button>
      <button onClick={sortByRating}>Sort by Rating</button>
    </div>
  </div>
</Filter>
       




          </div>


          {/* Modal for Deletion Confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
          <h2>{actionType === 'save' ? 'Confirm Save' : 'Confirm Delete'}</h2>
          <p>Are you sure you want to {actionType === 'save' ? 'save' : 'delete'} this itinerary?</p>
            <div className="modal-actions">
            <button onClick={actionType === 'save' ? confirmSave : removeSave}>
                {actionType === 'save' ? 'Save' : 'Delete'}
              </button>
              <button onClick={cancelSave}>Cancel</button>
            </div>
          </div>
        </div>
      )}






      
          <div className="tags">
            {itinerariesToShow && itinerariesToShow.length === 0 && <p>No results found</p>}
            {itinerariesToShow && itinerariesToShow.map((itinerary) => (
              <div className="itinerary-card" key={itinerary._id}>
                <div className="card-header">
                  <img src={IT} alt={itinerary.title} className="card-image" />
                  <button className="card-action" onClick={() => handleSaveClick(itinerary._id)}>
                  <FontAwesomeIcon
                  icon={ faHeart}
                />
              </button>  
              
                </div>
                <div className="card-content">
                  <div className="card-title">{itinerary.title || "Untitled Itinerary"}</div>
                  <div className="card-rating">
                    <div className="rating">{renderStars(itinerary.ratings)}</div>
                    ★ {calculateAverageRating(itinerary.ratings) > 0
                      ? `${calculateAverageRating(itinerary.ratings)} (${itinerary.ratings.length})`
                      : "0 (0)"}
                  </div>
                  <div className="card-description">
                    {itinerary.description || "No description available."}
                  </div>
                  <div className="card-tags">
                    <strong>🏷️ Tags: </strong>
                    {loadingTags ? (
                      <span>Loading tags...</span>
                    ) : (
                      itinerary.tags && Array.isArray(itinerary.tags) && itinerary.tags.length > 0 ? (
                        itinerary.tags
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
                    {itinerary.price || "N/A"}
                  </div>
                </div>
      
                {/* Conditional Link rendering based on the user role */}
                {/* Conditional Link rendering based on the user role */}
                {/* Conditional Link rendering based on the user role */}
                {itinerariesToShow && itinerariesToShow.length === 0 && <p>No results found</p>}
                {
                    <Link to={`/tourist/itinerary/${itinerary._id}/tourist/${id}`} className="view-more-btn">
                        View More
                    </Link>
                }
                {!id &&
                    <Link to={`/guest/itinerary/${itinerary._id}`} className="view-more-btn">
                        View More
                    </Link>
                }
              </div>
            ))}
          </div>
         

        </div>


      );
      
}

export default Itineraries2;