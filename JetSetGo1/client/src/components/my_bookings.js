import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import EventCard from './EventCard';
import { FaTable, FaMapMarker, FaExpand, FaTrash, FaArrowRight, FaTag } from "react-icons/fa";
import LoadingScreen from './loading';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

// Example usage
const formattedDate = formatDate("2024-11-18T00:00:00.000Z");
console.log(formattedDate); // Output: 18-11-2024

const MyBookingsPage = () => {
  const [transportBookings, setTransportBookings] = useState([]);
  const [activityBookings, setActivityBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transportDetails, setTransportDetails] = useState({});
  const [activityDetails, setActivityDetails] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (err) {
        setError('Invalid token');
        setLoading(false);
      }
    } else {
      setError('Please log in to view your bookings.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchBookings = async () => {
        try {
          console.log("userId:", userId);
          const [transportResponse, activityResponse] = await Promise.all([
            fetch(`http://localhost:3000/api/tourist/mytransports/${userId}`),
            fetch(`http://localhost:3000/api/tourist/myactivities/${userId}`)
          ]);

          const transportData = await transportResponse.json();
          const activityData = await activityResponse.json();

          // Safely handle null or undefined values
          // Set the state with default empty arrays if data is null or undefined
          setTransportBookings(Array.isArray(transportData) ? transportData : []); // Ensure it's an array
setActivityBookings(Array.isArray(activityData) ? activityData : []);

await Promise.all([
  ...(Array.isArray(transportData) ? transportData : []).map(booking => fetchTransportDetails(booking.transportationId)),
  ...(Array.isArray(activityData) ? activityData : []).map(booking => fetchActivityOrItineraryDetails(booking.referenceId, booking.referenceType)),
]);




          setLoading(false);
        } catch (err) {
          setError('Error fetching bookings');
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [userId]);

  const fetchTransportDetails = async (transportationId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/advertisers/findtransport/${transportationId}`);
      const details = await response.json();
      setTransportDetails(prevDetails => ({
        ...prevDetails,
        [transportationId]: details,
      }));
    } catch (err) {
      console.error('Error fetching transport details:', err);
    }
  };

  const fetchActivityOrItineraryDetails = async (referenceId, referenceType) => {
    try {
      const response = await fetch(`http://localhost:3000/api/advertisers/findrefdetails/${referenceId}/${referenceType}`);
      const details = await response.json();
      setActivityDetails(prevDetails => ({
        ...prevDetails,
        [`${referenceId}-${referenceType}`]: details,
      }));
    } catch (err) {
      console.error('Error fetching activity/itinerary details:', err);
    }
  };

  const combinedBookings = [
    ...(transportBookings ?? []).map(booking => {
      const transportDetail = transportDetails[booking.transportationId];
      const isCar = transportDetail?.vehicle === 'car';
      const isBus = !isCar;

      console.log("isBus:", isBus, "isCar:", isCar);

      return {
        id: booking.transportationId,
        bookingid: booking._id,
        date: booking.date,
        event: "Transportation",
        referenceType: transportDetail?.vehicle || 'Unknown Vehicle',
        schedule: formatDate(booking?.date) || 'N/A',
        location: isBus
          ? transportDetail?.bLocation?.pickup + "->" + transportDetail?.bLocation?.dropoff || 'N/A'
          : transportDetail?.cLocation || 'N/A',
        status: "Booked",
        pickup: isBus ? transportDetail?.bLocation?.pickup || 'N/A' : null,
        dropoff: isBus ? transportDetail?.bLocation?.dropoff || 'N/A' : null,
        carModel: isCar ? transportDetail?.carModel || 'N/A' : booking.seats,
        deadline: booking.date,
        touristid: userId,
      };
    }),
    ...(activityBookings ?? []).map(booking => {
      const isActivity = booking.referenceType === "Activity";
      const activityDetail = activityDetails[`${booking.referenceId}-${booking.referenceType}`];

      return {
        id: booking.referenceId,
        bookingid: booking._id,
        date: isActivity
          ? activityDetail?.date
          : activityDetail?.availableDates?.[0]?.date || 'N/A', // Get the first available date for Itinerary
        event: "Activity",
        referenceType: booking.referenceType,
        schedule: isActivity
          ? activityDetail?.title || 'N/A'
          : activityDetail?.title || 'N/A',
        location: isActivity
          ? activityDetail?.location || 'N/A'
          : activityDetail?.pickupLocation || 'N/A',
        status: "Booked",
        touristid: userId,
        carModel: isActivity
          ? formatDate(activityDetail?.date)
          : formatDate(activityDetail?.availableDates?.[0]?.date) || 'N/A',
      };
    }),
  ];


  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  const containerStyle_22 = {
    margin: '0 auto',
    padding: '1rem',
    maxWidth: '1400px',
    // backgroundColor: '#f8f9fa', // Light background color
    // borderRadius: '8px',        // Rounded corners
    // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
  };

  return (
    <div style={containerStyle_22}>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <EventCard events={combinedBookings} />
    </div>
  );
};

export default MyBookingsPage;
