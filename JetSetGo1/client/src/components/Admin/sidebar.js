import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTags, faChartBar, faComments, faBox, faTasks, faUser, faFlag } from '@fortawesome/free-solid-svg-icons'; 
import './sidebar.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const id= "67043d224b400647ae0e235f";
  const modelName="admin"
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <button 
        className={`hamburger ${isMinimized ? '' : 'open'}`} // Show lines if minimized, otherwise show X
        onClick={toggleSidebar} 
        aria-label="Toggle Sidebar"
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>
      <ul className="sidebar-menu">
        <li>
        <Link to ={`/admin/productSales`}>
          <FontAwesomeIcon icon={faChartBar} className="icon" />
           
          <span>Sales</span>
          </Link> 
        </li>
        <li>
          <FontAwesomeIcon icon={faTags} className="icon" />
          <span>Tags</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faComments} className="icon" />
          <span><Link to="/admin/complaints">Complaints</Link></span>
        </li>
        <li>
          <FontAwesomeIcon icon={faBox} className="icon" />
          
          <span><Link to="/admin/products" state={{id}}>Product</Link></span>
        </li>
        
        <li>
          <FontAwesomeIcon icon={faTasks} className="icon" />
          <span><Link to="/admin/requests">Request</Link></span>
        </li>
        <li>
          <FontAwesomeIcon icon={faFlag} className="icon" />
          <span><Link to="/admin/flagItinerary">Flag Itineraries</Link></span>
        </li>
        <li>
          <FontAwesomeIcon icon={faFlag} className="icon" />
          <span><Link to="/admin/flagActivity">Flag Activities</Link></span>
        </li>
        <li>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <span><Link to={`/admin/change-password/${id}/${modelName}`}>change Password</Link></span>
        </li>
        <li>
          <FontAwesomeIcon icon={faCog} className="icon" />
          <span><Link to={`/admin/my_category`}>category</Link></span>
        </li>
        
        <li>
          <FontAwesomeIcon icon={faCog} className="icon" />
          <span><Link to={`/admin/my_tags`}>Tags</Link></span>
        </li>
        <li>
          <FontAwesomeIcon icon={faCog} className="icon" />
          <span><Link to={`/admin/promocodes`}>Promo Codes</Link></span>
        </li>
        <li>
          <FontAwesomeIcon icon={faCog} className="icon" />
          <span><Link to={`/admin/users`}>Users</Link></span>
        </li>
        <li>
    <FontAwesomeIcon icon={faUser} className="icon" />
    <span><Link to = {`/admin/users?role=admin&openModal=true`}>Add Admin</Link></span>
  </li>
  <li>
    <FontAwesomeIcon icon={faUser} className="icon" />
    <span> <Link to = {`/admin/users?role=tourismgoverner&openModal=true`}>Add Tourism Governer</Link></span>
  </li>
      </ul>
    </div>
  );
}

export default Sidebar;