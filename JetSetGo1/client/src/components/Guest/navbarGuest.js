import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './homepage.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

import styles from '../Tourist/Navbar.module.css'

function NavBarGuest() {
    const navigate = useNavigate();


    const handleNavigation = (path) => {
        navigate(path);
    };

    const menuItems = [
        {
          title: 'Home',
          link: '/guest/home'
        },
        {
          title: 'Activities',
            link: '/guest/activities2'
        },
        {
            title: 'Itineraries',
            link: '/guest/itineraries2'
          },
        {
            title :'Historical Locations',
            link: `/guest/historicalLocations`
        }
      ];


    return (
        <div className={styles.navbarContainer}>
        <div className={styles.logo}>
        <Link to="/guest/home" className={styles.logoLink}>
            <span className={styles.logoHighlight}>JETSETGO</span>
        </Link>
        </div>

        <nav className={styles.navbar}>
        {menuItems.map((item) => (
            <div
            key={item.title}
            className={`${styles.menuItem} ${item.items ? '' : styles.noDropdown}`}
            
            >
            <div className={styles.menuText}>
                <Link to={item.link || '#'}>{item.title}</Link>
            </div>
            </div>
        ))}
        </nav>
            <div className={styles.actions}>
                <div className={styles.profileChanger}>
                    <button className={styles.signUpbutton} onClick={() => handleNavigation('/Authentication')}>
                        Sign up
                    </button>
                </div>
            </div>
        </div>

    );
}

export default NavBarGuest;
