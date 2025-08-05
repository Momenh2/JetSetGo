
# JetSetGo

JetSetGo is your all-in-one travel platform designed to make vacation planning effortless and exciting! Whether you're dreaming of historic landmarks, relaxing beaches, or family-friendly adventures, our app combines everything you need for the perfect trip.

## Motivation

Traveling should be enjoyable, not complicated. JetSetGo was created to simplify the travel process, offering an efficient and accessible platform for users to explore cities, museums, and landmarks online. Our goal is to bring a new level of ease and convenience to travel planning, making it effortless for everyone to plan their dream trips and create unforgettable experiences.

## Build Status

The project is currently in development.

### Current Challenges
- The testing technique needs improvement. Plans are underway to create Jest test files and enable them as workflows for more robust and efficient testing.

### Future Improvements
1. Implement a caching layer to enhance application performance.
2. Integrate a message broker to handle asynchronous tasks such as sending emails and notifications.
3. The flight and transporation overall booking has a full processes not just a button and a feedback.
4. The sales models sometimes work and sometimes not because of some issues in the DataBase data (old) and (new) data
5. The color scheme is not fully atomic among the whole application.
6. Our Naming convension is not always implemented.
7. Not using Strip.

## Code Style 📜

This project adheres to the following code style guidelines:

1. **Naming Conventions**:
   - Use `camelCase` for variable and function names.

2. **Comments**:
   - Add comments before functions and complex logic to explain their purpose.
   - Keep comments concise and informative.

3. **File Organization**:
   - The project is organized into the following main directories:
     - `server`: Contains the backend server code, organized as follows:
       - `routes`: Defines the API endpoints.
       - `controllers`: Contains logic for handling API requests.
       - `models`: Manages the database schema and interactions.
       - `uploads`: Stores uploaded files.
     - `client`: Contains the frontend React application, organized as follows:
       - `components`: Reusable UI elements.
       - `assets`: Images, icons, and other static resources.
       - `pages`: Complete pages used in the application.


4. **Version Control**:
   - Use Git for version control.
   - Write clear and concise commit messages following [Conventional Commits](https://www.conventionalcommits.org/) guidelines.

5. **Whitespace**:
   - Use whitespace to enhance code readability. Ensure whitespace around operators and after commas.

6. **Coding Standards**:
   - Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for JavaScript/React code.

Please ensure your code adheres to these guidelines before submitting a pull request.



## Tech/Framework Used 🧰

JetSetGo is built using the MERN (MongoDB, Express.js, React, Node.js) stack.

### Tool
- **VS Code**

### Frontend
- **React**
- **Bootstrap**
- **Material-UI**

### Backend
- **Node.js** (v18.18.0)
- **Express.js**
- **MongoDB**


## Features ✨ 

#### **User Management**  
- Role-based user registration (Tourist, Tour Guide, Advertiser, Seller, Admin, Tourism Governor).  
- Secure login with username and password.  
- Password recovery with OTP verification via email.  
- Profile management with detailed information for each user role.  

#### **Tourist Features**  
- Search, filter, and sort activities, itineraries, museums, and historical places.  
- Book flights, hotels, and transportation using third-party integrations.  
- Make secure payments using credit/debit cards, wallet balance, or cash on delivery.  
- Earn loyalty points and redeem them as wallet cash.  
- Rate, comment, and review tours, events, itineraries, and products.  
- Manage wishlist and cart for product purchases.  
- File and track complaints against services.  

#### **Tour Guide Features**  
- Create, read, update, and delete itineraries with comprehensive details.  
- Manage bookings and activate/deactivate itineraries.  
- View detailed sales and tourist attendance reports.  
- Receive notifications for flagged itineraries.  

#### **Advertiser Features**  
- Create, read, update, and delete events with details like categories, tags, and pricing.  
- View and filter sales reports to analyze performance.  
- Receive notifications for flagged activities.  

#### **Seller Features**  
- Manage product catalog with images, descriptions, and pricing.  
- Track inventory and receive low-stock notifications.  
- View sales performance reports.  
- Engage with customers through reviews and ratings.  

#### **Tourism Governor Features**  
- Add and update information about museums and historical places.  
- Create and manage tags for categorizing historical locations.  

#### **Admin Features**  
- Approve or reject registrations of tour guides, advertisers, and sellers.  
- Manage activity categories, preference tags, and promo codes.  
- Handle complaints and resolve issues.  
- Generate detailed sales and user statistics reports.  
- Flag and moderate inappropriate content.  

#### **General Features**  
- Notifications for upcoming bookings, flagged content, and important updates.  
- Multi-language support for itineraries and activities.  
- Intuitive search and filtering options for enhanced user experience.  


These features make JetSetGo a comprehensive and user-friendly travel companion.

## Code Examples 🐱‍💻
here are some code examples for developers to have an overview about our implementation

#### register for a new user (as a tourguide):
```javascript
// Create a new Tour Guide instance and save it in the database
    const registerTourGuide = async (req, res) => {
        const { email, username, password, accepted } = req.body;

        try {
            // Check if files were uploaded
            const documentPaths = req.files ? req.files.map(file => file.path) : [];

            // Create new tour guide with documents
            const newTourGuide = await TourGuide.create({
                email,
                username,
                password,
                accepted,
                documents: documentPaths,
            });
                    // Create User
        const user = await User.create({
            username,
            password: password,
            userType: 'TourGuide',
            userDetails: newTourGuide._id,
        });

```

#### login:
```javascript
const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {  
        return res.status(404).json({ error: 'User not found' });
      }
  
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Da el username fel backend : " +username)
      console.log("Da el username bta3 el user msh el sHolder :" + user.username)
      console.log(user.password,password)
      if (user.password!=password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate token with 24-hour expiry
      const token = jwt.sign(
        { id: user.userDetails, userType: user.userType },
        JWT_SECRET,
        { expiresIn: '24h' } // Set expiration to 24 hours
      );
  
      res.json({ token, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      console.log(error.message);
    }
  };


```
#### Tourguide Getting Sales of his itineraries:
```javascript
const getSales = async (req, res) => {
  const { id: ItineraryID } = req.params;  // Destructure product ID from the route parameters
  console.log(ItineraryID)
  try {
    const sales = await SalesIModel.find({ Itinerary: ItineraryID }).sort({ createdAt: -1 }).populate('Tourists');
    res.status(200).json(sales);     // Send the sales data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sales data' });
  }
};

```
#### Tourist marking a notification as read:
```javascript
// Route to mark notifications as read
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read.', details: error.message });
  }
};

```

#### view uploaded documents as an admin from sellers/advertisers/tourguides:
```javascript
const getUploadedDocuments = async (req, res) => {
    try {
        const tourGuides = await TourGuide.find({ accepted: false ,rejected:false }).select('_id username documents');
        const advertisers = await Advertiser.find({ accepted: false ,rejected:false }).select('_id username documents');
        const sellers = await Seller.find({ accepted: false ,rejected:false }).select('_id username documents');
    
        // Combine the results
        const documents = {
          tourGuides: tourGuides.map(tourGuide => ({
            id: tourGuide._id,
            username: tourGuide.username,
            documents: tourGuide.documents
          })),
          advertisers: advertisers.map(advertiser => ({
            id: advertiser._id,
            username: advertiser.username,
            documents: advertiser.documents
          })),
          sellers: sellers.map(seller => ({
            id: seller._id,
            username: seller.username,
            documents: seller.documents
          }))
        };
      // Send the documents as a response
      res.status(200).json(documents);
    } 
    catch (error) {
      res.status(500).json({ error: 'Failed to retrieve documents.' });
    }
  };
```
#### Tourist Navbar in front-end:
```javascript
'use client';

import styles from './Navbar.module.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CurrencyContext } from './CurrencyContext';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ProfileDropdown from './ProfileDropdown';
import Wishlist from '../wishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faArchive,faEdit,faHeart   } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome


const Navbar2 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { currency, setCurrency } = useContext(CurrencyContext);
  const dropdownRef = useRef(null);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const location = useLocation();

  const token = Cookies.get('auth_token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

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
      title: 'Book',
      items: [
        { icon: 'hotel', title: 'Hotels', subText: 'Find and book the best hotels worldwide.', link: '/tourist/book-hotel' },
        { icon: 'plane', title: 'Flights', subText: 'Discover great deals on flights to your destination.', link: '/tourist/book_flight' },
        { icon: 'bus', title: 'Transportation', subText: 'Plan your local and intercity travel with ease.', link: '/tourist/transportbooking' },
      ],
    },
    {
      title: 'Products',
      link: '/tourist/products', 
    },
    ,{
      title:'my orders',
      link: `/tourist/touristOrders/${id}`
    }
  ];
  

  const addToCart = async (productId) => {
    try {
      const response = await fetch(`/api/tourist/cart/${id}/add/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Product added to cart:', data);
        // Optionally, refresh the cart or update the UI here
      } else {
        console.error('Failed to add product to cart:', data.message);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const addProductToWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/tourist/addtoProductWishlist/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Product added to wishlist:', data);
        window.location.reload();
      } else {
        console.error('Failed to add product to wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    }
  };

  const removeProductFromWishlist = async ( productId) => {
    try {
      const response = await fetch(`/api/tourist/removeProductWishlist/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setWishlistedProducts((prev) =>
          prev.filter((product) => product._id !== productId));
        console.log('Product removed from wishlist:', data);
      } else {
        console.error('Failed to remove product from wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  const fetchWishlistProducts = async () => {
    try {
      const response = await fetch(`/api/tourist/getProductWishlist/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (Array.isArray(data.wishlist)) {
        setWishlistedProducts(data.wishlist);   
        if (response.ok) {
          console.log('Wishlist products fetched successfully:', data);
        } else {
          console.error('Failed to fetch wishlist products:', data.message);
        }   
      } else {
        console.error('Expected an array of notifications, but got:', response.data);
        setWishlistedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    }
  };


  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tourist/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching tourist data:', error);
      }
    };
    fetchTouristData();
    fetchWishlistProducts();
  }, [id]);





  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
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

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logo}>
        <Link to="/tourist/home" className={styles.logoLink}>
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
          <div className={styles.actions2}>
          <Wishlist isFilterOpen={isFilterOpen2} toggleFilter={setIsFilterOpen2}>
            <div className={`filter-container ${isFilterOpen2 ? 'open' : ''}`}>
              <div className="filter-header">
                <h2 className='wishlisted-head'>Wishlisted Products</h2>
                <button className="close-btn" onClick={() => setIsFilterOpen2(false)}>
                  &times;
                </button>
              </div>
              <div className="filter-content">
                
                  { wishlistedProducts.map((product) => (
                    <div key={product.product._id} className="wishlist-item">
                      {console.log( product.product.name)}
                      <img
                        src={`http://localhost:8000/${product.product.picture}`}  // Add a fallback image
                        alt={product.product.name}
                        className="wishlist-item-image"
                      />
                      <div className="wishlist-item-info">
                        <h4>{product.product.name}</h4>
                        <button className="addproductbtn" onClick={() => {addToCart(product.product._id)}}>
                          <FontAwesomeIcon icon={faPlus} style={{ height: '13px', width: '13px' }} />
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => removeProductFromWishlist(product.product._id)}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                 
                  
                
              </div>
            </div>
          </Wishlist>
            {/* <Link to="/help" className={styles.iconBox}>
              <i className="fas fa-question"></i>
            </Link> */}
            <Link to="/help" className={styles.iconBox}>
            <i class="fa-regular fa-bell"></i>
            </Link>
            <Link to="/tourist/cart" className={styles.iconBox}>
              <i className="fas fa-shopping-cart"></i>
            </Link>
          </div>


          <select className={styles.currencyChanger} value={currency} onChange={handleCurrencyChange}>
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <div className={styles.profileChanger}>
            <ProfileDropdown />
          </div>
        </div>
    </div>
  );
};

export default Navbar2;

```


#### view itineraries styling in css:
```CSS
  /* General Home and Page Styling */
  .home {
    padding: 20px;
    margin-left: 35px;
    margin-right: 35px;
  }

  /* Search Bar Styling */
  .search-bar {
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 20px;
  }

  .search-bar input {
    width: 50%;
    padding: 10px 15px;
    padding-right: 40px;
    border: 2px solid #ddd;
    border-radius: 20px;
    font-size: 1em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .search-bar input:focus {
    border-color: #0073b1;
    outline: none;
    box-shadow: 0 4px 8px rgba(0, 115, 177, 0.3);
  }

  .search-bar input::placeholder {
    color: #aaa;
    font-style: italic;
  }

  .search-icon {
    position: absolute;
    right: 28.45%;
    color: #aaa;
    font-size: 1.2em;
    pointer-events: none;
  }


  .card-tags{
    margin-bottom: 5px;
  }
  /* Itinerary Cards */
  .tags {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
    gap: 20px;
  }

  .itinerary-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s ease;
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    position: relative; /* Ensure delete button is positioned relative to the card */
  }

  .itinerary-card:hover {
    transform: scale(1.03);
  }

  /* Card Header with Image */
  .card-header {
    height: 180px;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

.addIti{
  margin-left: 10px;
}

  .card-content {
    padding: 15px;
    text-align: left;
  }

  .card-title {
    font-size: 1.4em;
    font-weight: bold;
    margin-bottom: 5px;
  }

  /* Rating Stars */
  .card-rating {
    display: flex;
    flex-direction: row;
    gap: 7px;
    color: #ffc107;
    font-size: 0.9em;
    
  }

  .rating-stars {
    display: flex;
    gap: 4px;
  }

  .star {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .star.full {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='gold'%3E%3Cpath d='M12 .587l3.668 7.568L24 9.423l-6 5.857 1.418 8.203L12 18.897l-7.418 4.586L6 15.28.001 9.423l8.332-1.268z'/%3E%3C/svg%3E");
  }

 .star.half {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='yellow'%3E%3Cpath d='M12 .587l3.668 7.568L24 9.423l-6 5.857 1.418 8.203L12 18.897V.587z'/%3E%3Cpath d='M12 18.897l-7.418 4.586L6 15.28.001 9.423l8.332-1.268z' fill='%23e0e0e0'/%3E%3C/svg%3E");
}
  .star.empty {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e0e0e0'%3E%3Cpath d='M12 .587l3.668 7.568L24 9.423l-6 5.857 1.418 8.203L12 18.897l-7.418 4.586L6 15.28.001 9.423l8.332-1.268z'/%3E%3C/svg%3E");
  }

  .no-ratings {
    font-size: 1.1rem;
    color: #888;
    font-style: italic;
  }

  .card-description {
    font-size: 0.9em;
    color: #555;
    margin-bottom: 10px;
  }

  .card-price {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    /* margin-left: 13px; */
    margin-bottom: 5px;
  }

  .view-more-btn {
    display: block;
    text-align: center;
    padding: 10px;
    background-color: #0839b5;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    border-radius: 15px;
    margin-top: 10px;
  }

  .view-more-btn:hover {
    background-color: #0839b5;
  }

  /* Delete Button (Trash Icon) - Always visible */
  .card-action {
    position: absolute;
    top: 10px; /* Adjusted to be within the card */
    right: 10px; /* Adjusted to be within the card */
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #E26D5C;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border: none;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Dim the background */
    display: flex;
    justify-content: center; /* Center the modal horizontally */
    align-items: center; /* Center the modal vertically */
    z-index: 999; /* Ensure it's on top of everything else */
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center the modal */
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    height: 300px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .modal h2 {
    margin-bottom: 20px;
  }

  .modal p {
    margin-bottom: 20px;
  }

  .modal-actions button {
    width: 100px;
    height: 50px;
    margin: 5px 20px;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }

  .modal-actions button:first-child {
    background-color: #f44336;
    color: white;
  }

  .modal-actions button:first-child:hover {
    background-color: #d32f2f;
  }

  .modal-actions button:last-child {
    background-color: #4CAF50;
    color: white;
  }

  .modal-actions button:last-child:hover {
    background-color: #388e3c;
  }



  .card-action:hover {
    background-color: #E26D5C;
    color: #fff;
  }

```

#### Tourist Model:
```javascript/Stored in MongoDB NOSQL


const mongoose = require('mongoose');
///aaaaaaA11111111111111111111111
const touristSchema = new mongoose.Schema({
      
    addresses: [
        {
          label: String, // e.g., "Home", "Work"
          address: String, // Full address
        },
      ],
      
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ],

    checkouts: [
        {
            deliveryAddress: {
                type: String,
                required: true
            },
            products: [
                {
                    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                    quantity: { type: Number, default: 1 }
                }
            ],
            totalAmount: { type: Number, required: true },
            status: {
                type: String,
                enum: ['pending', 'completed'],
                default: 'pending'
            },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    

    PromoCodesUsed: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PromoCode", // Assuming you have a Tourist model
        },
      ],
   
   
   
    username: { 
        type: String, 
        required: true, 
        unique: true ,
        immutable:true
    },
    email: { type: String, 
        required: true,
         unique: true 
        },
    password: { 
        type: String, 
        required: true 
    },
    mobile: { 
        type: String, 
        required: true 
    },
    nationality: { 
        type: String, 
        required: true 
    },
    dob: { 
        type: Date, 
        required: true ,
        immutable: true
    },  //     Date of Birth (not editable)
    job: { 
        type: String, 
        enum: ['student', 'employee', 'unemployed'],  // List of allowed job types
        required: true
    },
    prefrences:{
        tags: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Tag'
            }],
        budget:{
            from:{type: Number},
            to:{type:Number}
        }    
    },
    wallet: { 
        balance: { 
            type: Number, 
            default: 0 
        },
        transactions: [
            {
                orderId: { 
                    type: String, 
                    required: true 
                },
                amount: { 
                    type: Number, 
                    required: true 
                },
                type: { 
                    type: String, 
                    enum: ['deduction', 'addition'], 
                    required: true 
                },
                orderType: { 
                    type: String, 
                    enum: ['itinerary', 'activity', 'product', 'transportation'], 
                    required: true 
                },
                createdAt: { 
                    type: Date, 
                    default: Date.now 
                }
            }
        ]
    },
    
    deletionRequested: {////////////////////////////////////////////////
        type: Boolean,
        default: false
    },
    TotalPoints: { 
        type: Number, 
        default: 0
    },
    Points: { 
        type: Number, 
        default: 0
    },
    Level: { 
        type: Number,
        enum: [1, 2, 3],  // Only allow values 1, 2, or 3
        default: 1 
    },   
    BookedAnything: {////////////////////////////////////////////////
        type: Boolean,
        default: false
    },
    wishlist: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        }
    ],
    ActivitiesPaidFor : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Activity"  
    }],
    ActivitiesBookmarked : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Activity"  
    }],
    ItinerariesPaidFor : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Itinerary"  
    }],
    ItinerariesBookmarked : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Itinerary"  
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Tourist', touristSchema);


```



## Installation 📥

Follow these steps to set up the project on your local machine:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Advanced-computer-lab-2024/JetSetGo
   ```

2. **Open the Project in Visual Studio Code**

3. **choose view terminal and Setup the Server:**
```
cd sever
npm install
```
4. **Start the Server:**
```
nodemon server.js
```
5. **Open Another Terminal for the Client:**
```
cd client
cd src
npm install
npm install react react-dom
npm install react-bootstrap
npm install @mui/material @emotion/react @emotion/styled
```
6. **Start the Client Application:**
```
npm start
```
7. **Open any web browser and navigate to**
```
http://localhost:3000/
```

## API Reference 📚

<details> <summary>Admin APIs</summary>

#### PATCH /change-password/:id/:modelName
* **Purpose:** Change the password for a user.
* **Authentication:** Required (Admin)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): User ID.
  - `modelName` (path): Model name (e.g., Admin, User).
* **Response:** Success message or error.

#### GET /view-documents
* **Purpose:** View uploaded documents.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of uploaded documents or error message.

#### PATCH /itineraries/:itineraryId/flag
* **Purpose:** Flag an itinerary for review.
* **Authentication:** Required (Admin)
* **HTTP Method:** PATCH
* **Parameters:**
  - `itineraryId` (path): The itinerary ID to be flagged.
* **Response:** Success message or error.

#### GET /itineraries
* **Purpose:** Retrieve all itineraries.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of itineraries or error message.

#### GET /viewComplaints
* **Purpose:** Retrieve all complaints.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of complaints or error message.

#### POST /createtag
* **Purpose:** Create a new preference tag.
* **Authentication:** Required (Admin)
* **HTTP Method:** POST
* **Parameters:** Tag information (body).
* **Response:** Success message or error.

#### PATCH /updatetag
* **Purpose:** Update an existing preference tag.
* **Authentication:** Required (Admin)
* **HTTP Method:** PATCH
* **Parameters:** Tag information (body).
* **Response:** Success message or error.

#### DELETE /deletetag/:id
* **Purpose:** Delete a preference tag.
* **Authentication:** Required (Admin)
* **HTTP Method:** DELETE
* **Parameters:**
  - `id` (path): The tag ID to be deleted.
* **Response:** Success message or error.

#### GET /tag
* **Purpose:** Retrieve all preference tags.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of preference tags or error message.

#### POST /create_category
* **Purpose:** Create a new activity category.
* **Authentication:** Required (Admin)
* **HTTP Method:** POST
* **Parameters:** Category information (body).
* **Response:** Success message or error.

#### PATCH /update_category
* **Purpose:** Update an existing activity category.
* **Authentication:** Required (Admin)
* **HTTP Method:** PATCH
* **Parameters:** Category information (body).
* **Response:** Success message or error.

#### DELETE /delete_category/:id
* **Purpose:** Delete an activity category.
* **Authentication:** Required (Admin)
* **HTTP Method:** DELETE
* **Parameters:**
  - `id` (path): The category ID to be deleted.
* **Response:** Success message or error.

#### GET /category
* **Purpose:** Retrieve all activity categories.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of activity categories or error message.

#### POST /create_tourism_governer
* **Purpose:** Add a new tourism governor.
* **Authentication:** Required (Admin)
* **HTTP Method:** POST
* **Parameters:** Tourism governor information (body).
* **Response:** Success message or error.

#### GET /viewTourismGoverner
* **Purpose:** View all tourism governors.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of tourism governors or error message.

#### POST /add
* **Purpose:** Add a new admin.
* **Authentication:** Required (Admin)
* **HTTP Method:** POST
* **Parameters:** Admin details (body).
* **Response:** Success message or error.

#### DELETE /delete/:modelName/:id
* **Purpose:** Delete a user or model by ID.
* **Authentication:** Required (Admin)
* **HTTP Method:** DELETE
* **Parameters:**
  - `modelName` (path): The model name (e.g., User, Admin).
  - `id` (path): The ID of the user or model to delete.
* **Response:** Success message or error.

#### GET /:role/list
* **Purpose:** Retrieve a list of users by role (e.g., Admin, User).
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:**
  - `role` (path): The user role to list (e.g., Admin, User).
* **Response:** List of users or error message.

#### GET /Products/:id
* **Purpose:** Retrieve product details by ID.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The product ID.
* **Response:** Product details or error message.

#### GET /filterProducts/:id
* **Purpose:** Filter products by ID.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The product ID.
* **Response:** Filtered products or error message.

#### GET /sortByRate/:id
* **Purpose:** Retrieve products sorted by rating.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The product ID.
* **Response:** Sorted products by rating or error message.

#### POST /createProduct
* **Purpose:** Create a new product.
* **Authentication:** Required (Admin)
* **HTTP Method:** POST
* **Parameters:** Product information (body).
* **Response:** Success message or error.

#### PATCH /product/:id
* **Purpose:** Update product information.
* **Authentication:** Required (Admin)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): The product ID.
* **Response:** Success message or error.

#### GET /getSingleProduct/:id
* **Purpose:** Retrieve a single product by ID.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The product ID.
* **Response:** Product details or error message.

#### POST /resolveComplaint
* **Purpose:** Resolve a complaint.
* **Authentication:** Required (Admin)
* **HTTP Method:** POST
* **Parameters:** Complaint resolution details (body).
* **Response:** Success message or error.

#### GET /sales/:id
* **Purpose:** Retrieve sales details by product ID.
* **Authentication:** Required (Admin)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The product ID.
* **Response:** Sales details or error message.

</details>

<details> <summary>Advertiser APIs</summary>

#### PATCH /:id/upload-profile-image
* **Purpose:** Upload a profile image for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): Advertiser ID.
  - `image` (form data): Profile image file.
* **Response:** Success message or error.

#### PATCH /:id/upload-Doc
* **Purpose:** Upload documents for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): Advertiser ID.
  - `image` (form data): Array of document files.
* **Response:** Success message or error.

#### PATCH /change-password/:id/:modelName
* **Purpose:** Change the password for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): Advertiser ID.
  - `modelName` (path): Model name (e.g., Advertiser).
* **Response:** Success message or error.

#### POST /createActivity
* **Purpose:** Create a new activity for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** POST
* **Parameters:** Activity details (body).
* **Response:** Success message or error.

#### PATCH /updateActivity/:id
* **Purpose:** Update an existing activity.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): The activity ID.
* **Response:** Success message or error.

#### GET /
* **Purpose:** Retrieve all activities for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of activities or error message.

#### POST /newTransportation
* **Purpose:** Create new transportation details for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** POST
* **Parameters:** Transportation details (body).
* **Response:** Success message or error.

#### GET /showTransportation
* **Purpose:** Retrieve transportation details for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of transportation details or error message.

#### PATCH /updateTransportation/:id
* **Purpose:** Update transportation details for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): The transportation ID.
* **Response:** Success message or error.

#### DELETE /deleteTransportation/:id
* **Purpose:** Delete a transportation detail for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** DELETE
* **Parameters:**
  - `id` (path): The transportation ID.
* **Response:** Success message or error.

#### PATCH /requestDelete/:id
* **Purpose:** Request account deletion for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): Advertiser ID.
* **Response:** Success message or error.

#### GET /findtransport/:id
* **Purpose:** Find transportation details for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The transportation ID.
* **Response:** Transportation details or error message.

#### GET /findrefdetails/:id/:type
* **Purpose:** Find reference details for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The reference ID.
  - `type` (path): The type of reference.
* **Response:** Reference details or error message.

#### POST /createProfile/:id
* **Purpose:** Create an advertiser profile.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** POST
* **Parameters:**
  - `id` (path): Advertiser ID.
  - Advertiser profile details (body).
* **Response:** Success message or error.

#### PATCH /updateProfile/:id
* **Purpose:** Update an advertiser profile.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): Advertiser ID.
* **Response:** Success message or error.

#### GET /profile/:id
* **Purpose:** Retrieve an advertiser's profile.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): Advertiser ID.
* **Response:** Advertiser profile details or error message.

#### DELETE /deleteAct/delete/:id
* **Purpose:** Delete an activity for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** DELETE
* **Parameters:**
  - `id` (path): Activity ID.
* **Response:** Success message or error.

#### DELETE /:id
* **Purpose:** Delete an activity for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** DELETE
* **Parameters:**
  - `id` (path): Activity ID.
* **Response:** Success message or error.

#### POST /showAll/:id
* **Purpose:** Show all activities for the advertiser.
* **Authentication:** Required (Advertiser)
* **HTTP Method:** POST
* **Parameters:**
  - `id` (path): Advertiser ID.
* **Response:** List of activities or error message.

</details>

<details> <summary>Guest APIs</summary>

#### POST /searchActivityByRating
* **Purpose:** Search activities based on rating.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Activity search criteria (body).
* **Response:** List of activities filtered by rating or error message.

#### POST /searchActivityByDate
* **Purpose:** Search activities based on date.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Activity search criteria (body).
* **Response:** List of activities filtered by date or error message.

#### POST /searchActivityByCategory
* **Purpose:** Search activities based on category.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Activity search criteria (body).
* **Response:** List of activities filtered by category or error message.

#### POST /searchActivityByBudget
* **Purpose:** Search activities based on budget.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Activity search criteria (body).
* **Response:** List of activities filtered by budget or error message.

#### POST /searchItineraryByDate
* **Purpose:** Search itineraries based on date.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Itinerary search criteria (body).
* **Response:** List of itineraries filtered by date or error message.

#### POST /searchItineraryByBudget
* **Purpose:** Search itineraries based on budget.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Itinerary search criteria (body).
* **Response:** List of itineraries filtered by budget or error message.

#### POST /searchItineraryByLanguage
* **Purpose:** Search itineraries based on language.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Itinerary search criteria (body).
* **Response:** List of itineraries filtered by language or error message.

#### POST /searchItineraryByTag
* **Purpose:** Search itineraries based on tag.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Itinerary search criteria (body).
* **Response:** List of itineraries filtered by tag or error message.

#### GET /activities/category/:categoryId
* **Purpose:** Get activities by category.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:**
  - `categoryId` (path): The category ID of activities.
* **Response:** List of activities in the specified category.

#### GET /categories
* **Purpose:** Get all available activity categories.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of all categories.

#### GET /getUpcomingActivities
* **Purpose:** Get upcoming activities.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of upcoming activities.

#### GET /sortActivityByPrice
* **Purpose:** Sort activities by price.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of activities sorted by price.

#### GET /sortActivityByRating
* **Purpose:** Sort activities by rating.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of activities sorted by rating.

#### GET /getUpcomingItineraries
* **Purpose:** Get upcoming itineraries.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of upcoming itineraries.

#### GET /sortItineraryByPrice
* **Purpose:** Sort itineraries by price.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of itineraries sorted by price.

#### GET /sortItineraryByRating
* **Purpose:** Sort itineraries by rating.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of itineraries sorted by rating.

#### GET /getMuseums
* **Purpose:** Get all museums.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of museums.

#### GET /filterMuseumsByTag/:id
* **Purpose:** Filter museums by tag.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The tag ID to filter museums by.
* **Response:** List of museums filtered by tag.

#### GET /getHistoricalLocations
* **Purpose:** Get all historical locations.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of historical locations.

#### GET /filterHistoricalLocationsByTag/:id
* **Purpose:** Filter historical locations by tag.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:**
  - `id` (path): The tag ID to filter historical locations by.
* **Response:** List of historical locations filtered by tag.

</details>

<details> <summary>Product APIs</summary>

#### GET /
* **Purpose:** Get all products.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of all products.

#### GET /filterProducts
* **Purpose:** Filter products based on specific criteria.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** Filter criteria (query params).
* **Response:** List of products matching the filter criteria.

#### GET /sortByRate
* **Purpose:** Sort products by rating.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of products sorted by rating.

#### GET /searchProductName
* **Purpose:** Search products by name.
* **Authentication:** None
* **HTTP Method:** GET
* **Parameters:** Product name (query param).
* **Response:** List of products matching the search name.

#### POST /create
* **Purpose:** Create a new product.
* **Authentication:** Admin or authorized user
* **HTTP Method:** POST
* **Parameters:** Product details (body).
* **Response:** The newly created product or an error message.

#### PATCH /getSingleProduct/:id
* **Purpose:** Get details of a single product by its ID.
* **Authentication:** None
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): The product ID to fetch details for.
* **Response:** Product details or error message.

#### PATCH /:id
* **Purpose:** Update product details.
* **Authentication:** Admin or authorized user
* **HTTP Method:** PATCH
* **Parameters:**
  - `id` (path): The product ID to update.
* **Response:** Updated product details or error message.

</details>

<details> <summary>Registration APIs</summary>

#### POST /registerTourist
* **Purpose:** Register a new tourist user.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** Tourist details (body).
* **Response:** The newly registered tourist or an error message.

#### POST /registerTourGuide
* **Purpose:** Register a new tour guide user with required documents.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** 
  - `documents` (form-data): Required documents for registration.
  - Tour guide details (body).
* **Response:** The newly registered tour guide or an error message.

#### POST /registerAdvertiser
* **Purpose:** Register a new advertiser user with required documents.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** 
  - `documents` (form-data): Required documents for registration.
  - Advertiser details (body).
* **Response:** The newly registered advertiser or an error message.

#### POST /registerSeller
* **Purpose:** Register a new seller user with required documents.
* **Authentication:** None
* **HTTP Method:** POST
* **Parameters:** 
  - `documents` (form-data): Required documents for registration.
  - Seller details (body).
* **Response:** The newly registered seller or an error message.

</details>

<details> <summary>Seller APIs</summary>

#### PATCH /:id/upload-profile-image
* **Purpose:** Upload a profile image for the seller.
* **Authentication:** Required (Seller)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `image` (form-data): The profile image file.
* **Response:** Success or error message.

#### PATCH /:id/upload-Doc
* **Purpose:** Upload documents for the seller.
* **Authentication:** Required (Seller)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `image` (form-data): The documents to upload.
* **Response:** Success or error message.

#### PATCH /requestDelete/:id
* **Purpose:** Request to delete the seller account.
* **Authentication:** Required (Seller)
* **HTTP Method:** PATCH
* **Parameters:** None
* **Response:** Success or error message.

#### PATCH /change-password/:id/:modelName
* **Purpose:** Change the password for the seller account.
* **Authentication:** Required (Seller)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `id` (path parameter): Seller's ID.
  - `modelName` (path parameter): Model name for password change.
* **Response:** Success or error message.

#### POST /create/:id
* **Purpose:** Create a new seller profile.
* **Authentication:** Required (Seller)
* **HTTP Method:** POST
* **Parameters:** Seller profile details (body).
* **Response:** Newly created seller profile or error message.

#### PATCH /update/:id
* **Purpose:** Update the seller profile.
* **Authentication:** Required (Seller)
* **HTTP Method:** PATCH
* **Parameters:** Seller profile update details (body).
* **Response:** Updated seller profile or error message.

#### GET /profile/:id
* **Purpose:** Retrieve the seller profile.
* **Authentication:** Required (Seller)
* **HTTP Method:** GET
* **Parameters:** Seller ID (path parameter).
* **Response:** Seller profile details or error message.

#### GET /Products/:id
* **Purpose:** Retrieve products listed by the seller.
* **Authentication:** Required (Seller)
* **HTTP Method:** GET
* **Parameters:** Seller ID (path parameter).
* **Response:** List of products or error message.

#### GET /filterProducts/:id
* **Purpose:** Filter products listed by the seller.
* **Authentication:** Required (Seller)
* **HTTP Method:** GET
* **Parameters:** Seller ID (path parameter).
* **Response:** Filtered list of products or error message.

#### GET /sortByRate/:id
* **Purpose:** Sort products by rating listed by the seller.
* **Authentication:** Required (Seller)
* **HTTP Method:** GET
* **Parameters:** Seller ID (path parameter).
* **Response:** Sorted list of products or error message.

#### GET /searchProductName
* **Purpose:** Search products by name listed by the seller.
* **Authentication:** Required (Seller)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of products or error message.

#### POST /createProduct
* **Purpose:** Create a new product listing for the seller.
* **Authentication:** Required (Seller)
* **HTTP Method:** POST
* **Parameters:** Product details (body).
* **Response:** Created product or error message.

#### GET /getSingleProduct/:id
* **Purpose:** Retrieve details of a single product.
* **Authentication:** Required (Seller)
* **HTTP Method:** GET
* **Parameters:** Product ID (path parameter).
* **Response:** Product details or error message.

#### PATCH /archieved/:id
* **Purpose:** Archive a product listing.
* **Authentication:** Required (Seller)
* **HTTP Method:** PATCH
* **Parameters:** Product ID (path parameter).
* **Response:** Success or error message.

#### PATCH /product/:id
* **Purpose:** Update product listing details.
* **Authentication:** Required (Seller)
* **HTTP Method:** PATCH
* **Parameters:** Product ID (path parameter) and updated product details (body).
* **Response:** Updated product or error message.

</details>

<details> <summary>Tour Guide APIs</summary>

#### PATCH /:id/upload-profile-image
* **Purpose:** Upload a profile image for the tour guide.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `image` (form-data): The profile image file.
* **Response:** Success or error message.

#### PATCH /:id/upload-Doc
* **Purpose:** Upload documents for the tour guide.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `image` (form-data): The documents to upload.
* **Response:** Success or error message.

#### GET /showAll
* **Purpose:** Retrieve all itineraries created by the tour guide.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of itineraries or error message.

#### PATCH /change-password/:id/:modelName
* **Purpose:** Change the password for the tour guide account.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `id` (path parameter): Tour Guide's ID.
  - `modelName` (path parameter): Model name for password change.
* **Response:** Success or error message.

#### PATCH /requestDelete/:id
* **Purpose:** Request to delete the tour guide account.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** None
* **Response:** Success or error message.

#### PATCH /update/:id
* **Purpose:** Update the tour guide profile.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** Tour Guide profile update details (body).
* **Response:** Updated profile or error message.

#### GET /profile/:id
* **Purpose:** Retrieve the tour guide profile.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** GET
* **Parameters:** Tour Guide ID (path parameter).
* **Response:** Profile details or error message.

#### POST /create/:id
* **Purpose:** Create a new tour guide profile.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** POST
* **Parameters:** Tour Guide profile details (body).
* **Response:** Newly created tour guide profile or error message.

#### POST /createItinerary
* **Purpose:** Create a new itinerary for the tour guide.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** POST
* **Parameters:** Itinerary details (body).
* **Response:** Created itinerary or error message.

#### GET /getItineraries
* **Purpose:** Retrieve all itineraries.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of itineraries or error message.

#### PATCH /updateItinerary/:id
* **Purpose:** Update the details of an itinerary.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** Itinerary ID (path parameter) and updated itinerary details (body).
* **Response:** Updated itinerary or error message.

#### DELETE /deleteItinerary/:id
* **Purpose:** Delete an itinerary.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** DELETE
* **Parameters:** Itinerary ID (path parameter).
* **Response:** Success or error message.

#### PATCH /itineraries/activate/:id
* **Purpose:** Activate an itinerary with bookings.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** Itinerary ID (path parameter).
* **Response:** Activated itinerary or error message.

#### PATCH /itineraries/deactivate/:id
* **Purpose:** Deactivate an itinerary with bookings.
* **Authentication:** Required (Tour Guide)
* **HTTP Method:** PATCH
* **Parameters:** Itinerary ID (path parameter).
* **Response:** Deactivated itinerary or error message.

</details>

<details> <summary>Tourism Governor APIs</summary>

#### PATCH /change-password/:id/:modelName
* **Purpose:** Change the password for the tourism governor account.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `id` (path parameter): Tourism Governor's ID.
  - `modelName` (path parameter): Model name for password change.
* **Response:** Success or error message.

#### POST /newMuseum
* **Purpose:** Create a new museum.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** POST
* **Parameters:** Museum details (body).
* **Response:** Created museum or error message.

#### GET /showMuseum
* **Purpose:** Retrieve all museums.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of museums or error message.

#### PATCH /updateMuseum/:id
* **Purpose:** Update the details of a museum.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** PATCH
* **Parameters:** Museum ID (path parameter) and updated museum details (body).
* **Response:** Updated museum or error message.

#### DELETE /deleteMuseum/:id
* **Purpose:** Delete a museum.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** DELETE
* **Parameters:** Museum ID (path parameter).
* **Response:** Success or error message.

#### POST /newHL
* **Purpose:** Create a new historical location.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** POST
* **Parameters:** Historical location details (body).
* **Response:** Created historical location or error message.

#### GET /showHL
* **Purpose:** Retrieve all historical locations.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of historical locations or error message.

#### PATCH /updateHL/:id
* **Purpose:** Update the details of a historical location.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** PATCH
* **Parameters:** Historical location ID (path parameter) and updated details (body).
* **Response:** Updated historical location or error message.

#### DELETE /deleteHL/:id
* **Purpose:** Delete a historical location.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** DELETE
* **Parameters:** Historical location ID (path parameter).
* **Response:** Success or error message.

#### POST /newTag
* **Purpose:** Create a new tag for categorizing locations.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** POST
* **Parameters:** Tag details (body).
* **Response:** Created tag or error message.

#### GET /tags
* **Purpose:** Retrieve all tags.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of tags or error message.

#### GET /showAll
* **Purpose:** Retrieve all museums and historical places managed by the tourism governor.
* **Authentication:** Required (Tourism Governor)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of museums and historical places or error message.

</details>

<details> <summary>Tourist APIs</summary>

#### GET /mytransports/:touristId
* **Purpose:** Retrieve the transport bookings for a specific tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
* **Response:** List of transport bookings or error message.

#### GET /myactivities/:tourist
* **Purpose:** Retrieve the activity and itinerary bookings for a specific tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `tourist` (path parameter): Tourist's ID.
* **Response:** List of activity and itinerary bookings or error message.

#### POST /newTransportBooking
* **Purpose:** Create a new transport booking.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** Transport booking details (body).
* **Response:** Created transport booking or error message.

#### GET /showTransportBooking
* **Purpose:** Retrieve all transport bookings for a tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of transport bookings or error message.

#### DELETE /deleteTransportBooking/:id
* **Purpose:** Delete a transport booking by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** DELETE
* **Parameters:** 
  - `id` (path parameter): Transport booking ID.
* **Response:** Success or error message.

#### POST /api/tourist/shareViaEmail
* **Purpose:** Share tourist information via email.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** Email and tourist details (body).
* **Response:** Success or error message.

#### GET /activities/category/:categoryId
* **Purpose:** Retrieve activities by category.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `categoryId` (path parameter): Activity category ID.
* **Response:** List of activities in the specified category.

#### GET /categories
* **Purpose:** Retrieve all activity categories.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of activity categories.
  
#### GET /Products
* **Purpose:** Retrieve all products.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of products.

#### GET /filterProducts
* **Purpose:** Filter products based on criteria.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** Filter criteria (query parameters).
* **Response:** Filtered list of products.

#### GET /sortByRate
* **Purpose:** Sort products by rating.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** Sorted list of products by rating.

#### GET /searchProductName
* **Purpose:** Search for products by name.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `productName` (query parameter): Product name.
* **Response:** List of products matching the search query.

#### GET /getSingleProduct/:id
* **Purpose:** Retrieve a single product by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `id` (path parameter): Product ID.
* **Response:** Single product details or error message.

#### GET /activities/booked/:touristId
* **Purpose:** Retrieve all booked activities for a specific tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
* **Response:** List of booked activities.

#### PATCH /update/:id
* **Purpose:** Update tourist's personal information.
* **Authentication:** Required (Tourist)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `id` (path parameter): Tourist's ID.
  - Updated info (body).
* **Response:** Updated tourist information or error message.

#### GET /profile/:id
* **Purpose:** Retrieve a tourist's profile by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `id` (path parameter): Tourist's ID.
* **Response:** Tourist profile or error message.

#### PATCH /requestDelete/:id
* **Purpose:** Request account deletion for a specific tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `id` (path parameter): Tourist's ID.
* **Response:** Success or error message.

#### POST /searchHistoricalPlaceByName
* **Purpose:** Search for historical places by name.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `name` (body): Historical place name.
* **Response:** List of historical places matching the name.

#### POST /searchHistoricalPlaceByTag
* **Purpose:** Search for historical places by tag.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `tag` (body): Tag to search.
* **Response:** List of historical places matching the tag.

#### POST /searchHistoricalPlaceByCategory
* **Purpose:** Search for historical places by category.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `category` (body): Historical place category.
* **Response:** List of historical places in the specified category.

#### POST /getTagIdByName
* **Purpose:** Get the tag ID by name.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `tagName` (body): Tag name.
* **Response:** Tag ID or error message.

#### POST /searchMuseumByTag
* **Purpose:** Search for museums by tag.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `tag` (body): Museum tag.
* **Response:** List of museums matching the tag.

#### POST /searchMuseumByName
* **Purpose:** Search for museums by name.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `name` (body): Museum name.
* **Response:** List of museums matching the name.

#### POST /searchMuseumByCategory
* **Purpose:** Search for museums by category.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `category` (body): Museum category.
* **Response:** List of museums in the specified category.

#### POST /searchActivityByName
* **Purpose:** Search for activities by name.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `name` (body): Activity name.
* **Response:** List of activities matching the name.

#### POST /searchActivityByCategory
* **Purpose:** Search for activities by category.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `category` (body): Activity category.
* **Response:** List of activities in the specified category.

#### POST /searchActivityByTag
* **Purpose:** Search for activities by tag.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `tag` (body): Activity tag.
* **Response:** List of activities matching the tag.

#### POST /searchActivityByRating
* **Purpose:** Search for activities by rating.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `rating` (body): Rating threshold.
* **Response:** List of activities with the specified rating.

#### POST /searchActivityByDate
* **Purpose:** Search for activities by date.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `date` (body): Activity date.
* **Response:** List of activities on the specified date.

#### POST /searchActivityByBudget
* **Purpose:** Search for activities by budget.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `budget` (body): Budget range.
* **Response:** List of activities within the specified budget.

#### POST /searchItineraryByDate
* **Purpose:** Search for itineraries by date.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `date` (body): Itinerary date.
* **Response:** List of itineraries on the specified date.

#### POST /searchItineraryByBudget
* **Purpose:** Search for itineraries by budget.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `budget` (body): Budget range.
* **Response:** List of itineraries within the specified budget.

#### POST /searchItineraryByLanguage
* **Purpose:** Search for itineraries by language.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `language` (body): Itinerary language.
* **Response:** List of itineraries in the specified language.

#### POST /searchItineraryByName
* **Purpose:** Search for itineraries by name.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `name` (body): Itinerary name.
* **Response:** List of itineraries matching the name.

#### POST /searchItineraryByTag
* **Purpose:** Search for itineraries by tag.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `tag` (body): Itinerary tag.
* **Response:** List of itineraries matching the tag.

#### POST /feedback
* **Purpose:** Provide feedback or ratings for activities.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Feedback details (body).
* **Response:** Success or error message.

#### POST /addSales
* **Purpose:** Add sales record for activities.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Sales data (body).
* **Response:** Success or error message.

#### GET /getComplaints/:id
* **Purpose:** Retrieve complaints for a tourist by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `id` (path parameter): Tourist ID.
* **Response:** List of complaints or error message.

#### GET /getUpcomingActivities
* **Purpose:** Retrieve upcoming activities for a tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of upcoming activities.

#### GET /sortActivityByPrice
* **Purpose:** Sort activities by price.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** Sorted list of activities by price.

#### GET /sortActivityByRating
* **Purpose:** Sort activities by rating.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** Sorted list of activities by rating.

#### GET /getUpcomingItineraries
* **Purpose:** Retrieve upcoming itineraries for a tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of upcoming itineraries.

#### GET /sortItineraryByPrice
* **Purpose:** Sort itineraries by price.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** Sorted list of itineraries by price.

#### GET /sortItineraryByRating
* **Purpose:** Sort itineraries by rating.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** Sorted list of itineraries by rating.

#### GET /getMuseums
* **Purpose:** Retrieve all museums for a tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of museums.

#### GET /filterMuseumsByTag/:id
* **Purpose:** Filter museums by tag.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `id` (path parameter): Tag ID.
* **Response:** List of museums matching the tag.

#### GET /getHistoricalLocations
* **Purpose:** Retrieve historical locations for a tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of historical locations.

#### GET /filterHistoricalLocationsByTag/:id
* **Purpose:** Filter historical locations by tag.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `id` (path parameter): Tag ID.
* **Response:** List of historical locations matching the tag.

#### PUT /rating
* **Purpose:** Rate an activity.
* **Authentication:** Required (Tourist)
* **HTTP Method:** PUT
* **Parameters:** 
  - Rating details (body).
* **Response:** Success or error message.

#### GET /get_rating/:_id/:activityId
* **Purpose:** Retrieve a user's rating for an activity.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `_id` (path parameter): User ID.
  - `activityId` (path parameter): Activity ID.
* **Response:** Rating details or error message.

#### POST /bookflight
* **Purpose:** Create a flight booking.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** Flight details (body).
* **Response:** Flight booking confirmation.

#### POST /comment
* **Purpose:** Add a comment to an activity.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `activityId` (body): Activity ID.
  - Comment text (body).
* **Response:** Success or error message.

#### POST /commentcheck/:touristId/:commentId
* **Purpose:** Check if a comment was made by a specific tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
  - `commentId` (path parameter): Comment ID.
* **Response:** Confirmation if the tourist made the comment.

#### DELETE /del_comment
* **Purpose:** Delete a comment from an activity.
* **Authentication:** Required (Tourist)
* **HTTP Method:** DELETE
* **Parameters:** 
  - `commentId` (body): Comment ID.
* **Response:** Success or error message.

#### POST /book_activity_Itinerary
* **Purpose:** Book an activity as part of an itinerary.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Activity and itinerary details (body).
* **Response:** Success or error message.

#### DELETE /cancel_booking
* **Purpose:** Cancel an activity or itinerary booking.
* **Authentication:** Required (Tourist)
* **HTTP Method:** DELETE
* **Parameters:** 
  - `bookingId` (body): Booking ID.
* **Response:** Success or error message.

#### POST /bookhotel
* **Purpose:** Create a hotel booking.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** Hotel booking details (body).
* **Response:** Hotel booking confirmation.

#### POST /addComplaint/:userId
* **Purpose:** Add a complaint for a specific user.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - `userId` (path parameter): User's ID.
  - Complaint details (body).
* **Response:** Success or error message.

#### PATCH /updatePointsToWallet/:touristId
* **Purpose:** Update points in a tourist's wallet.
* **Authentication:** Required (Tourist)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
  - Points to update (body).
* **Response:** Updated wallet points.

#### PATCH /payForItinerary/:touristId
* **Purpose:** Pay for an itinerary.
* **Authentication:** Required (Tourist)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
  - Payment details (body).
* **Response:** Payment confirmation.

#### PATCH /payForActivity/:touristId
* **Purpose:** Pay for an activity.
* **Authentication:** Required (Tourist)
* **HTTP Method:** PATCH
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
  - Payment details (body).
* **Response:** Payment confirmation.

#### GET /tagName/:id
* **Purpose:** Retrieve a tag name by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `id` (path parameter): Tag ID.
* **Response:** Tag name.

#### GET /categoryName/:id
* **Purpose:** Retrieve a category name by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `id` (path parameter): Category ID.
* **Response:** Category name.

#### POST /addRating
* **Purpose:** Add a rating for an activity.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Rating details (body).
* **Response:** Success or error message.

#### POST /addComment
* **Purpose:** Add a comment for an activity.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Comment details (body).
* **Response:** Success or error message.

#### POST /addItineraryRating
* **Purpose:** Add a rating for an itinerary.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Itinerary rating details (body).
* **Response:** Success or error message.

#### POST /addItineraryComment
* **Purpose:** Add a comment for an itinerary.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Itinerary comment details (body).
* **Response:** Success or error message.

#### POST /follow
* **Purpose:** Follow an itinerary.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Itinerary details (body).
* **Response:** Success or error message.

#### POST /unfollow
* **Purpose:** Unfollow an itinerary.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Itinerary details (body).
* **Response:** Success or error message.

#### POST /compeleteWithTourGuide
* **Purpose:** Complete an activity with a tour guide.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Tour guide details (body).
* **Response:** Success or error message.

#### GET /completed/:touristId
* **Purpose:** Retrieve completed tour guides for a specific tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
* **Response:** List of completed tour guides.

#### GET /followed/:touristId
* **Purpose:** Retrieve followed itineraries for a specific tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
* **Response:** List of followed itineraries.

#### GET /getAllTourGuideProfiles
* **Purpose:** Retrieve all tour guide profiles.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** None
* **Response:** List of tour guide profiles.

#### POST /getItinerariesByTourGuide
* **Purpose:** Retrieve itineraries by a specific tour guide.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Tour guide ID (body).
* **Response:** List of itineraries by the tour guide.

#### POST /getSingleItinerary
* **Purpose:** Retrieve a single itinerary.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Itinerary ID (body).
* **Response:** Itinerary details.

#### POST /getTouristUsername
* **Purpose:** Retrieve the username of a tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** POST
* **Parameters:** 
  - Tourist ID (body).
* **Response:** Tourist username.

#### GET /:touristId
* **Purpose:** Fetch tourist data by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
* **Response:** Tourist data.

#### GET /activity/:activityId
* **Purpose:** Fetch activity details by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `activityId` (path parameter): Activity ID.
* **Response:** Activity details.

#### GET /itinerary/:itineraryId
* **Purpose:** Fetch itinerary details by ID.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `itineraryId` (path parameter): Itinerary ID.
* **Response:** Itinerary details.

#### GET /activities/booked/:touristId
* **Purpose:** Fetch booked activities for a tourist.
* **Authentication:** Required (Tourist)
* **HTTP Method:** GET
* **Parameters:** 
  - `touristId` (path parameter): Tourist's ID.
* **Response:** List of booked activities.

</details>

## Testing with Postman
Before testing the API using Postman, make sure **Postman Installed**. Download and install [Postman](https://www.postman.com/downloads/).

Use these test cases to test your code using Postman:



#### **Create Tourist (POST)**

- *Endpoint*: `http://localhost:8000/api/register/registerTourist/`

- *Body Request*:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "Nationality": "Egypt",
  "dob": "1990-01-01",
  "job": "employee",
  "mobile": "1234567890"
}
```
- *Expected Response*:
```json
{
  "_id": "some_generated_id",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "Nationality": "Egypt",
  "dob": "1990-01-01",
  "job": "employee",
  "mobile": "1234567890"
}
```



#### **get products for specific Seller (GET)**

- *Endpoint*: `http://localhost:8000/sellers/Products/:id`

- *Body Request*:

```json
{}  // No request body for GET request
```
- *Expected Response*:
```json
[
  {
    "name": "user_id",
    "description": "description_of_product",
    "createdAt": "2024-05-05",
    "price": "1200",
    "quantityAvailable":"some_number",
    "seller":"seller_id",
    "reviews":"array_of_reviews",
    "archieved":"true/false",
    "Tourists":"list_of_tourists",
    "ratings":"some_number",
    "picture":"some_picture",
  }
] //or empty list []
```

#### **Create an order AS a tourist (POST)**

- *Endpoint*: `http://localhost:8000/api/tourist/createOrder`

- *Body Request*:

```json
{
  "touristID": "6756a5ad6c3d2e7de5332b11",
  "products": [
    {
      "productID": "674ce06e7241d90ab6709734",
      "quantity": 2
    },
    {
      "productID": "63f12b8e9a1c92b6d5a6c3e6",
      "quantity": 1
    }
  ],
  "totalPrice": 150.75,
  "deliveryAddress": "123 Main Street, Springfield",
  "paymentMethod": "Visa"
}


```
- *Expected Response*:
```json
{
    "message": "Order created successfully",
    "order": {
        "touristID": "6756a5ad6c3d2e7de5332b11",
        "deliveryAddress": "123 Main Street, Springfield",
        "products": [
            {
                "productID": "674ce06e7241d90ab6709734",
                "quantity": 2,
                "_id": "67647c422c6b1cec1b6b8b60"
            },
            {
                "productID": "63f12b8e9a1c92b6d5a6c3e6",
                "quantity": 1,
                "_id": "67647c422c6b1cec1b6b8b61"
            }
        ],
        "totalPrice": 150.75,
        "orderStatus": "Pending",
        "paymentMethod": "Visa",
        "_id": "67647c422c6b1cec1b6b8b5f",
        "date": "2024-12-19T20:04:18.051Z",
        "__v": 0
    }
}
```


#### **Change order status as tourist (POST)**

- *Endpoint*: `http://localhost:8000/api/tourist/changeOrderStatus`

- *Body Request*:

```json
{
  "id": "67521c863d843bfeb6547bd5",
  "newStatus": "Paid"
}

```
- *Expected Response*:
```json
{
    "message": "Order status updated successfully",
    "order": {
        "_id": "67521c863d843bfeb6547bd5",
        "touristID": "674b151e13731eecf4cb5e5a",
        "products": [
            {
                "productID": {
                    "_id": "67324d158fdff2e82864e72c",
                    "name": "porsche",
                    "description": "525hp",
                    "price": 200000,
                    "quantityAvailable": 2,
                    "seller": "6702745318ba47b0ce613f05",
                    "picture": "uploads\\1733739059435.jpg",
                    "reviews": [],
                    "archieved": false,
                    "Tourists": [],
                    "ratings": null,
                    "createdAt": "2024-11-11T18:29:41.427Z",
                    "__v": 0
                },
                "quantity": 1,
                "_id": "67521c863d843bfeb6547bd6"
            },
            {
                "productID": {
                    "reviews": [],
                    "archieved": false,
                    "Tourists": [],
                    "_id": "66ff1538b4b8e6aaa752b086",
                    "name": "Wireless Headphones",
                    "description": "  noise-cancelling feature.",
                    "price": 30.99,
                    "quantityAvailable": 50,
                    "seller": "66ff14e7d87f7729749e8a5f",
                    "picture": "https://example.com/images/headphones.jpg",
                    "ratings": 4.5,
                    "createdAt": "2024-10-03T22:05:44.555Z",
                    "__v": 0
                },
                "quantity": 2,
                "_id": "67521c863d843bfeb6547bd7"
            }
        ],
        "totalPrice": 200061.98,
        "orderStatus": "Paid",
        "date": "2024-12-05T21:35:02.653Z",
        "__v": 0,
        "deliveryAddress": "Nasr City",
        "paymentMethod": "Wallet"
    }
}
```


#### ** Get wallet detailes (POST)**

- *Endpoint*: `http://localhost:8000/api/tourist/getWalletDetails`

- *Body Request*:

```json

{
  "touristId": "63f12a4e9a1c92b6d5a6c3e4"
}


```
- *Expected Response*:
```json
{
    "balance": 725043.52,
    "transactions": [
        {
            "orderId": "67521c863d843bfeb6547bd5",
            "amount": 200061.98,
            "type": "deduction",
            "orderType": "product",
            "_id": "67521ca63d843bfeb6547daa",
            "createdAt": "2024-12-05T21:35:34.002Z"
        },
        {
            "orderId": "67521c863d843bfeb6547bd5",
            "amount": 200061.98,
            "type": "addition",
            "orderType": "product",
            "_id": "67521cd73d843bfeb6548130",
            "createdAt": "2024-12-05T21:36:23.305Z"
        },
        {
            "orderId": "67521cf33d843bfeb654843b",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67521cfc3d843bfeb65485af",
            "createdAt": "2024-12-05T21:37:00.846Z"
        },
        {
            "orderId": "67521cf33d843bfeb654843b",
            "amount": 200000,
            "type": "addition",
            "orderType": "product",
            "_id": "67521d213d843bfeb6548869",
            "createdAt": "2024-12-05T21:37:37.196Z"
        },
        {
            "orderId": "67521d953d843bfeb6549105",
            "amount": 1000000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67521d993d843bfeb6549291",
            "createdAt": "2024-12-05T21:39:37.275Z"
        },
        {
            "orderId": "67521d953d843bfeb6549105",
            "amount": 1400000,
            "type": "addition",
            "orderType": "product",
            "_id": "67521dd73d843bfeb6549817",
            "createdAt": "2024-12-05T21:40:39.331Z"
        },
        {
            "orderId": "67521e1d9c0973e7ff5e27a0",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67521e219c0973e7ff5e2944",
            "createdAt": "2024-12-05T21:41:53.783Z"
        },
        {
            "orderId": "67521e1d9c0973e7ff5e27a0",
            "amount": 200000,
            "type": "addition",
            "orderType": "product",
            "_id": "67521e2d9c0973e7ff5e2c5a",
            "createdAt": "2024-12-05T21:42:05.906Z"
        },
        {
            "orderId": "6752230a479b57d54b431da8",
            "amount": 0,
            "type": "deduction",
            "orderType": "product",
            "_id": "6752230c479b57d54b431f58",
            "createdAt": "2024-12-05T22:02:52.980Z"
        },
        {
            "orderId": "67522333479b57d54b4321b3",
            "amount": 0,
            "type": "deduction",
            "orderType": "product",
            "_id": "67522335479b57d54b43236f",
            "createdAt": "2024-12-05T22:03:33.905Z"
        },
        {
            "orderId": "675224298287c7a9891a62b2",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "6752242e8287c7a9891a6486",
            "createdAt": "2024-12-05T22:07:42.666Z"
        },
        {
            "orderId": "675224a68287c7a9891a6d30",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "675224a88287c7a9891a6f16",
            "createdAt": "2024-12-05T22:09:44.169Z"
        },
        {
            "orderId": "675224d94ae795e316ad271f",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "675224dc4ae795e316ad2917",
            "createdAt": "2024-12-05T22:10:36.443Z"
        },
        {
            "orderId": "67522765d3420c1893669c2b",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67522a27d3420c189366ac4e",
            "createdAt": "2024-12-05T22:33:11.325Z"
        },
        {
            "orderId": "67522765d3420c1893669c2b",
            "amount": 200000,
            "type": "addition",
            "orderType": "product",
            "_id": "67522a32d3420c189366aecb",
            "createdAt": "2024-12-05T22:33:22.558Z"
        },
        {
            "orderId": "67522a46d3420c189366b13e",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67522a61d3420c189366b413",
            "createdAt": "2024-12-05T22:34:09.318Z"
        },
        {
            "orderId": "67522a76d3420c189366b754",
            "amount": 0,
            "type": "deduction",
            "orderType": "product",
            "_id": "67522b1bd3420c189366c0c5",
            "createdAt": "2024-12-05T22:37:15.357Z"
        },
        {
            "orderId": "67522b75d3420c189366c68c",
            "amount": 0,
            "type": "deduction",
            "orderType": "product",
            "_id": "67522b92d3420c189366c8d3",
            "createdAt": "2024-12-05T22:39:14.070Z"
        },
        {
            "orderId": "675380c0500ea09a6e593c37",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "675381cea712acf2dd616c90",
            "createdAt": "2024-12-06T22:59:26.556Z"
        },
        {
            "orderId": "675382e2185f1aa470796f5b",
            "amount": 100000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67538310185f1aa470797366",
            "createdAt": "2024-12-06T23:04:48.952Z"
        },
        {
            "orderId": "675383dd906da90532728536",
            "amount": 100000,
            "type": "deduction",
            "orderType": "product",
            "_id": "675383e7906da905327287b9",
            "createdAt": "2024-12-06T23:08:23.163Z"
        },
        {
            "orderId": "67538658c8088f2b02884830",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67538678c8088f2b02884ac5",
            "createdAt": "2024-12-06T23:19:20.224Z"
        },
        {
            "orderId": "67538658c8088f2b02884830",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "6753870e3368cfe6cc4adea2",
            "createdAt": "2024-12-06T23:21:50.073Z"
        },
        {
            "orderId": "67538658c8088f2b02884830",
            "amount": 200000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67538791cf1e4ede2316907c",
            "createdAt": "2024-12-06T23:24:01.350Z"
        },
        {
            "orderId": "67538835c8376fce94b4fd0a",
            "amount": 180000,
            "type": "deduction",
            "orderType": "product",
            "_id": "6753884cc8376fce94b4ffc9",
            "createdAt": "2024-12-06T23:27:08.895Z"
        },
        {
            "orderId": "675382e2185f1aa470796f5b",
            "amount": 200000,
            "type": "addition",
            "orderType": "product",
            "_id": "67538aca7d35847176d199d0",
            "createdAt": "2024-12-06T23:37:46.475Z"
        },
        {
            "orderId": "67522b75d3420c189366c68c",
            "amount": 200000,
            "type": "addition",
            "orderType": "product",
            "_id": "67538add0bd4f4a596ecd602",
            "createdAt": "2024-12-06T23:38:05.189Z"
        },
        {
            "orderId": "67538835c8376fce94b4fd0a",
            "amount": 180000,
            "type": "addition",
            "orderType": "product",
            "_id": "67538b0f0bd4f4a596ecd79c",
            "createdAt": "2024-12-06T23:38:55.588Z"
        },
        {
            "orderId": "67538bbc7394c7b0630b2016",
            "amount": 160000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67538bd37394c7b0630b22f9",
            "createdAt": "2024-12-06T23:42:11.358Z"
        },
        {
            "orderId": "67538c0e7394c7b0630b29d5",
            "amount": 480000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67538c267394c7b0630b2cca",
            "createdAt": "2024-12-06T23:43:34.236Z"
        },
        {
            "orderId": "67538c0e7394c7b0630b29d5",
            "amount": 480000,
            "type": "addition",
            "orderType": "product",
            "_id": "67538c890bd74a055e52f91a",
            "createdAt": "2024-12-06T23:45:13.656Z"
        },
        {
            "orderId": "67538d4033625d123cc28ba3",
            "amount": 160000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67538d4b33625d123cc28eb0",
            "createdAt": "2024-12-06T23:48:27.792Z"
        },
        {
            "orderId": "67538d4033625d123cc28ba3",
            "amount": 160000,
            "type": "addition",
            "orderType": "product",
            "_id": "67538d5b33625d123cc28f70",
            "createdAt": "2024-12-06T23:48:43.586Z"
        },
        {
            "orderId": "67538d9f33625d123cc295b5",
            "amount": 320000,
            "type": "deduction",
            "orderType": "product",
            "_id": "67538da533625d123cc298da",
            "createdAt": "2024-12-06T23:49:57.989Z"
        },
        {
            "orderId": "6754a3b5d89c17b86fc0f70e",
            "amount": 50,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "6755b45dd34b8485573703db",
            "createdAt": "2024-12-08T14:59:41.862Z"
        },
        {
            "orderId": "6754a3b5d89c17b86fc0f70e",
            "amount": 100,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "6755b49fd34b8485573708c6",
            "createdAt": "2024-12-08T15:00:47.382Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755bfb4d34b848557370c90",
            "createdAt": "2024-12-08T15:48:04.419Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755bfb4d34b848557370d1b",
            "createdAt": "2024-12-08T15:48:04.630Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755bfc7d34b8485573710e7",
            "createdAt": "2024-12-08T15:48:23.145Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755bfc7d34b848557371174",
            "createdAt": "2024-12-08T15:48:23.360Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c001d34b84855737154f",
            "createdAt": "2024-12-08T15:49:21.008Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c001d34b8485573715de",
            "createdAt": "2024-12-08T15:49:21.203Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c023d34b84855737178c",
            "createdAt": "2024-12-08T15:49:55.278Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 62,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c033d34b84855737193e",
            "createdAt": "2024-12-08T15:50:11.801Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c11d4f8a33d9070a5f0b",
            "createdAt": "2024-12-08T15:54:05.899Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c48de4c01445471e8339",
            "createdAt": "2024-12-08T16:08:45.615Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c57a10f3f93791ef9f63",
            "createdAt": "2024-12-08T16:12:42.093Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c5c69c18f53fdc190c5c",
            "createdAt": "2024-12-08T16:13:58.518Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 124,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c65f78da770bcadd6071",
            "createdAt": "2024-12-08T16:16:31.590Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 62,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755c68a78da770bcadd623a",
            "createdAt": "2024-12-08T16:17:14.608Z"
        },
        {
            "orderId": "67042e774a59019e0f6ecf4c",
            "amount": 62,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755cbf9c75a3687e8410b3c",
            "createdAt": "2024-12-08T16:40:25.852Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 600,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755d2e43acd329c13d2603a",
            "createdAt": "2024-12-08T17:09:56.470Z"
        },
        {
            "orderId": "6754a3b5d89c17b86fc0f70e",
            "amount": 100,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "6755e490e9287be63c39b8c5",
            "createdAt": "2024-12-08T18:25:20.199Z"
        },
        {
            "orderId": "675383dd906da90532728536",
            "amount": 100000,
            "type": "addition",
            "orderType": "product",
            "_id": "6755e581bbad11473c0eae2f",
            "createdAt": "2024-12-08T18:29:21.801Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6755f1daf52f5710d991e926",
            "createdAt": "2024-12-08T19:22:02.234Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6756006b5f48d0784d6aeb03",
            "createdAt": "2024-12-08T20:24:11.338Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6756006e5f48d0784d6aece0",
            "createdAt": "2024-12-08T20:24:14.495Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675600f75f48d0784d6aeec0",
            "createdAt": "2024-12-08T20:26:31.499Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675600fa5f48d0784d6af0a3",
            "createdAt": "2024-12-08T20:26:34.177Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675600fc5f48d0784d6af289",
            "createdAt": "2024-12-08T20:26:36.064Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675600fe5f48d0784d6af472",
            "createdAt": "2024-12-08T20:26:38.318Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675601005f48d0784d6af65e",
            "createdAt": "2024-12-08T20:26:40.579Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6756173b868de14ca3024c32",
            "createdAt": "2024-12-08T22:01:31.123Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "6756173d868de14ca3024e24",
            "createdAt": "2024-12-08T22:01:33.850Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "67561740868de14ca3025019",
            "createdAt": "2024-12-08T22:01:36.016Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "67561741868de14ca3025211",
            "createdAt": "2024-12-08T22:01:37.979Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "67561744868de14ca302540c",
            "createdAt": "2024-12-08T22:01:40.085Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "67561745868de14ca302560a",
            "createdAt": "2024-12-08T22:01:41.893Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675618e5868de14ca3025c02",
            "createdAt": "2024-12-08T22:08:37.494Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675618e8868de14ca3025e06",
            "createdAt": "2024-12-08T22:08:40.064Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675618f7868de14ca302600d",
            "createdAt": "2024-12-08T22:08:55.161Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "675618fa868de14ca3026217",
            "createdAt": "2024-12-08T22:08:58.099Z"
        },
        {
            "orderId": "670037558e8d5850274a13b9",
            "amount": 75,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "67561913868de14ca3026429",
            "createdAt": "2024-12-08T22:09:23.555Z"
        },
        {
            "orderId": "670037558e8d5850274a13b9",
            "amount": 75,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "67561916868de14ca302663f",
            "createdAt": "2024-12-08T22:09:26.084Z"
        },
        {
            "orderId": "670037558e8d5850274a13b9",
            "amount": 75,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "6756191c868de14ca3026858",
            "createdAt": "2024-12-08T22:09:32.795Z"
        },
        {
            "orderId": "670037558e8d5850274a13b9",
            "amount": 75,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "6756191e868de14ca3026a74",
            "createdAt": "2024-12-08T22:09:34.864Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "67561967868de14ca3026df4",
            "createdAt": "2024-12-08T22:10:47.069Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 1200,
            "type": "deduction",
            "orderType": "activity",
            "_id": "67561994868de14ca3027010",
            "createdAt": "2024-12-08T22:11:32.574Z"
        },
        {
            "orderId": "670037558e8d5850274a13b9",
            "amount": 75,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "6756199c868de14ca3027234",
            "createdAt": "2024-12-08T22:11:40.469Z"
        },
        {
            "orderId": "670037558e8d5850274a13b9",
            "amount": 75,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "67561cab59c6924b26e81a92",
            "createdAt": "2024-12-08T22:24:43.995Z"
        },
        {
            "orderId": "670037558e8d5850274a13b9",
            "amount": 37.5,
            "type": "deduction",
            "orderType": "itinerary",
            "_id": "67561df859c6924b26e81e2c",
            "createdAt": "2024-12-08T22:30:16.959Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 0,
            "type": "addition",
            "orderType": "activity",
            "_id": "675659833ad4d85cf7aaa2b0",
            "createdAt": "2024-12-09T02:44:19.942Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 0,
            "type": "addition",
            "orderType": "activity",
            "_id": "675659923ad4d85cf7aaa370",
            "createdAt": "2024-12-09T02:44:34.585Z"
        },
        {
            "orderId": "6755bf01c5fb2bda1835ebd3",
            "amount": 0,
            "type": "addition",
            "orderType": "activity",
            "_id": "6756ade46c3d2e7de533588f",
            "createdAt": "2024-12-09T08:44:20.063Z"
        },
        {
            "orderId": "6756abf76c3d2e7de533470c",
            "amount": 19,
            "type": "addition",
            "orderType": "product",
            "_id": "6756b0d06c3d2e7de5339437",
            "createdAt": "2024-12-09T08:56:48.880Z"
        },
        {
            "orderId": "6756b1986c3d2e7de5339ca0",
            "amount": 19,
            "type": "deduction",
            "orderType": "product",
            "_id": "6756b1a16c3d2e7de533a120",
            "createdAt": "2024-12-09T09:00:17.899Z"
        },
        {
            "orderId": "6756b1986c3d2e7de5339ca0",
            "amount": 19,
            "type": "deduction",
            "orderType": "product",
            "_id": "6756b1a66c3d2e7de533a2ad",
            "createdAt": "2024-12-09T09:00:22.943Z"
        },
        {
            "orderId": "6756b7896c3d2e7de533b438",
            "amount": 260000,
            "type": "deduction",
            "orderType": "product",
            "_id": "6756b78f6c3d2e7de533b8d6",
            "createdAt": "2024-12-09T09:25:35.427Z"
        }
    ]
}
```


#### **Add itinerary to wishlist (POST)**

- *Endpoint*: `http://localhost:8000/api/tourist/addBookMarked/6754a3b5d89c17b86fc0f70es`

- *Body Request*:

```json
{
  "touristId": "674b151e13731eecf4cb5e5a"
}

```
- *Expected Response*:
```json
{
    "message": "Itinerary bookmarked successfully."
}
```


#### **Apply PromoCode (POST)**

- *Endpoint*: `http://localhost:8000/api/tourist/apply-promo-code`

- *Body Request*:

```json
{
  "promoCodeId": "6751f18c1414d5f2b50c0c34"
}


```
- *Expected Response*:
```json
    "message": "Promo code applied successfully",
    "promoCode": {
        "_id": "6751f18c1414d5f2b50c0c34",
        "discount": 50,
        "Tourist": [],
        "isActive": true,
        "createdAt": "2024-12-05T18:31:40.501Z",
        "__v": 0
    }
}
```

#### **view all products (GET)**

- *Endpoint*: `http://localhost:8000/api/tourist/Products`

- *Body Request*:

```json
{
}


```
- *Expected Response*:
```json
[
    {
        "_id": "6754e726fa197b244fef131d",
        "name": "Momen",
        "description": "testing",
        "price": 19,
        "quantityAvailable": 5,
        "seller": "67477496c55e6c439f300bf4",
        "picture": "uploads\\1733617446529.png",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-12-08T00:24:06.539Z",
        "__v": 0
    },
    {
        "_id": "67464fea3cb7de5a486062df",
        "name": "ferrari",
        "description": "812Hp Rear Wheel drive",
        "price": 812000,
        "quantityAvailable": 1500,
        "seller": "67447a8ec114d8a94658c97e",
        "picture": "uploads\\1732661226603.webp",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-26T22:47:06.614Z",
        "__v": 0
    },
    {
        "_id": "6732c85b5ce0ce625afb406d",
        "name": "kjhghj",
        "description": "kjhjkl",
        "price": 98,
        "quantityAvailable": 6789,
        "seller": "67477496c55e6c439f300bf4",
        "picture": "uploads\\1731381339088.jpeg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-12T03:15:39.089Z",
        "__v": 0
    },
    {
        "_id": "6732bd1801e6490c9f4a397b",
        "name": "234234",
        "description": "434234",
        "price": 44,
        "quantityAvailable": 234342,
        "seller": "6732b43f109032fe0307ccb5",
        "picture": "uploads\\1731378456176.jpeg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-12T02:27:36.177Z",
        "__v": 0
    },
    {
        "_id": "6732bcd101e6490c9f4a3972",
        "name": "43345",
        "description": "6678f765",
        "price": 56789,
        "quantityAvailable": 76545678,
        "seller": "6732b43f109032fe0307ccb5",
        "picture": "uploads\\1731378385842.jpeg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-12T02:26:25.847Z",
        "__v": 0
    },
    {
        "_id": "6732b9b9109032fe0307cd21",
        "name": "iugrtyui",
        "description": "9876",
        "price": 67890,
        "quantityAvailable": 9876,
        "seller": "6732b43f109032fe0307ccb5",
        "picture": "uploads\\1731377593100.jpeg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-12T02:13:13.103Z",
        "__v": 0
    },
    {
        "_id": "6732a824be70823d310aa11e",
        "name": "Aston martin Vantage",
        "description": "4.0L V8 665Hp",
        "price": 260000,
        "quantityAvailable": 4999,
        "seller": "67043d224b400647ae0e235f",
        "picture": "uploads\\1731373092093.jpg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-12T00:58:12.100Z",
        "__v": 0
    },
    {
        "_id": "6732a7c2be70823d310aa11a",
        "name": "vsfuggfd",
        "description": "sdfgddfdggf",
        "price": 456,
        "quantityAvailable": 213312,
        "seller": "67043d224b400647ae0e235f",
        "picture": "uploads\\1731372994315.png",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-12T00:56:34.334Z",
        "__v": 0
    },
    {
        "_id": "6732892ff7156b6c637730c4",
        "name": "Porsche 911 carrera 4S",
        "description": "flat 6 with 400Hp",
        "price": 1450000,
        "quantityAvailable": 10,
        "seller": "6732886ff7156b6c637730bd",
        "picture": "uploads\\1731365167736.webp",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-11T22:46:07.739Z",
        "__v": 0
    },
    {
        "_id": "673250d98fdff2e82864e73c",
        "name": "BMW M5 CS",
        "description": "V8 TWIN TURBO 540Hp AWD",
        "price": 150000,
        "quantityAvailable": 44,
        "seller": "6702745318ba47b0ce613f05",
        "picture": "uploads\\1733679805169.jpeg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-11T18:45:45.860Z",
        "__v": 0
    },
    {
        "_id": "67324d158fdff2e82864e72c",
        "name": "porsche",
        "description": "525hp",
        "price": 200000,
        "quantityAvailable": 1,
        "seller": "6702745318ba47b0ce613f05",
        "picture": "uploads\\1733739059435.jpg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-11T18:29:41.427Z",
        "__v": 0
    },
    {
        "_id": "67324a6c8fdff2e82864e71b",
        "name": "Audi R8",
        "description": "600Hp V10 AWD ",
        "price": 3005500,
        "quantityAvailable": 3,
        "seller": "6702745318ba47b0ce613f05",
        "picture": "uploads\\1733679844398.jpg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-11T18:18:20.444Z",
        "__v": 0
    },
    {
        "_id": "67320a95384ce04036cadb47",
        "name": "Audi R8",
        "description": "NA V10 with 640Hp RW",
        "price": 300000,
        "quantityAvailable": 1000,
        "seller": "66ff152fd87f7729749e8a65",
        "picture": "uploads\\1731332757119.jpg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": 2,
        "createdAt": "2024-11-11T13:45:57.126Z",
        "__v": 0
    },
    {
        "_id": "672e817dca1627964bdf4c81",
        "name": "Porsche GT3RS",
        "description": "PDK transmision with7 speeds",
        "price": 3000000,
        "quantityAvailable": 1,
        "seller": "66ff152fd87f7729749e8a65",
        "picture": "uploads\\1731101053348.jpg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": 4,
        "createdAt": "2024-11-08T21:24:13.351Z",
        "__v": 0
    },
    {
        "_id": "672e8042ca1627964bdf4c7d",
        "name": "Porsche Gt3RS",
        "description": "flat 6 engine with 525hp",
        "price": 3000000,
        "quantityAvailable": 1,
        "seller": "66ff152fd87f7729749e8a65",
        "picture": "uploads\\1731100738643.jpg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": null,
        "createdAt": "2024-11-08T21:18:58.700Z",
        "__v": 0
    },
    {
        "_id": "672e2236bfa360179ebd3b3a",
        "name": "Audi RS7 ",
        "description": "4.0L V8 660hp 4wd",
        "price": 180000,
        "quantityAvailable": 5,
        "seller": "6702745318ba47b0ce613f05",
        "picture": "uploads\\1731076662849.jpg",
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": 5,
        "createdAt": "2024-11-08T14:37:42.857Z",
        "__v": 0
    },
    {
        "_id": "672be4b6062d1fd7e3ad8caf",
        "name": "fgdgsddf",
        "description": "dfsgfsgdfgds",
        "price": 5654,
        "quantityAvailable": 7,
        "seller": "66ff14e7d87f7729749e8a5f",
        "picture": null,
        "reviews": [],
        "archieved": false,
        "Tourists": [],
        "ratings": 4,
        "createdAt": "2024-11-06T21:50:46.446Z",
        "__v": 0
    },
    {
        "reviews": [],
        "Tourists": [],
        "_id": "670942f2951b307d81a28b49",
        "name": "i want",
        "description": "i want to",
        "price": 169,
        "quantityAvailable": 2,
        "seller": "66ff152fd87f7729749e8a65",
        "picture": "uploads\\1728660210368.pdf",
        "ratings": 3,
        "createdAt": "2024-10-11T15:23:30.373Z",
        "__v": 0,
        "archieved": false
    },
    {
        "reviews": [],
        "Tourists": [],
        "_id": "670664f70c449b57490186cc",
        "name": "new newwww",
        "description": "mamama",
        "price": 90,
        "quantityAvailable": 2,
        "seller": "6702745318ba47b0ce613f05",
        "picture": "uploads\\1728472311558.jpg",
        "ratings": 3,
        "createdAt": "2024-10-09T11:11:51.559Z",
        "__v": 0,
        "archieved": false
    },
    {
        "reviews": [],
        "Tourists": [],
        "_id": "670664710c449b57490186bb",
        "name": "new",
        "description": "new new",
        "price": 120,
        "quantityAvailable": 2,
        "seller": "6702b7b3012db37dfed52823",
        "picture": "",
        "ratings": 3,
        "createdAt": "2024-10-09T11:09:37.446Z",
        "__v": 0,
        "archieved": false
    },
    {
        "reviews": [],
        "Tourists": [],
        "_id": "6704506796d475c011cb4d85",
        "name": "regfgbbgbgb",
        "description": "gxbggbfgfbgbf",
        "price": 4444,
        "quantityAvailable": 75555,
        "seller": "66ff1504d87f7729749e8a61",
        "picture": "uploads\\1728335975045.png",
        "ratings": 5,
        "createdAt": "2024-10-07T21:19:35.050Z",
        "__v": 0,
        "archieved": false
    },
    {
        "_id": "66ff1538b4b8e6aaa752b086",
        "name": "Wireless Headphones",
        "description": "  noise-cancelling feature.",
        "price": 30.99,
        "quantityAvailable": 48,
        "seller": "66ff14e7d87f7729749e8a5f",
        "picture": "https://example.com/images/headphones.jpg",
        "ratings": 4.5,
        "createdAt": "2024-10-03T22:05:44.555Z",
        "__v": 1,
        "Tourists": [],
        "archieved": false,
        "reviews": []
    }
]
```

#### **get all complaints on the system as admin (GET)**

- *Endpoint*: `http://localhost:8000/api/admin/viewComplaints`

- *Body Request*:

```json
{
}


```
- *Expected Response*:
```json
  [
    {
        "_id": "6712cf141161d2a795c4a14f",
        "userId": "6702c601367bb353e255fd87",
        "title": "Complaint Title",
        "body": "This is the description of the complaint.",
        "date": "2024-10-13T10:00:00.000Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "6712cf421161d2a795c4a151",
        "userId": "6702c601367bb353e255fd87",
        "title": "Complaint Title 2",
        "body": "This",
        "date": "2024-10-14T10:00:00.000Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": "Not here"
    },
    {
        "_id": "6712cfa11161d2a795c4a153",
        "userId": "6702c760367bb353e255fd8b",
        "title": "Complaint Title 3",
        "body": "This is second id",
        "date": "2024-10-15T10:00:00.000Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "6712cfad1161d2a795c4a155",
        "userId": "6702c760367bb353e255fd8b",
        "title": "Complaint Title 4",
        "body": "This is second idddd",
        "date": "2024-10-16T10:00:00.000Z",
        "status": "pending",
        "__v": 0
    },
    {
        "_id": "6712cfc91161d2a795c4a157",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 5",
        "body": "This is third id",
        "date": "2024-10-17T10:00:00.000Z",
        "status": "pending",
        "__v": 0
    },
    {
        "_id": "6712cfdb1161d2a795c4a159",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 6",
        "body": "This is third idddd",
        "date": "2024-10-18T10:00:00.000Z",
        "status": "pending",
        "__v": 0
    },
    {
        "_id": "67240662a7cab23a29ca93d8",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 7",
        "body": "This is third idddddd",
        "date": "2024-10-19T10:00:00.000Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "6726638b1d4d99dfdc72aeb1",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 7",
        "body": "This is third idddddd",
        "date": "2024-10-19T10:00:00.000Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "67266c8660e6df511243bb8a",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 9",
        "body": "This is third idddddd",
        "date": "2024-10-19T10:00:00.000Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "67290ea60ec6661609f36b38",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 10",
        "body": "This is third idddddd",
        "date": "2024-10-19T10:00:00.000Z",
        "status": "pending",
        "__v": 0
    },
    {
        "_id": "672bce6b503e2b70cb78c0d2",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 11",
        "body": "This is third idddddd",
        "date": "2024-10-19T10:00:00.000Z",
        "status": "pending",
        "__v": 0
    },
    {
        "_id": "672bce75503e2b70cb78c0d5",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "Complaint Title 12",
        "body": "This is third idddddd",
        "date": "2024-10-19T10:00:00.000Z",
        "status": "pending",
        "__v": 0
    },
    {
        "_id": "672bd483503e2b70cb78c0d8",
        "userId": "6702cd0e367bb353e255fd8d",
        "title": "sdf",
        "body": "sdf",
        "date": "2024-11-06T20:41:39.675Z",
        "status": "pending",
        "__v": 0
    },
    {
        "_id": "672d4e00cfa8f3620eec5e73",
        "userId": "6702c601367bb353e255fd87",
        "title": "khg",
        "body": ",jhh",
        "date": "2024-11-07T23:32:16.743Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": "roo7 ekhbat dema8ak fel 7eet"
    },
    {
        "_id": "672d4e27cfa8f3620eec5e7a",
        "userId": "6702c601367bb353e255fd87",
        "title": "qqqqqqqqqqqqq",
        "body": "qqqqqqqqqqqq",
        "date": "2024-11-07T23:32:55.564Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": "fdsgfgdf"
    },
    {
        "_id": "6730a148e0b9cf1f661176c5",
        "userId": "670255f97b12bc9e3f1c7f26",
        "title": "afdgdsf",
        "body": "dfgdsfgsd",
        "date": "2024-11-10T12:04:24.293Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "6730a181e0b9cf1f661176c8",
        "userId": "670255f97b12bc9e3f1c7f26",
        "title": "dfgdsdfg",
        "body": "fdsggsd",
        "date": "2024-11-10T12:05:21.996Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": "dfgsdgf"
    },
    {
        "_id": "673117e7cc9a349c5a25624c",
        "userId": "6702c601367bb353e255fd87",
        "title": "dodge challenger hellCat",
        "body": "5.0L SuperCharged V8 with 700HP",
        "date": "2024-11-10T20:30:31.192Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "6732708b1a6aac0cc8865fcc",
        "userId": "673250765b860091f453887c",
        "title": "dede",
        "body": "dddddd",
        "date": "2024-11-11T21:00:59.427Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "673270ab1a6aac0cc8865fdd",
        "userId": "673250765b860091f453887c",
        "title": "lrlrlrl",
        "body": "lflflflf",
        "date": "2024-11-11T21:01:31.982Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": "l;dsl;ajfkasdsda"
    },
    {
        "_id": "6732d667dc69cecff6adf3a3",
        "userId": "6732d64edc69cecff6adf39a",
        "title": "kjbb",
        "body": "knuh",
        "date": "2024-11-12T04:15:35.905Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "6735b8f771a7d62e8e7eec0e",
        "userId": "6735b15571a7d62e8e7ed42f",
        "title": "hyyyy",
        "body": "bodyyyyyy",
        "date": "2024-11-14T08:46:47.388Z",
        "status": "resolved",
        "__v": 0,
        "adminResponse": ""
    },
    {
        "_id": "67563191cb60395ce12fa0cc",
        "userId": "675452821ef5ed18fe54ebfb",
        "title": "ana khalas",
        "body": "..................................",
        "date": "2024-12-08T23:53:53.181Z",
        "status": "pending",
        "__v": 0
    }
]
```


#### **gte all activity categories (GET)**

- *Endpoint*: `http://localhost:8000/api/admin/category`

- *Body Request*:

```json
{

}


```
- *Expected Response*:
```json
[
    {
        "_id": "6701d237264948719cc99181",
        "name": "Beaches",
        "description": "places with sea",
        "createdAt": "2024-10-05T23:56:39.613Z",
        "__v": 0
    },
    {
        "_id": "6706af4d002328def67ac071",
        "name": "Category",
        "description": "Description",
        "createdAt": "2024-10-09T16:29:01.981Z",
        "__v": 0
    },
    {
        "_id": "674f43c6f080c20d7ee5e45d",
        "name": "Mountains",
        "description": "Large and Rocky",
        "createdAt": "2024-12-03T17:45:42.421Z",
        "__v": 0
    },
    {
        "_id": "674f5ca5f080c20d7ee5e485",
        "name": "Lakes",
        "description": "Like the sea but smaller and not salty",
        "createdAt": "2024-12-03T19:31:49.584Z",
        "__v": 0
    }
]
```

#### **Get all tourismGoverners on the system (GET)**

- *Endpoint*: `http://localhost:8000/api/admin/`

- *Body Request*:

```json
{

}


```
- *Expected Response*:
```json
 [
    {
        "_id": "670667940c449b574901882b",
        "username": "tourrrrrr",
        "password": "rabena wa7ed",
        "email": "roooorrrrrr@aaaaaaaa",
        "createdAt": "2024-10-09T11:23:00.657Z",
        "__v": 0
    },
    {
        "_id": "6732afbdf213878ead43cabd",
        "username": "porsche",
        "password": "123",
        "email": "porsche@mail.com",
        "createdAt": "2024-11-12T01:30:37.168Z",
        "__v": 0
    },
    {
        "_id": "674295ee97473e8ef482774c",
        "username": "Elgded",
        "password": "Menno",
        "email": "PING@PING",
        "createdAt": "2024-11-24T02:56:46.818Z",
        "__v": 0
    },
    {
        "_id": "67429768e828b12641496d83",
        "username": "Elgdedddd",
        "password": "$2a$10$O3PLplosmUSbtJc7r6C8LeYD5ILmkLU3FQy7DpEucVaAU.bkeWYWi",
        "email": "PING@PINGGG",
        "createdAt": "2024-11-24T03:03:04.017Z",
        "__v": 0
    },
    {
        "_id": "674298f0bbed8f7d99bf4ecc",
        "username": "Elgdeddddddd",
        "password": "Mennoooooooo0000",
        "email": "PING@PINGGGGG",
        "createdAt": "2024-11-24T03:09:36.727Z",
        "__v": 0
    },
    {
        "_id": "6742993c2bac8d12a1e7711f",
        "username": "Elgdeddddddddd",
        "password": "momen",
        "email": "PING@PINGGGGGGGG",
        "createdAt": "2024-11-24T03:10:52.313Z",
        "__v": 0
    },
    {
        "_id": "67465cba15f15a1710754d52",
        "username": "garab",
        "password": "123",
        "email": "momen@gmail.com",
        "createdAt": "2024-11-26T23:41:46.179Z",
        "__v": 0
    },
    {
        "_id": "674f9eefa3c5bdbbf6a085ca",
        "username": "govvv1",
        "password": "cars3",
        "email": "governer@mail.com",
        "createdAt": "2024-12-04T00:14:39.005Z",
        "__v": 0
    }
]
```

#### **Update the discrpiption of a product (PATCH)**

- *Endpoint*: `http://localhost:8000/api/sellers/product/672be4b6062d1fd7e3ad8caf`

- *Body Request*:

```json
{
  "name": "Updated Product Name",
  "description": "Updated description of the product",
  "price": 49.99,
  "quantityAvailable": 100
}


```
- *Expected Response*:
```json
{
    "_id": "672be4b6062d1fd7e3ad8caf",
    "name": "Updated Product Name",
    "description": "Updated description of the product",
    "price": 49.99,
    "quantityAvailable": 100,
    "seller": "66ff14e7d87f7729749e8a5f",
    "picture": null,
    "reviews": [],
    "archieved": false,
    "Tourists": [],
    "ratings": 4,
    "createdAt": "2024-11-06T21:50:46.446Z",
    "__v": 0
}
```

#### **Show all the notifications for a toudguide (GET)**

- *Endpoint*: `http://localhost:8000/api/tour-guides/notifications/all/6746391300c7a4c670e8add7`

- *Body Request*:

```json
{
 
}


```
- *Expected Response*:
```json
[
    {
        "_id": "6756ba556c3d2e7de533bddc",
        "userId": "6746391300c7a4c670e8add7",
        "message": "Your itinerary \"City Exploration Tour\" has been flagged as inappropriate.",
        "read": true,
        "createdAt": "2024-12-09T09:37:25.291Z",
        "__v": 0
    },
    {
        "_id": "675636d713f55996028ded6b",
        "userId": "6746391300c7a4c670e8add7",
        "message": "Your itinerary \"Kylian Mbappe\" has been flagged as inappropriate.",
        "read": true,
        "createdAt": "2024-12-09T00:16:23.329Z",
        "__v": 0
    },
    {
        "_id": "67563616ea2d5afa77c37858",
        "userId": "6746391300c7a4c670e8add7",
        "message": "Your itinerary \"Kylian Mbappe\" has been flagged as inappropriate.",
        "read": true,
        "createdAt": "2024-12-09T00:13:10.881Z",
        "__v": 0
    }
]
```


#### **Request account to be deleted for tourguide (PATCH)**

- *Endpoint*: `http://localhost:8000/api/tour-guides/requestDelete/6746391300c7a4c670e8add7`

- *Body Request*:

```json
{
 
}


```
- *Expected Response*:
```json
{
    "message": "Deletion request submitted successfully."
}
```


#### **Add product to my cart for tourist (POST)**

- *Endpoint*: `http://localhost:8000/api/tourist/cart/6756a5ad6c3d2e7de5332b11/add/674ce06e7241d90ab6709734`

- *Body Request*:

```json
{
 
}


```
- *Expected Response*:
```json
[
    {
        "product": "67324d158fdff2e82864e72c",
        "quantity": 1,
        "_id": "6756a9cd6c3d2e7de5333247"
    },
    {
        "product": "674ce06e7241d90ab6709734",
        "quantity": 1,
        "_id": "6764886f2c6b1cec1b6b8de1"
    }
]
```









## How to use?

Watch this video for a quick overview:  
[Watch Video](https://drive.google.com/file/d/1jww0KyNUs2St5UdGF7PPUR7q063hatKT/view?usp=drive_link)

#### **Getting Started**  
1. Visit the website and log in using your username and password.  
2. If you're a new user, sign up by selecting your role (Tourist, Tour Guide, Advertiser, Seller) and providing the required details.  
3. Verify your email address and upload any necessary documents (if applicable).  

#### **For Tourists**  
1. **Explore Activities and Itineraries**: Use the search bar or filters to find events, tours, or historical places.  
2. **Book and Pay**: Select an activity, itinerary, or product and proceed to book or purchase. Payments can be made via credit/debit card, wallet, or cash on delivery.  
3. **Manage Your Experience**: Bookmark favorite activities, view upcoming bookings, and track past purchases.  
4. **Engage with Content**: Rate and comment on tours, products, or events you’ve participated in.  
5. **Earn Rewards**: Redeem loyalty points for wallet cash and enjoy discounts via promo codes.  

#### **For Tour Guides**  
1. **Set Up Your Profile**: Add your details, experience, and credentials.  
2. **Create Itineraries**: Add tours with detailed descriptions, timelines, and pricing.  
3. **Manage Bookings**: Activate or deactivate itineraries as needed and track tourist attendance reports.  
4. **Analyze Performance**: View sales and performance reports to optimize your offerings.  

#### **For Advertisers**  
1. **Create Events**: Add details such as pricing, dates, locations, and categories for your events.  
2. **Track Performance**: View detailed sales and attendance reports for your activities.  
3. **Engage Tourists**: Update your profile and keep event information current to attract more users.  

#### **For Sellers**  
1. **Manage Products**: Add, edit, and archive products with descriptions, prices, and images.  
2. **Track Sales**: Monitor your inventory and receive notifications for low-stock items.  
3. **Engage Customers**: View and respond to reviews and ratings for your products.  

#### **For Tourism Governors**  
1. **Manage Historical Places**: Add and update details for museums and landmarks, including descriptions, images, and ticket prices.  
2. **Create Tags**: Organize locations by type, period, or other relevant categories to improve searchability for tourists.  

#### **For Admins**  
1. **User Management**: Approve or reject registrations for Tour Guides, Advertisers, and Sellers based on submitted documents.  
2. **Content Moderation**: Flag or remove inappropriate events or itineraries.  
3. **System Management**: Create activity categories, preference tags, and promo codes.  
4. **Monitor Performance**: Generate and analyze sales and user statistics reports to ensure system efficiency.  
5. **Resolve Complaints**: Address user complaints and maintain a positive user experience.  

By following these steps, users of all roles can navigate and utilize the platform efficiently, ensuring a seamless and engaging experience.  

## Contribute

We welcome contributions from everyone. Here's how you can contribute:

1. **Fork the Repository**: Start by forking the repository to your own GitHub account.

2. **Clone the Repository**: Clone the forked repository to your local machine.

3. **Create a New Branch**: Always create a new branch for each feature or bug fix you are working on. Never work directly on the `main` branch.

4. **Make Your Changes**: Make your changes or additions in your branch. Be sure to follow the existing code style.

5. **Commit Your Changes**: Commit your changes with a clear and concise commit message.

6. **Push to GitHub**: Push your changes to your fork on GitHub.

7. **Submit a Pull Request**: From your fork, submit a pull request to the `main` branch of the original repository. Describe your changes in the pull request. Link any related issues or pull requests.


## Credits  

This project was made possible with the help of the following resources and contributions:  

1. **[MERN Stack Crash Course Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE)**  
   The tutorial playlist on YouTube provided a comprehensive guide to effectively implementing the MERN Stack in this project.  

2. **Contributors**  
   A heartfelt thanks to all contributors for their invaluable suggestions, bug reports, and code contributions, which significantly enhanced the quality and functionality of this project.  


## License

This project is licensed under the terms of the [MIT License](LICENSE).

By using this project, you agree to abide by the terms outlined in the license. For more information, refer to the [LICENSE](LICENSE) file in the repository.
