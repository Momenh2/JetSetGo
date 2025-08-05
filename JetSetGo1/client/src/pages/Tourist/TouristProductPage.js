import React, { useState, useEffect, useContext } from 'react';
import './TouristProductListing.css';
import { Link } from "react-router-dom";
import Filter from '../../components/Filterbox';

import { Range } from 'react-range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import { CurrencyContext } from '../../components/Tourist/CurrencyContext';
import { useParams, useNavigate } from 'react-router-dom'; // useParams to get the model and ID from the URL
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
// import { getTokenFromCookies } from '../utils/cookies'; // Adjust the path as necessary


const STEP = 1;
const MIN = 0;
const MAX = 500;


const TouristProductListing = ({ usertype }) => {
  // const { id } = useParams();
  const location = useLocation(); // Access the location object
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  // const { id } = location.state || {};
  const { currency } = useContext(CurrencyContext);


  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [values, setValues] = useState([100, 250]);
  const [isPriceRangeVisible, setIsPriceRangeVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(1);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState(''); // State for sorting order
  const navigate = useNavigate(); // For navigation after the update
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [archiveMode, setArchiveMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);



  // Formatter for price display
  const formatter = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };


  const toggleRatingVisibility = () => {
    setIsRatingVisible(!isRatingVisible);
  };


  const togglePriceRangeVisibility = () => {
    setIsPriceRangeVisible(!isPriceRangeVisible);
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  useEffect(() => {
    const fetchProducts = async () => {

      try {
        const response = await fetch('/api/tourist/Products');
        const data = await response.json();
        setProducts(data); // Assuming response data is an array of products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);




  const fetchFilteredProducts = async () => {
    try {

      const response = await fetch(`/api/tourist/filterProducts?min=${values[0]}&max=${values[1]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const filtered = await response.json(); // Parse the JSON response
      setProducts(filtered); // Update products with filtered data
    } catch (error) {
      console.error('Error filtering products by price:', error);
    }
  };
  const fetchSortedProducts = async (order) => {
    try {

      const response = await fetch(`/api/tourist/sortByRate?flag=${order}`, {
        method: 'GET', // This is correct
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const sortedProducts = await response.json(); // Parse the JSON response
      setProducts(sortedProducts); // Update products with sorted data
    } catch (error) {
      console.error('Error sorting products by rating:', error);
    }
  };

  const handleSortChange = (event) => {
    const selectedOrder = event.target.value;
    setSortOrder(selectedOrder);
    const flag = selectedOrder === 'ascending' ? 1 : -1;
    fetchSortedProducts(flag);
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  const toggleArchiveMode = () => {
    setArchiveMode(!archiveMode);
    setSelectedProducts([]); // Clear selected products when toggling archive mode
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
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <Filter isFilterOpen={isFilterOpen} toggleFilter={setIsFilterOpen}>
            <h2>Advanced Filters</h2>

            {/* Price selector */}
            <div className="price-toggle" onClick={togglePriceRangeVisibility}>
              <span>Price</span>
              <div className="toggle-arrow">
                {/* {isPriceRangeVisible ? <MdArrowDropUp size={34} /> : <MdArrowDropDown size={34} />} */}
              </div>
            </div>

            {isPriceRangeVisible && (
              <div className="price-div">
                <div className="price-display">
                  <span>Min: {formatter(values[0])}</span> -
                  <span>Max: {formatter(values[1])}</span>
                </div>

                <Range
                  values={values}
                  step={STEP}
                  min={MIN}
                  max={MAX}
                  onChange={setValues}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '6px',
                        width: '100%',
                        background: 'black',
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, isDragged }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '24px',
                        width: '24px',
                        backgroundColor: isDragged ? '#007bff' : '#ccc',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                />
              </div>
            )}

            {/* Save Button to Apply Filter */}
            <button className="save-filter-btn" onClick={fetchFilteredProducts}>
              Save Filter
            </button>

            {/* Rating Toggle Section */}
            <div className="rating-toggle" onClick={toggleRatingVisibility}>
              <span>Rating</span>
              <div className="toggle-arrow">
                {/* {isRatingVisible ? <MdArrowDropUp size={34} /> : <MdArrowDropDown size={34} />} */}
              </div>
            </div>

            {isRatingVisible && (
              <div className="rating-div">
                <div className="rating-display">
                  <span>Rating: {ratingValue.toFixed(1)} Stars</span>
                </div>
                <select id="sort" value={sortOrder} onChange={handleSortChange}>
                  <option value="">Select</option>
                  <option value="ascending">1 to 5</option>
                  <option value="descending">5 to 1</option>
                </select>


              </div>
            )}
          </Filter>

        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (

          <div key={product._id} className="product-card"> {/* Ensure unique key */}

            <img src={`http://localhost:8000/${product.picture}`} alt={product.name} className="product-image" />

            {/* Ensure this matches your DB field */}
            <h2 className="product-title">{product.name}</h2>
            <p className="product-price">{(product.price * pricerate).toFixed(2)} {currency}</p>
            <div className="product-rating">
              <p className='rating'>{product.ratings}</p>
              <faStar className="star-icon" />
            </div>
            <p className="product-description">{product.description}</p>
            {archiveMode && (
              <div
                className={`archive-select-circle ${selectedProducts.includes(product._id) ? 'selected' : ''}`}
                onClick={() => handleSelectProduct(product._id)}
              ></div>
            )}



            {usertype === "tourist" && (
              <Link
                to={`/tourist/viewproduct`} state={[product._id, usertype]}
              >
                <button className="add-to-cart-btn">View Details</button>
              </Link>
            )}



          </div>
        ))}
      </div>
    </div>
  );
};

export default TouristProductListing;
