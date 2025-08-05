import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Badge1 from '../../assets/images/Badge1.jpg';
import Badge2 from '../../assets/images/Badge2.jpg';
import Badge3 from '../../assets/images/Badge3.jpg';

import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const SellerProfileDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [seller,setSeller]=useState(null);
    const dropdownRef = useRef(null);
   
    const location = useLocation();

    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const modelName = 'tourist';

    useEffect(() => {
        const fetchSellerData = async () => {
          try {
            const response = await fetch(`http://localhost:8000/api/sellers/profile/${id}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            setSeller(data);
            
          } catch (error) {
            console.error('Error fetching seller data:', error);
          }
        };
        fetchSellerData();
    }, [id]);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    

    return (
        <>
            <style>
                {`
        .profile {  
        position: relative;
          z-index: 1000;
        }

        .profileLink {
          display: flex;
        //   justify-content: center;
        //   align-items: center;
          width: 60px;
          height: 60px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.3s ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .profileLink:hover {
          transform: scale(0.85);
        }

        .profileLink:focus {
          outline: none;
        }

        .profileLink:focus-visible {
          outline: none;
        }

        .levelBadge {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #fda085, #f6d365);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(253, 160, 133, 0.3);
        }

        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 10px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 250px;
          overflow: hidden;
          animation: fadeIn 0.3s ease;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown ul {
          list-style: none;
          margin: 0;
          padding: 8px 0;
        }

        .dropdown li {
          padding: 0;
          margin: 4px 8px;
        }

        .dropdownItem {
          color: #333;
          text-decoration: none;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          border-radius: 8px;
        }

        .dropdownItem:hover {
          background-color: #f0f0f0;
          transform: translateX(5px);
        }

        .dropdownItem i {
          font-size: 1.2rem;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fda085, #f6d365);
          color: white;
          border-radius: 50%;
        }

        .dropdownItem span {
          font-weight: 500;
        }
      `}
            </style>

            <div className="profile" ref={dropdownRef}>
                {seller && (<button className="profileLink" onClick={toggleDropdown}>
                    <img src={`http://localhost:8000/${seller.profileImage}`} className="levelBadge" />
                </button>)}

                {isDropdownOpen && (
                    <div className="dropdown">
                        <ul>
                            <li>
                                <Link to={`/Seller/profile`} className="dropdownItem">
                                    <i className="fas fa-user"></i>
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={`/Seller/change-password/${id}/${modelName}`} className="dropdownItem">
                                    <i className="fas fa-key"></i>
                                    <span>Change Password</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={`/Seller/RequestDelete/${id}/${modelName}`} className="dropdownItem">
                                    <i className="fas fa-trash"></i>
                                    <span>Request to Delete</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={`/Seller/upload-image/${id}/${modelName}`} className="dropdownItem">
                                    <i className="fas fa-user"></i>
                                    <span>upload Image</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default SellerProfileDropdown;