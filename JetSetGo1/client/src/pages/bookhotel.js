import React, { useState, useEffect } from "react";
import AccommodationApp from "../components/AccommodationApp";
import { useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

const Booking = ({ touristId }) => {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [decodedTouristId, setDecodedTouristId] = useState(null);
  const [modelName, setModelName] = useState(null);

  useEffect(() => {
    // Simulate data fetching or processing
    try {
      const token = Cookies.get("auth_token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setDecodedTouristId(decodedToken.id);
        setModelName(decodedToken.userType);
        touristId = decodedToken.id;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
      setIsLoading(false); // Loading is complete
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        {/* <p>Loading...</p> Replace this with a spinner or skeleton loader if desired */}
      </div>
    );
  }

  return (
    <div className="home">
      {/* Content is displayed only after loading */}
      <AccommodationApp touristId={decodedTouristId || touristId} />
    </div>
  );
};

export default Booking;