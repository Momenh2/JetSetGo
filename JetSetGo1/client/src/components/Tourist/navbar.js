'use client';

import styles from './Navbar.module.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CurrencyContext } from './CurrencyContext';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ProfileDropdown from './ProfileDropdown';
import Wishlist from '../wishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faArchive,faEdit,faHeart   } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const menuItems = [
  {
    title: 'Trips',
    items: [
      { icon: 'hiking', title: 'Activities', subText: 'Engage in exciting adventures and outdoor experiences.', link: '/tourist/activities2' },
      { icon: 'map-marked-alt', title: 'Itineraries', subText: 'Plan your trip with curated itineraries tailored for you.', link: '/tourist/itineraries2' },
    ],
  },
  {
    title: 'Places',
    items: [
      { icon: 'landmark', title: 'Historical Locations', subText: 'Explore famous landmarks and their rich history.', link: '/tourist/historicalLocations' },
      { icon: 'university', title: 'Museums', subText: 'Discover world-class museums and cultural treasures.', link: '/tourist/historicalLocations' },
    ],
  },
  {
    title: 'Book',
    items: [
      { icon: 'hotel', title: 'Hotels', subText: 'Find and book the best hotels worldwide.', link: '/tourist/book-hotel' },
      { icon: 'plane', title: 'Flights', subText: 'Discover great deals on flights to your destination.', link: '/tourist/book_flight' },
      { icon: 'bus', title: 'Transportation', subText: 'Plan your local and intercity travel with ease.', link: '/tourist/transportbooking' },
    ],
  },
  {
    title: 'Products',
    link: '/tourist/products', 
  },
];

const Navbar2 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { currency, setCurrency } = useContext(CurrencyContext);
  const dropdownRef = useRef(null);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const location = useLocation();

  const token = Cookies.get('auth_token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

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
    const fetchTouristData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tourist/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching tourist data:', error);
      }
    };
    fetchTouristData();
    fetchWishlistProducts();
  }, [id]);





  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logo}>
        <Link to="/tourist/home" className={styles.logoLink}>
          <span className={styles.logoHighlight}>JETSETGO</span>
        </Link>
      </div>

      <nav className={styles.navbar}>
        {menuItems.map((item) => (
          <div
            key={item.title}
            className={`${styles.menuItem} ${item.items ? '' : styles.noDropdown}`}
            onMouseEnter={() => item.items && setActiveDropdown(item.title)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className={styles.menuText}>
              <Link to={item.link || '#'}>{item.title}</Link>
            </div>
            {activeDropdown === item.title && item.items && (
              <div className={styles.subMenu}>
                {item.items.map((subItem, index) => (
                  <Link to={subItem.link} key={index} className={styles.iconBox}>
                    <div className={styles.icon}>
                      <i className={`fas fa-${subItem.icon}`}></i>
                    </div>
                    <div className={styles.text}>
                      <div className={styles.title}>
                        {subItem.title} <i className="fa-arrow-right"></i>
                      </div>
                      {subItem.subText && (
                        <div className={styles.subText}>{subItem.subText}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
      </nav>
      <div className={styles.actions}>
          <div className={styles.actions2}>
          <Wishlist isFilterOpen={isFilterOpen2} toggleFilter={setIsFilterOpen2}>
            <div className={`filter-container ${isFilterOpen2 ? 'open' : ''}`}>
              <div className="filter-header">
                <h2 className='wishlisted-head'>Wishlisted Products</h2>
                <button className="close-btn" onClick={() => setIsFilterOpen2(false)}>
                  &times;
                </button>
              </div>
              <div className="filter-content">
                
                  { wishlistedProducts.map((product) => (
                    <div key={product.product._id} className="wishlist-item">
                      {console.log( product.product.name)}
                      <img
                        src={`http://localhost:8000/${product.product.picture}`}  // Add a fallback image
                        alt={product.product.name}
                        className="wishlist-item-image"
                      />
                      <div className="wishlist-item-info">
                        <h4>{product.product.name}</h4>
                        <button className="addproductbtn" onClick={() => {addToCart(product.product._id)}}>
                          <FontAwesomeIcon icon={faPlus} style={{ height: '13px', width: '13px' }} />
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => removeProductFromWishlist(product.product._id)}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                 
                  
                
              </div>
            </div>
          </Wishlist>
            {/* <Link to="/help" className={styles.iconBox}>
              <i className="fas fa-question"></i>
            </Link> */}
            <Link to="/help" className={styles.iconBox}>
            <i class="fa-regular fa-bell"></i>
            </Link>
            <Link to="/tourist/cart" className={styles.iconBox}>
              <i className="fas fa-shopping-cart"></i>
            </Link>
          </div>


          <select className={styles.currencyChanger} value={currency} onChange={handleCurrencyChange}>
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <div className={styles.profileChanger}>
            <ProfileDropdown />
          </div>
        </div>
    </div>
  );
};

export default Navbar2;
