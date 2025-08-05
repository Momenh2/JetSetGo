
import React, { useState, useEffect } from 'react';
//import NavBar from '../../components/Tourist/navbar';
import './homepage.css';

import { FaStar,FaHotel,FaUmbrellaBeach, FaFacebookF, FaTwitter, FaInstagram, FaLandmark } from "react-icons/fa";

import { Plane,Bed,Store, Users, Building2, ShoppingBag } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Olivia Martinez",
    location: "Barcelona, Spain",
    review: "The trip was absolutely amazing! Everything was well-organized, and I felt like a VIP throughout.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Liam Johnson",
    location: "New York, USA",
    review: "From start to finish, the experience was seamless. The guides were knowledgeable, and the service was top-notch!",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 3,
    name: "Sophia Wang",
    location: "Sydney, Australia",
    review: "Every detail of our trip was thoughtfully planned. I discovered so many hidden gems. Highly recommend!",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
];

function GuestPage() {

  const [destinations, setDestinations] = useState(0);
  const [partners, setPartners] = useState(0);
  const [sellers, setSellers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDestinations((prev) => (prev < 928 ? prev + 1 : prev));
      setPartners((prev) => (prev < 1020 ? prev + 1 : prev));
      setSellers((prev) => (prev < 540 ? prev + 1 : prev));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  

  return (
    <div>
        {/* <NavBar /> */}
	<div className="Homebody">
		<div className="heaading">
			<h1>Plan your next trip with us</h1>
			<br />
			<p className='tittle'>Plan your perfect getaway with our  travel planner, tailored for holidays, business trips, and spontaneous adventures.
         </p>
			<br />
			<br />
			<br></br>
			<a href="#" className='linktostart'>Create your trip</a>
		</div>
		
	</div>
	

  <div className="moreAboutUs">
      <div className="moreAboutUsBox">
        <div className="row">
          <div className="infoBox">
            <Plane size={80} color="#ffc400" />
            <p>Book flights to where ever you want easily</p>
          </div>
          <div className="infoBox">
            <FaHotel size={80} color="#ffc400" />
            <p>Find the Best Hotels in you stay city</p>
          </div>
          <div className="infoBox">
            <FaUmbrellaBeach size={80} color="#ffc400" />
            <p>Book exciting Activities from  various types</p>
          </div>
        </div>
        <div className="row">
          <div className="infoBox">
            <Store size={80} color="#ffc400" />
            <p>Shop online for your Souvenirs</p>
          </div>
          <div className="infoBox">
            <FaLandmark size={80} color="#ffc400" />
            <p>Explore the most known Sites in the city you are in</p>
          </div>
        </div>
      </div>
    </div>

    <div className="statsContainer">
      <h1 >We Are The Most Popular Travel & Tour Company</h1>
      <div className="statsbox1">
        <div className="stat">
          <Building2 size={45} color="#ffc400" />
          <span className="numberStat">{destinations}+ </span>
          <span className="labelStat">Travel Destinations</span>
        </div>
        <div className="stat">
          <Users size={45} color="#ffc400" />
          <span className="numberStat">{partners}+ </span>
          <span className="labelStat">Tour Partners</span>
        </div>
        <div className="stat">
          <ShoppingBag size={45} color="#ffc400" />
          <span className="numberStat">{sellers}+ </span>
          <span className="labelStat">Partnering Sellers</span>
        </div>
      </div>
    </div>

    

    <section className="testimonials">
      <h1>What Our Travelers Say</h1>
      <div className="testimonial-container">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-header">
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-img" />
              <div className="testimonial-name">
                <h3>{testimonial.name}</h3>
                <div className="stars">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} color="#ffc400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="review">{testimonial.review}</p>
          </div>
        ))}
      </div>
    </section>
  

    {/* <div className='moreinfo'>
      <h2>Why Choose Us?</h2>
            <ul>
              <li>Over <span className="highlight-number">900,000</span> places all over the world</li>
              <li>Create personalized itineraries tailored to your preferences and travel style.</li>
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
	  </div>  */}
    

	{/* <div className="quick-access">
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
  </div> */}
      <footer className="footer">
          <div className="footer-container">
            <div className="footer-brand">
              <h2> JETSETGO</h2>
              <p>Copyright © JETSETGO 2025 All rights reserved</p>
            </div>

            <div className="footer-links">
              <div className="footer-section">
                <h4>MENU</h4>
                <ul>
                  <li><a href="#">Historical Places</a></li>
                  <li><a href="#">Activities</a></li>
                  <li><a href="#">Itineraries</a></li>
                  <li><a href="#">Products</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h4>INFORMATION</h4>
                <ul>
                  <li><a href="#">FAQs</a></li>
                  <li><a href="#">Terms & Conditions</a></li>
                  <li><a href="#">Privacy</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h4>CONTACT INFO</h4>
                <p>+20 1003004000</p>
                <p>info@JETSETGO.com</p>
                <p>ElSherouk, Cairo, Egypt</p>
                <div className="social-icons">
                  <a href="#"><FaFacebookF /></a>
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaInstagram /></a>
                </div>
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
}
export default GuestPage;
