// Navbar2.js
'use client';
import { useNavigate } from 'react-router-dom';
import styles from './Tourist/Navbar.module.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ProfileDropdown from './ProfileDropDownTourGuide';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import axios from 'axios';
import io from 'socket.io-client';

const Navbar2 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);  // To check for unread notifications
  const dropdownRef = useRef(null);
  const navigate = useNavigate();  // Initialize useNavigate
  const socket = useRef(null);
  const location = useLocation();

  const token = Cookies.get('auth_token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

  const menuItems = [
    {
      title: 'Trips',
      items: [
        { icon: 'hiking', title: 'Activities', subText: 'Engage in exciting adventures and outdoor experiences.', link: '/tourist/activities2' },
        { icon: 'map-marked-alt', title: 'Itineraries', subText: 'Plan your trip with curated itineraries tailored for you.', link: `/Tourguide/${id}/MyItineraries` },
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
        title :'Sales',
        link: `/Tourguide/${id}/ItinerarySales`
    }
  ];

  useEffect(() => {
    // Set up the socket connection
    socket.current = io('http://localhost:8000', {  // Update with your backend socket URL
      transports: ['websocket'],
      query: { userId: id },  // Send the userId when connecting
    });

    // Listen for 'new_notification' event from the server
    socket.current.on('new_notification', (newNotification) => {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      setHasUnread(true);  // New notification means unread
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/tour-guides/notifications/unread/${id}`);
        setHasUnread(response.data.some((notification) => !notification.read));
          // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        // Handle the case where the response is not an array (e.g., log the error or set an empty array)
        console.error('Expected an array of notifications, but got:', response.data);
        setNotifications([]); // Set empty array if the response is not as expected
      }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [id]);

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

  const handleViewAllNotifications = () => {
    setActiveDropdown(null);  // Close the dropdown after viewing all
    navigate(`/Tourguide/${id}/notifications`);  // Use `navigate` to redirect to the "View All Notifications" page
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:8000/api/tour-guides/MarkAsRead/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));  // Remove from state
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

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
          <Link to="/wishlist" className={styles.iconBox}>
            <i className="fas fa-heart"></i>
          </Link>

          {/* Notification Icon */}
          <i className={`fa-regular fa-bell ${styles.notificationIcon}`}   onClick={() => setActiveDropdown('notifications')}></i>
          {hasUnread && <span className={styles.unreadBadge}></span>} {/* Show unread badge */}

          <Link to="/cart" className={styles.iconBox}>
            <i className="fas fa-shopping-cart"></i>
          </Link>
        </div>

        <div className={styles.profileChanger}>
          <ProfileDropdown />
        </div>
      </div>

      {/* Notification Dropdown */}
      {activeDropdown === 'notifications' && (
        <div className={styles.notificationDropdown} ref={dropdownRef}>
          <div className={styles.notificationHeader}>
            <h4>New Notifications!</h4>
            <button onClick={handleViewAllNotifications}>View All</button>
          </div>
          <div className={styles.notificationList}>
            {loading ? (
              <p>Loading notifications...</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification._id} className={styles.notificationItem}>
                  <p>{notification.message}</p>
                  {console.log("this is notifications id : " , notification._id)}
                  <button onClick={() => handleMarkAsRead(notification._id)}>Mark as Read</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar2;
