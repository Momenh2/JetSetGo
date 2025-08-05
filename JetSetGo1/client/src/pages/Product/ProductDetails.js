import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTags, faChartBar, faComments, faBox, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { Edit,Save } from 'react-feather';  // Importing Feather's edit icon
import { faPlus, faTrashAlt,faArchive,faEdit,faSave,faArrowLeft  } from '@fortawesome/free-solid-svg-icons';
import './details.css';
import SalesOverviewChart from "../../components/Admin/SalesOverviewChart";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import axios from 'axios'

function ViewProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("id:", id);
 

  const list = location.state || {};
  const productId = list[0];
  const userType = list[1];
  const [isEditing, setIsEditing] = useState(false); 
  const [sortOrder, setSortOrder] = React.useState("desc"); 
  const [product, setProduct] = useState(null); 
  const [seller, setSeller] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [showReviewModal, setShowReviewModal] = useState(false); 
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");
  const [showAll, setShowAll] = React.useState(false);
  const [filterRating, setFilterRating] = React.useState(0); 
  const [sellerDuration, setSellerDuration] = useState("");
  const [reviews, setReviews] = useState([]); 
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleEditImageClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value })); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log("Image selected:", file); // Debug log
    }
  };

  const handleSave = () => {
    saveUpdatedProduct(updatedProduct);
    setIsEditing(false); 
  };
  const toggleReviews = () => {
    setShowAll(!showAll);
  };
  
  const visibleReviews = showAll ? reviews.length : 2;
  const filteredAndSortedReviews = reviews
  .filter((review) => filterRating === 0 || review.ratings === filterRating) 
  .sort((a, b) =>
    sortOrder === "asc" ? a.ratings - b.ratings : b.ratings - a.ratings 
  );
  
  const calculateDuration = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    console.log("in date mod")
    const years = now.getFullYear() - createdDate.getFullYear();
    const months = now.getMonth() - createdDate.getMonth() + (years * 12);
    const displayYears = Math.floor(months / 12);
    const displayMonths = months % 12;
    setSellerDuration(
      `${displayYears > 0 ? `${displayYears} year${displayYears > 1 ? "s" : ""}` : ""} ${
        displayMonths > 0 ? `${displayMonths} month${displayMonths > 1 ? "s" : ""}` : ""
      }`.trim()
    );
  };

  const calculateDurationforReview = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    console.log("in date mod")
    const years = now.getFullYear() - createdDate.getFullYear();
    const months = now.getMonth() - createdDate.getMonth() + (years * 12);
    const displayYears = Math.floor(months / 12);
    const displayMonths = months % 12;
    return(
      <p className="review-text">{  displayMonths } and {displayYears || ""}</p>
    );
  };


  const handleUploadClick = async (productId) => {
    if (selectedImage) {
      console.log("Uploading image...");
      try {
        const formData = new FormData();
        formData.append("picture", selectedImage);  
        // Replace this with your fetch function
        const response = await axios.patch(
          `http://localhost:8000/api/${userType}/updateProductPicture/${id}/${productId}`, // this component is for 3 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        console.log("Image uploaded successfully!");
        setShowPopup(false);
        window.location.reload(); // Refresh the page
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      alert("Please select an image before uploading.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          // Fetch the product details
          const productResponse = await fetch(`/api/${userType}/getSingleProduct/${productId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!productResponse.ok) {
            throw new Error('Failed to fetch product details');
          }
          const productData = await productResponse.json(); // Parse the JSON response
          console.log('Product:', productData[0].seller);
          setProduct(productData);
          setSeller(productData[0].seller)
          calculateDuration(productData[0].seller.createdAt);
          setUpdatedProduct(productData[0]);
        }
      } catch (error) {
        console.error('Error fetching product  details:', error);
      }
    };
    fetchProduct();
  }, [productId, userType]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/${userType}/sales/${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json(); // Parse the JSON response
        setReviews(data); // Update the reviews state
        console.log(data)
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [productId]);

  if (!product) {
    return <div>Loading product...</div>;
  }
  if(!seller){
    return <div>Loading seller...</div>;
  }

  const renderStars = (rating) => {
    if (rating === null || rating === undefined) {
      return <p className="no-ratings">No ratings yet</p>;
    }
    const stars = Array.from({ length: 5 }, (_, index) => {
      const filledValue = index + 1;
      if (filledValue <= Math.floor(rating)) {
        return "full";
      } else if (filledValue - 0.5 === rating) {
        return "half";
      } else {
        return "empty";
      }
    });
    return (
      <div className="rating-stars">
        {stars.map((star, index) => (
          <span key={index} className={`star ${star}`} />
        ))}
      </div>
    );
  };

  
  const handleBuyClick = async () => {
    setShowReviewModal(true);
  }

  const handleSubmitReview = async () => {
    const price = product[0].price;
    const quantityPurchased = 4
    const touristId = id;
    const sellerId = product[0].seller;
    const ratings = newRating;
    const reviews = newReview;

    try {
      const saleResponse = await fetch(`/api/tourist/addSales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price, quantityPurchased, touristId, productId, sellerId, ratings, reviews }),
      });
      if (saleResponse.ok) {
        alert("item is bought successfully");
      }
    }
    catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    }
    setShowReviewModal(false);
  };

  const handleCancel = () => {
    setUpdatedProduct(product[0]); // Reset updated product to original values
    setIsEditing(false); // Exit editing mode
  };

  const saveUpdatedProduct = async (updatedData) => {
    try {
      
      const response = await fetch(`/api/${userType}/product/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      window.location.reload();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
     
    }
  };

  const sellerStartDate = new Date(product[0].sellerStartDate);
  const currentDate = new Date();
  const accuracyPercentage = Math.min(Math.max(product[0].itemAccuracy, 0), 100);  // Ensure accuracy is between 0 and 100
  const ratingDistribution = [0, 0, 0, 0, 0]; 
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1] += 1; 
    }
  });
  // <div className="express-shipping">
  //           <span className="express-badge">express</span>
  //           <p className="delivery-info">Get it by {product[0].deliveryDate} <br /><small>Order in {product[0].timeRemaining}</small></p>
  //         </div>

  // <div className="archive-section">
  //           <input type="checkbox" checked={product[0].archieved && false} readOnly />
  //           <label className="product-status" style={{ color: product[0].archieved && false ? 'red' : 'green' }}>
  //             <strong>Status:</strong> {product[0].archieved ? 'Archived' : 'Active'}
  //           </label>
  //         </div>
  return (
    <div className="product-view-container">
      <div className="container">
        <div className="back-link" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" />
          <span className="text">Back</span>
        </div>
        <div className="title"></div>
        <div className="detail">
          <div className='imageAndbutton'>
            <div className="image image-wrapper">
              <img
                src={`http://localhost:8000/${product[0].picture}`}
                alt={product[0].name}
                className="product-image"
              />
              { userType!="tourist" && (<button className="edit-image-btn"  onClick={handleEditImageClick} >
                <FontAwesomeIcon icon={faEdit} style={{ height: '24px', width: '24px'}} />
              </button>)}
            </div>
            <div className="buttons"> 
            {userType==="tourist" && (<button onClick={handleBuyClick}>
                Add To Cart
                {/* <span>
                  <svg
                    className=""
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"
                    />
                  </svg>
                </span> */}
              </button>)}
            </div>
          </div>
          <div className="content">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={updatedProduct.name}
                onChange={handleChange}
                className="edit-input"
              />
              <textarea
                name="description"
                value={updatedProduct.description}
                onChange={handleChange}
                className="edit-input"
              />
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleChange}
                className="edit-input"
              />
              <textarea
                name="quantityAvailable"
                value={updatedProduct.quantityAvailable}
                onChange={handleChange}
                className="edit-input"
              />
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <h1 className="name">{product[0].name}</h1>
              <div className="description">{product[0].description}</div>
              <div className="rating">{renderStars(product[0].ratings)}</div>
              <div className="price">{product[0].price} EGP</div>
              <p className={`product-quantity ${product[0].quantityAvailable > 0 ? '' : 'out-of-stock'}`}>
                {product[0].quantityAvailable > 0
                  ? `${product[0].quantityAvailable} available`
                  : 'Out of Stock'}
              </p>
            </>
          )}

            <div className="seller-details">
              <p><strong>Seller: {product[0].seller.username} </strong> </p>
              <div className="trust-bar-container">
                <label>Trust Level:</label>
                <div className="trust-bar">
                  <div
                    className="trust-fill"
                    style={{ width: `${1}%` }}
                  ></div>
                </div>
              </div>
              <p><strong>Member Since: {sellerDuration}</strong> </p>
            </div>
            {userType!=="tourist" && (<button className="edit-image-btn" onClick={isEditing ? handleSave : handleEditToggle} >
              {isEditing ? <FontAwesomeIcon icon={faSave} style={{ height: '24px', width: '24px' }} /> : <FontAwesomeIcon icon={faEdit} style={{ height: '24px', width: '24px'}} />}
            </button>)}
          </div>
        </div>
     
      <div className="reviewsList ">
        <div className="filters-section">
          <div className='ReviewsTitle'><h2>Reviews</h2></div>
          <div className='titleandFilter'>
            <label htmlFor="rating-filter">Filter by Rating:</label>
            <select
              id="rating-filter"
              className="filter-dropdown"
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>

            <label htmlFor="sort-filter">Sort by Rating:</label>
            <select
              id="sort-filter"
              className="filter-dropdown"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Highest to Lowest</option>
              <option value="asc">Lowest to Highest</option>
            </select>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Buyer Reviews</h2>
          <div className="reviews-grid">
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
          </div>
          {filteredAndSortedReviews.length > 3 && (
            <button className="toggle-reviews-btn" onClick={toggleReviews}>
              {showAll ? "Show Less Reviews" : "See More Reviews"}
            </button>
          )}
        </div>
      </div>
            <div className='salesbox'>
              {userType !== "tourist" && (
                <SalesOverviewChart userType={userType} productId={productId} />
              )}
            </div>

            {showPopup && (
              <div className="popup-overlay">
                <div className="popup-window">
                  <h2>Upload New Image</h2>
                  <input
                    type="file"
                    accept="image/*"
                     className="popup-image-preview"
                    onChange={(e) => {setSelectedImage(e.target.files[0]);
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }}
                    
                  />
                  
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Selected Preview"
                      className="popup-image-preview"
                    />
                  )}
                  <div className="popup-buttons">
                    <button
                      onClick={()=> {handleUploadClick(product[0]._id)}}
                      className="upload-popup-button"
                    >
                      Upload
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="close-popup-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
      </div>
      
      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal-content">
            <h3 className="review-modal-title">Rate & Review Product</h3>
            <label className="review-modal-label">
              Rating:
              <select
                className="review-modal-select"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </label>
            <label className="review-modal-label">
              Review:
              <textarea
                className="review-modal-textarea"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review here"
              />
            </label>
            <div className="review-modal-buttons">
              <button
                className="review-modal-button review-modal-submit"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
              <button
                className="review-modal-button review-modal-cancel"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProduct;