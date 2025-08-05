import React from 'react';
import './boxes.css';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NavBar from './navbar';
import MenuComponent from './newnavbarGARBAGE.js';
import Menu from './newnavbar2.js';
import Navbar2  from './Navbarnew.js'
// import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie


function TouristLayout() {
  const location = useLocation(); // Access the location object
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("id:", id);
  const modelName = decodedToken.userType;
  console.log("modelName:", modelName);
  // const { id } = location.state || {}; // Access the id from state

  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <NavBar state={{ id }} /> {/* Navbar stays visible */}
        <div className="dashboard-data">
          <Outlet state={{ id }} /> {/* Renders the page content here */}
        </div>
      </div>
    </div>
  );
}

export default TouristLayout;
