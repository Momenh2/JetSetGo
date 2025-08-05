import React from 'react';
import NavBar from '../../components/Tourist/navbar';
//import './guestHomepage.css';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

function ToursitPage() {
  const location = useLocation(); // Access the location object
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id; // Access the id from state
  console.log("id home:",id);

  return (
    <div>

      <div className="body">
        <div className="heaading">
          <h1>Plan your next trip with us</h1>
          <br />
          <p className='tittle'>Plan your perfect getaway with our free AI-powered travel planner, tailored for holidays, business trips, and spontaneous adventures.
            Ensuring every journey is memorable and uniquely yours.</p>
          <br />
          <br />
          <br></br>
          <a href="#">Create your trip</a>
        </div>

      </div>
      {/* <div className='moreinfo'>
	<h2>Why Choose Us?</h2>
        <ul>
          <li>Over <span className="highlight-number">900,000</span> places all over the world</li>
          <li>Create personalized itineraries tailored to your preferences and travel style.</li>
          <li>Get AI-powered recommendations for the best destinations, accommodations, and activities.</li>
          <li>Read reviews from other travelers to find the best places to visit.</li>
          <li>Stay informed with real-time updates on weather, travel advisories, and local events.</li>
          <li>Plan trips that fit your budget with our cost estimation and expense tracking features.</li>
          <li>Discover hidden gems and local insights to make your trip unforgettable.</li>
          <li>Enjoy our service in multiple languages for a seamless experience.</li>
        </ul>
		<br></br>
		<br></br>
		<a href="#">Create your trip</a>
		<br></br>
		<br></br>
	</div> */}
      <div className="quick-access">
        <div className="quick-card">
          <h3>Explore Destinations</h3>
          <img src="/images/gt3Rs.jpg" alt="Explore" className="card-image" />
        </div>
        <div className="quick-card">
          <h3>Plan Destinations</h3>
          <img src="/images/AudiRs7.jpg" alt="Plan" className="card-image" />
        </div>
        <div className="quick-card">
          <h3>View My Itinerary</h3>
          <img src="/images/gt3rs2.jpg" alt="Itinerary" className="card-image" />
        </div>
      </div>
      <div className="footer">
        <a href="#">Copyright</a>
        <a href="#">Terms and Conditions</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Cookies</a>
        <a href="#">Complaints</a>
      </div>
    </div>
  );
}
export default ToursitPage;
