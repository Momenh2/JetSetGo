import React from 'react';

import { Outlet } from 'react-router-dom';

import AdvertiserNavBar from './AdvertiserNavBar';

function AdvertiserLayout() {
  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <AdvertiserNavBar /> {/* Navbar stays visible */}
        <div className="dashboard-data">
          <Outlet /> {/* Renders the page content here */}
        </div>
      </div>
    </div>
  );
}

export default AdvertiserLayout;
