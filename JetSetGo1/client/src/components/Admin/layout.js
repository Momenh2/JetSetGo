import React from 'react';
import './boxes.css';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar'; // Import your Sidebar component
import Navbar from './navbarr'; // Import your Navbar component

function Layout() {
  return (
    <div className="admin-dashboard">
      <Sidebar /> {/* Sidebar stays visible */}
      <div className="main-content">
        <Navbar /> {/* Navbar stays visible */}
        <div className="dashboard-data">
          <Outlet /> {/* Renders the page content here */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
