import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './SellerNavbar.module.css';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import Badge1 from '../../assets/images/Badge1.jpg';
import Badge2 from '../../assets/images/Badge2.jpg';
import Badge3 from '../../assets/images/Badge3.jpg';
import { jwtDecode } from "jwt-decode"; 
import Cookies from "js-cookie";

import SellerProfileDropdown from './sellerProfileDropdown';
import '@fortawesome/fontawesome-free/css/all.min.css'; 



const menuItems = [
    {
      title: 'Trips',
      items: [
        { icon: 'hiking', title: 'Activities', subText: 'Engage in exciting adventures and outdoor experiences.', link: '/tourist/activities2' },
        { icon: 'map-marked-alt', title: 'Itineraries', subText: 'Plan your trip with curated itineraries tailored for you.', link: '/tourist/itineraries2' },
      ],
    },
    {
      title: 'Places',
      items: [
        { icon: 'landmark', title: 'Historical Locations', subText: 'Explore famous landmarks and their rich history.', link: '/tourist/historicalLocations' },
        { icon: 'university', title: 'Museums', subText: 'Discover world-class museums and cultural treasures.', link: '/tourist/historicalLocations' },
      ],
    },
    {
      title: 'Products',
      items: [
        { icon: 'shopping-cart', title: 'Product', subText: 'My Products', link: '/Seller/products' },
        { icon: 'chart-line', title: 'Sales', subText: 'All my Sales and Profits', link: '/Seller/productSales' },
        
      ],
    },
    
  ];
  


function SellerNavbar() {
    // const { id } = useParams();
    //const location=useLocation();
   // const {id} = location.state;
    const [activeDropdown, setActiveDropdown] = useState(null);
    
   
    const location = useLocation();
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;

    console.log("ANA GOWA EL NAV BAR")
    console.log("id:",id);
    const modelName = decodedToken.userType;
    console.log("modelName:",modelName);

    
    console.log("at navbar:"+id);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activePopup, setActivePopup] = useState(null);
    const [seller,setSeller]=useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
   // const modelName='sellers'

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    

    const handleNavigation = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
        setActivePopup(null);
    };

    const togglePopup = (menuItem) => {
        setActivePopup((prev) => (prev === menuItem ? null : menuItem));
    };

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

    

    const renderLevelImage = (level) => {
        switch (level) {
            case 1:
                return <img src={Badge1} alt="Level 1 Badge" className="badge-image" style={{ width: '50px', height: '50px' }} />;
            case 2:
                return <img src={Badge2} alt="Level 2 Badge" className="badge-image" style={{ width: '50px', height: '50px' }} />;
            case 3:
                return <img src={Badge3} alt="Level 3 Badge" className="badge-image" style={{ width: '50px', height: '50px' }} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.navbarContainer}>
            <div className={styles.logo}>
                <Link to="/Seller/home" className={styles.logoLink}>
                    <span className={styles.logoHighlight}>JETSETGO</span>
                </Link>
            </div>
            
            <nav className={styles.navbar}>
                {menuItems.map((item) => (
                <div
                    key={item.title}
                    className={`${styles.menuItem} ${item.items ? '' : styles.noDropdown}`}
                    onMouseEnter={() => item.items && setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)} >
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
                                    {subItem.title} <i className="fa fa-arrow-right"></i>
                                </div>
                                {subItem.subText && (
                                    <div className={styles.subText}>
                                        {subItem.subText}
                                    </div>
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
          <div className={styles.actions2}>
            <Link to="/help" className={styles.iconBox}>
            <i class="fa-regular fa-bell"></i>
            </Link>
            
          </div>
          <div className={styles.profileChanger}>
            <SellerProfileDropdown /> 
          </div>
        </div>
        </div>
    );
}

export default SellerNavbar;