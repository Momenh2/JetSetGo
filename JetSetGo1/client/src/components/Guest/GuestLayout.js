import React from 'react';
import './boxes.css';
import { Outlet } from 'react-router-dom';

import NavBar from './navbarGuest';

function GuestLayout() {
  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <NavBar /> {/* Navbar stays visible */}
        <div className="dashboard-data">
          <Outlet /> {/* Renders the page content here */}
        </div>
      </div>
    </div>
  );
}

export default GuestLayout;
