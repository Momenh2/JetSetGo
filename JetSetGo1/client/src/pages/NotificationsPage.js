// NotificationsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get('auth_token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  let modelName = decodedToken.userType;
   console.log("modelName:",modelName);

   if(modelName=='TourGuide') modelName='tour-guides';
   
  
   useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tour-guides/notifications/all/${userId}`);
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:8000/api/${modelName}/MarkAsRead/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));  // Remove from state
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>All Notifications</h1>
      </div>

      <div className="notification-list-container">
        <ul className="notification-list">
          {loading ? (
            <p>Loading notifications...</p>
          ) : (
            notifications.map((notification) => (
              <li
                key={notification._id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <p>{notification.message}</p>
                {!notification.read && (
                  <button onClick={() => handleMarkAsRead(notification._id)}>
                    Mark as Read
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>


    </div>
  );
};
export default NotificationsPage;
