import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import IT from "../../assets/images/ItPic.jpg";
import styles from  "./Myitinerariespage.module.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from "@fortawesome/free-solid-svg-icons";


import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const MyItinerariesPage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true); 
  const [tags, setTags] = useState([]); 
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [deletingId, setDeletingId] = useState(null); // Store the ID of the itinerary to delete
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch(`/api/tour-guides/showAll?guideId=${id}`);
        const data = await response.json();
        setItineraries(data);
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

  const filteredItineraries = itineraries.filter((itinerary) =>
    itinerary.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle the delete confirmation
  const handleDeleteClick = (id) => {
    setDeletingId(id); // Store the ID of the item to be deleted
    setShowModal(true); // Show the confirmation modal
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    if (deletingId) {
      console.log("This is the id of the itirnary to be deleted" + deletingId)
      fetch(`/api/tour-guides/deleteItinerary/${deletingId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            setItineraries((prev) => prev.filter((item) => item._id !== deletingId));
            setShowModal(false); // Close the modal
            alert('Itinerary deleted successfully');
          } else {
            alert('Failed to delete itinerary');
          }
        })
        .catch((error) => {
          console.error("Error deleting the itinerary:", error);
          alert('Error deleting itinerary');
        });
    }
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setShowModal(false); // Close the modal without deleting
    setDeletingId(null); // Clear the stored ID
  };

  return (
    <div className={styles.home}>
      <h1 className="page-title">My Itineraries</h1>

      {/* Search Bar */}
      <div className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="Search for itineraries"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className={styles["search-icon"]}>
          <i className="fas fa-search"></i>
        </span>
        <button className={styles.addIti} onClick={() => navigate(`/Tourguide/${id}/tour-guide/itineraryAdd/${id}`)}>
          <FontAwesomeIcon icon={faPlus} style={{ height: '18px', width: '18px' }} />
        </button>
      </div>

      {/* Modal for Deletion Confirmation */}
      {showModal && (
        <div className={styles["modal-overlay"]} onClick={cancelDelete}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this itinerary?</p>
            <div className={styles["modal-actions"]}>
              <button onClick={confirmDelete}>Delete</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Itineraries Section */}
      <div className={styles.tags}>
        {filteredItineraries.map((itinerary) => (
          <div className={styles["itinerary-card"]} key={itinerary._id}>
            <div className={styles["card-header"]}>
              <img src={IT} alt={itinerary.title} className={styles["card-image"]} />
              <button className={styles["card-action"]} onClick={() => handleDeleteClick(itinerary._id)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
            <div className={styles["card-content"]}>
            <div className={styles["card-tags"]}>
  <strong>
    <FontAwesomeIcon icon={faTags} /> :
  </strong>
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

              <div className={styles["card-title"]}>{itinerary.title || "Untitled Itinerary"}</div>
              <div className={styles["card-rating"]}>
                <div className={styles["rating"]}>{renderStars(itinerary.ratings)}</div>
                ★ {calculateAverageRating(itinerary.ratings) > 0
                  ? `${calculateAverageRating(itinerary.ratings)} (${itinerary.ratings.length})`
                  : "0 (0)"}
              </div>
              <div className={styles["card-description"]}>
                {itinerary.description || "No description available."}
              </div>
             
              <div className={styles["card-price"]}>
                <strong>$</strong>
                {itinerary.price || "N/A"}
              </div>
            </div>
            <Link to={`/Tourguide/${id}/ViewItineraryEdit/${itinerary._id}`} className="view-more-btn">
              View More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyItinerariesPage;
