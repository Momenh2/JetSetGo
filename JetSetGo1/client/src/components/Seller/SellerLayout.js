import React from 'react';
import './boxes.css';
import { Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import SellerNavbar from './SellerNavbar';

function SellerLayout() {
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  const modelName = decodedToken.userType;
  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <SellerNavbar  state={{ id }} /> {/* Navbar stays visible */}
        <div className="dashboard-data">
          <Outlet  state={{ id }} /> {/* Renders the page content here */}
        </div>
      </div>
    </div>
  );
}

export default SellerLayout;
