import React from 'react';

import { Outlet } from 'react-router-dom';

import TourGuideNavBar from '../TourGuideNavBar';



function TourGuideLayout() {
  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <TourGuideNavBar /> {/* Navbar stays visible */}
        <div className="dashboard-data">
          <Outlet /> {/* Renders the page content here */}
        </div>
      </div>
    </div>
  );
}

export default TourGuideLayout;
