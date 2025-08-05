import React, { useState, useEffect } from 'react';
import './ProductListing.css';
// import { FaStar } from 'react-icons/fa';
import Filter from '../components/Filterbox.js';
import { Range } from 'react-range';
// import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
// import ProductForm from '../components/ProductForm.js';
// import ProductDetails from '../components/ProductDetails.js';
// import UpdateProducts from '../components/UpdateProduct.js';
import { useParams, useNavigate } from 'react-router-dom'; // useParams to get the model and ID from the URL

const STEP = 1;
const MIN = 0;
const MAX = 500;

const ProductListing = ({usertype}) => {
  console.log(usertype)
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

  // Formatter for price display
  const formatter = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Toggle visibility of rating filter
  const toggleRatingVisibility = () => {
    setIsRatingVisible(!isRatingVisible);
  };

  // Toggle visibility of price range filter
  const togglePriceRangeVisibility = () => {
    setIsPriceRangeVisible(!isPriceRangeVisible);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      
      try {
        const response = await fetch('/api/admin/Products');
        const data = await response.json();
        setProducts(data); // Assuming response data is an array of products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch filtered products by price range (POST request)
  const fetchFilteredProducts = async () => {
    try {
      
      const response = await fetch(`/api/sellers/filterProducts?min=${values[0]}&max=${values[1]}`, {
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
      
        const response = await fetch(`/api/admin/sortByRate?flag=${order}`, {
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
    const flag = selectedOrder === 'ascending' ? 1 : -1; // Determine flag based on selection
    fetchSortedProducts(flag); // Fetch sorted products
};
  

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="product-listing">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        { usertype!== "tourist"  &&  (<button type="button" onClick={() => navigate(`../${usertype}/addProduct`)}>Add Product</button>)}

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

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id || product.name} className="product-card"> {/* Ensure unique key */}
            <img src={`http://localhost:8000/${product.picture}`} alt={product.name} className="product-image" />

            {/* Ensure this matches your DB field */}
            <h2 className="product-title">{product.name}</h2>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <div className="product-rating">
              <p  className='rating'>{product.ratings}</p>
              {/* <FaStar className="star-icon" /> */}
            </div>
            <p className="product-description">{product.description}</p>
            <button className="add-to-cart-btn">Add to Cart</button>
            {usertype!=="tourist" && (<button type="button" onClick={() => navigate(`../${usertype}/updateProduct/${product._id}`)}>Edit Product</button>)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
