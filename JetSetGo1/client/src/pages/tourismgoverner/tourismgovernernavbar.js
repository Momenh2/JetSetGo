'use client';

import styles from './Navbar.module.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ProfileDropdown from './ProfileDropdown';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome



const Navbar2 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const token = Cookies.get('auth_token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

  const menuItems = [
    {
        title: 'Home',
        link: `/tourism_governer`, 
      },
  {
    title: 'Historical Tags',
    link: `/tourism_governer/Tags`, 
  },
];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logo}>
        <Link to="/tourism_governer" className={styles.logoLink}>
          <span className={styles.logoHighlight}>JETSETGO</span>
        </Link>
      </div>

      <nav className={styles.navbar}>
        {menuItems.map((item) => (
          <div
            key={item.title}
            className={`${styles.menuItem} ${item.items ? '' : styles.noDropdown}`}
            onMouseEnter={() => item.items && setActiveDropdown(item.title)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className={styles.menuText}>
              <Link to={item.link || '#'}>{item.title}</Link>
            </div>
            {activeDropdown === item.title && item.items && (
              <div className={styles.subMenu}>
                {item.items.map((subItem, index) => (
                  <Link to={subItem.link} key={index} className={styles.iconBox}>
                    <div className={styles.icon}>
                      <i className={`fas fa-${subItem.icon}`}></i>
                    </div>
                    <div className={styles.text}>
                      <div className={styles.title}>
                        {subItem.title} <i className="fa-arrow-right"></i>
                      </div>
                      {subItem.subText && (
                        <div className={styles.subText}>{subItem.subText}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
      </nav>
      <div className={styles.actions}>
          


          
          <div className={styles.profileChanger}>
            <ProfileDropdown />
          </div>
        </div>
    </div>
  );
};

export default Navbar2;