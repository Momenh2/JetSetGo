import React, { useState, useEffect, useContext } from 'react';
import './ProductListing.css';
import { Link } from "react-router-dom";
import Filter from '../../components/Filterbox2';
import { CurrencyContext } from '../../components/Tourist/CurrencyContext';
import { Range } from 'react-range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faArchive,faEdit,faHeart   } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode"; 
import Cookies from "js-cookie";
import {  useNavigate } from 'react-router-dom'; 


const STEP = 2;
const MIN = 0;
const MAX =1000000;

const ProductListing = ({ usertype }) => {
  
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  const modelName = decodedToken.userType;
  let userId = id
  const { currency } = useContext(CurrencyContext);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [values, setValues] = useState([100, 250]);
  
  const [showNotification, setShowNotification] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate(); 
  const [archiveMode, setArchiveMode] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const [wishlistedProducts, setWishlistedProducts] = React.useState([]);

  const formatter = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchProducts = async () => {
    try {
      if(usertype!="tourist"){
        const response = await fetch(`/api/${usertype}/Products/${userId}`);
        const data = await response.json();
        setProducts(data); 
      }
      else{
        if(usertype==="tourist"){
        const response = await fetch('/api/tourist/Products');
        const data = await response.json();
        setProducts(data);}
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProductToWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/tourist/addtoProductWishlist/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Product added to wishlist:', data);
        window.location.reload();
      } else {
        console.error('Failed to add product to wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    }
  };

  const removeProductFromWishlist = async ( productId) => {
    try {
      const response = await fetch(`/api/tourist/removeProductWishlist/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setWishlistedProducts((prev) =>
          prev.filter((product) => product._id !== productId));
        console.log('Product removed from wishlist:', data);
      } else {
        console.error('Failed to remove product from wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  const fetchWishlistProducts = async () => {
    try {
      const response = await fetch(`/api/tourist/getProductWishlist/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (Array.isArray(data.wishlist)) {
        setWishlistedProducts(data.wishlist);   
        if (response.ok) {
          console.log('Wishlist products fetched successfully:', data);
        } else {
          console.error('Failed to fetch wishlist products:', data.message);
        }   
      } else {
        console.error('Expected an array of notifications, but got:', response.data);
        setWishlistedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchWishlistProducts();
  }, []);

  const handlePriceFilterChange = async (event) => {
    const { value } = event.target;
    const [min, max] = value.includes('+')
      ? [10000, 1000000]
      : value.split('-').map(Number);
    
    const updatedRange = selectedPriceRange === value ? "" : value;
    setSelectedPriceRange(updatedRange);
    setValues([min || 0, max || Infinity]);
    if (value === "all") {
      fetchProducts()
      return;
    }
    if (updatedRange) {
    try {
      const response = await fetch(`/api/${usertype}/filterProducts/${userId}?min=${min}&max=${max}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const filtered = await response.json(); 
      setProducts(filtered);
      console.log(filtered) 
    } catch (error) {
      console.error('Error filtering products by price:', error);
    }}
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch(`/api/tourist/cart/${id}/add/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Product added to cart:', data);
        // Optionally, refresh the cart or update the UI here
      } else {
        console.error('Failed to add product to cart:', data.message);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const fetchSortedProducts = async (order) => {
    try {
      const response = await fetch(`/api/${usertype}/sortByRate/${userId}?flag=${order}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const sortedProducts = await response.json(); 
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error sorting products by rating:', error);
    }
  };

  const handleSortChange = (order) => {
    const selectedOrder = order;
    setSortOrder(selectedOrder);
    const flag = selectedOrder === 'ascending' ? 1 : -1;
    fetchSortedProducts(flag);
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id2 => id2 !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  const toggleArchiveMode = () => {
    setArchiveMode(!archiveMode);
    setSelectedProducts([]);
  };

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

  const handleArchiveProducts = async () => {
    console.log(selectedProducts)
    for (const productId of selectedProducts) {
      console.log(productId)
      const product = products.find(p => p._id === productId); 
      const newArchiveStatus = !product.archieved; 
      try {
        await fetch(`/api/${usertype}/archieved/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ archieved: newArchiveStatus }), 
        });

        setProducts(products.map(p =>
          p._id === productId ? { ...p, archieved: newArchiveStatus } : p
        ));
      } catch (error) {
        console.error(`Error archiving product ${productId}:`, error);
      }
    }
    try {
      const response = await fetch(`/api/${usertype}/Products/${userId}`); 
      const updatedProducts = await response.json();
      setProducts(updatedProducts); 
    } catch (error) {
      console.error('Error fetching updated products:', error);
    }
    setArchiveMode(false); 
    setSelectedProducts([]); 
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  var pricerate = 0;
  if (currency == "USD") {
    pricerate = 48
  }
  if (currency == "EUR") {
    pricerate = 52
  }
  if (currency == "EGP") {
    pricerate = 1;
  }

  return (
    <div className="product-listing">
      <div className="filter-section">
        <div className="serachFilterbtn">
          
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="search-icon">
              <i className="fas fa-search"></i>
            </span>
           
          </div>
          
        </div>
        <Filter isFilterOpen={isFilterOpen} toggleFilter={setIsFilterOpen}>
            
            <div className="price-toggle" >
              <span>Price</span>
            </div>
            <div className="price-div">
              {/* <h4>Price Range</h4> */}
              <div className="price-options">
                <label>
                  <input
                    type="checkbox"
                    value="0-100"
                    onChange={handlePriceFilterChange}
                    checked={selectedPriceRange === "0-100"}
                  />
                  $0 - $100
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="100-1000"
                    onChange={handlePriceFilterChange}
                    checked={selectedPriceRange === "100-1000"}
                  />
                  $100 - $1,000
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="1000-5000"
                    onChange={handlePriceFilterChange}
                    checked={selectedPriceRange === "1000-5000"}
                  />
                  $1,000 - $5,000
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="5000-10000"
                    onChange={handlePriceFilterChange}
                    checked={selectedPriceRange === "5000-10000"}
                  />
                  $5,000 - $10,000
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="10000+"
                    onChange={handlePriceFilterChange}
                    checked={selectedPriceRange === "10000+"}
                  />
                  $10,000+
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="all"
                    onChange={handlePriceFilterChange}
                    checked={selectedPriceRange === "all"}
                  />
                  All Products
                </label>
              </div>
            </div>


            

            
            <div className="price-toggle" >
              <span>Rating</span>
              
            </div>
            
              <div className="price-div">
                
                <div className="rating-sort-options">
                  <div
                    className={`sort-option ${sortOrder === "descending" ? "selected" : ""}`}
                    onClick={() => handleSortChange("descending")}
                  >
                    {renderStars(5)} to {renderStars(1)}
                  </div>
                  <div
                    className={`sort-option ${sortOrder === "ascending" ? "selected" : ""}`}
                    onClick={() => handleSortChange("ascending")}
                  >
                    {renderStars(1)} to {renderStars(5)}
                  </div>
                </div>
              </div>
            

          </Filter>

          

          {usertype !== "tourist" && (<button className="archivebtn" onClick={archiveMode ? handleArchiveProducts : toggleArchiveMode}>
            {archiveMode ? <FontAwesomeIcon icon={faEdit} style={{ height: '18px', width: '18px' }}/>  : <FontAwesomeIcon icon={faArchive} style={{ height: '18px', width: '18px' }} />}
          </button>)}

          {usertype !== "tourist" && (<button className="addproductbtn" onClick={() => navigate(`/${modelName}/addProduct`)}>
            <FontAwesomeIcon icon={faPlus} style={{ height: '18px', width: '18px' }} />
          </button>)}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card"> {/* Ensure unique key */}
            {product.archieved && <div className="archivedoverlay">Archived</div>}
            <div className="card-header">
              <img src={`http://localhost:8000/${product.picture}`} alt={product.name} className="product-image" />
              {usertype==="tourist" && (<button
                className={`card-action ${
                  wishlistedProducts.some((item) => item.product._id === product._id) ? "wishlist-added" : ""
                }`}
                onClick={() => addProductToWishlist(product._id)}
              >
                <FontAwesomeIcon
                  icon={ faHeart}
                />
              </button>)}
            </div>
               
            <div className="productcard-content">
             
              <h2 className="productcard-title">{product.name}</h2>
              <div className="productcard-rating">
                <div className="rating">{renderStars(product.ratings)}</div>
              </div>
              <div className="card-description">
                <p className="productcard-description">{product.description}</p>
              </div>
              <div className="card-price">
                {usertype!="tourist" && (<p className="productcard-price">{(product.price).toFixed(2)} EGP</p>)}
                {usertype==="tourist" && (<p className="productcard-price">{(product.price * pricerate).toFixed(2)} {currency}</p>)}
              </div>
              {archiveMode && (
                <div
                className={`archive-select-circle ${selectedProducts.includes(product._id) ? 'selected' : ''}`}
                onClick={() => handleSelectProduct(product._id)}
                ></div>
              )}
             
            </div>
            {usertype === "admin" && (
              <Link
                to="/admin/viewproduct" state={[product._id, usertype] } className="view-more-btn"
              >
                View Details
              </Link>
            )}
            {usertype === "tourist" && (
              <Link
                to={`/tourist/viewproduct`} state={[product._id, usertype]} className="view-more-btn"  
              >
                view more
              </Link>
            )}
            {usertype === "tourist" && (
              <>
                <Link
                  className="view-more-btn"
                  onClick={() => {
                    addToCart(product._id);
                    setShowNotification(true); // Show the notification
                    setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
                  }}
                >
                  Add to Cart
                </Link>
              </>
            )}
            {usertype === "sellers" && (
              <Link
                to="/Seller/viewproduct" state={[product._id, usertype, userId]} className="view-more-btn"
              >
                View Details
              </Link>
            )}
          </div>
        ))}
        {showNotification && (
                  <div className="notification-popup">
                    <span>Added to Cart Successfully!</span>
                  </div>
                )}
      </div>
    </div>
  );
};

export default ProductListing;