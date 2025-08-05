import React from 'react';
import './boxes.css';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TourismGovernerNavBar from './tourismgovernernavbar.js';
// import { useLocation } from 'react-router-dom';

function TourismGovernerLayout() {
  const location = useLocation(); // Access the location object
  const { id } = location.state || {}; // Access the id from state

  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <TourismGovernerNavBar  state={{ id }}/> 
        <div className="dashboard-data">
          <Outlet  state={{ id }}/> =
        </div>
      </div>
    </div>
  );
}

export default TourismGovernerLayout;