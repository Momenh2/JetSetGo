import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Badge1 from '../../assets/images/Badge1.jpg';
import Badge2 from '../../assets/images/Badge2.jpg';
import Badge3 from '../../assets/images/Badge3.jpg';
import { CurrencyContext } from './CurrencyContext';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const currencies = ["EGP", "EUR", "USD"];

function NavBar() {
  const { currency, setCurrency } = useContext(CurrencyContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tourist, setTourist] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  const modelName = 'tourist';

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tourist/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setTourist(data);
      } catch (error) {
        console.error('Error fetching tourist data:', error);
      }
    };

    fetchTouristData();
  }, [id]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const renderLevelImage = (level) => {
    const badges = {
      1: Badge1,
      2: Badge2,
      3: Badge3,
    };
    return (
      level &&
      badges[level] && (
        <img
          src={badges[level]}
          alt={`Level ${level} Badge`}
          className="badge-image"
        />
      )
    );
  };

  // Check if the current path is "products"
  const isProductsPage = location.pathname === '/tourist/products';

  return (
    <div>
      <style>
        {`
        .navvvbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(51, 51, 51, 0.7); /* Translucent */
          color: white;
          padding: 10px 20px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 60px; /* Fixed height */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          font-size: 18px; /* Larger text */
        }
        body {
          padding-top: 60px; /* Push content below the navbar */
        }
        .menu {
          display: flex;
          justify-content: center;
          flex: 1; /* Center the menu items relative to the page */
        }
        .menu ul {
          list-style: none;
          display: flex;
          padding: 0;
          margin: 0;
        }
        .menu ul li {
          margin: 0 20px;
          position: relative;
        }
        .menu ul li a {
          color: white;
          text-decoration: none;
          font-weight: bold;
        }
        .menu ul li:hover > a {
          text-decoration: underline;
        }
        .submenu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background-color: rgba(51, 51, 51, 0.9);
          padding: 10px;
          border-radius: 5px;
        }
        .menu ul li:hover > .submenu {
          display: block;
        }
        .submenu a {
          display: block;
          padding: 5px 0;
          color: white;
          text-decoration: none;
        }
        .submenu a:hover {
          background-color: rgba(240, 240, 240, 0.5);
        }
        .currency {
          display: flex;
          align-items: center;
        }
        select {
          padding: 5px;
          border-radius: 5px;
          background-color: rgba(68, 68, 68, 0.7);
          color: white;
          border: none;
        }
        .profile {
          position: relative;
        }
        .profile-link {
          cursor: pointer;
          display: inline-block;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: rgba(255, 255, 255, 0.9);
          color: black;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          overflow: hidden;
        }
        .dropdown-menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .dropdown-menu ul li {
          padding: 10px;
          border-bottom: 1px solid rgba(221, 221, 221, 0.5);
        }
        .dropdown-menu ul li a {
          text-decoration: none;
          color: black;
        }
        .dropdown-menu ul li a:hover {
          background-color: rgba(240, 240, 240, 0.5);
        }
        .badge-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .wishlist-button {
          position: absolute;
          right: 20px;
          display: ${isProductsPage ? 'block' : 'none'}; /* Show only on products page */
          font-size: 18px;
          background-color: rgba(0, 123, 255, 0.7);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }
        `}
      </style>

      <div className="navvvbar">
        <div className="menu">
          <ul>
            <li><Link to="/tourist/home" state={{ id }}>Home</Link></li>
            <li>
              <span>Trips</span>
              <div className="submenu">
                <Link to="/tourist/activities2" state={{ id }}>Activities</Link>
                <Link to="/tourist/itineraries2" state={{ id }}>Itineraries</Link>
              </div>
            </li>
            <li>
              <span>Places</span>
              <div className="submenu">
                <Link to="/tourist/historicalLocations" state={{ id }}>Locations</Link>
              </div>
            </li>
            <li>
              <span>Book</span>
              <div className="submenu">
                <Link to="/tourist/book-hotel" state={{ id }}>Hotels</Link>
                <Link to="/tourist/book_flight" state={{ id }}>Flights</Link>
                <Link to="/tourist/transportbooking" state={{ id }}>Transportation</Link>
              </div>
            </li>
            <li><Link to="/tourist/products" state={{ id }}>Products</Link></li>
          </ul>
        </div>

        <div className="currency">
          <select value={currency} onChange={handleCurrencyChange}>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>

        <div className="profile" ref={dropdownRef}>
          <span className="profile-link" onClick={toggleDropdown}>
            {tourist && renderLevelImage(tourist.Level)}
          </span>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li><Link to={`/tourist/profile/tourist/${id}`}><i className="fas fa-user"></i> Profile</Link></li>
                <li><Link to={`/tourist/change-password/${id}/${modelName}`}><i className="fas fa-user"></i> Change Password</Link></li>
                <li><Link to={`/tourist/RequestDelete/${modelName}/${id}`}><i className="fas fa-user"></i> Request to Delete</Link></li>
                <li><Link to={`/tourist/rate-comment-event/${modelName}/${id}`}><i className="fas fa-user"></i> Rate/Comment Attended</Link></li>
                <li><Link to="/tourist/my_bookings" state={{ id }}>Bookings</Link></li>
                <li><Link to="/tourist/tourguidelist" state={{ id }}>Tour Guide</Link></li>
                <li><Link to={`/tourist/myprefs/${id}`} state={{ id }}>Preferences</Link></li>
              </ul>
            </div>
          )}
        </div>

        {isProductsPage && (
          <button className="wishlist-button">Wishlist</button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
