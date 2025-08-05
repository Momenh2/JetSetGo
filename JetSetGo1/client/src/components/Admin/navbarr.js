import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './navbarr.css';

function Navbar() {
  return (
    <div className="navbarr">
      <div className="navbarr-left">
        
        
      </div>
      <div className="navbarr-right">

        {/* Notification Icon */}
        <div className="notification-section">
          <FontAwesomeIcon icon={faBell} className="notification-icon" />
          <span className="notification-badge">3</span>
        </div>
        
        {/* User Profile */}
        <div className="profile-section">
          <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
          <span className="profile-name">Admin Name</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
