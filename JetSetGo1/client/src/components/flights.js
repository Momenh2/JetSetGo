// import React, { useState } from 'react';
// import axios from 'axios';
// export const FlightSearch = ({ touristId }) => {
//     const [flights, setFlights] = useState([]);
//     const [origin, setOrigin] = useState('');
//     const [destination, setDestination] = useState('');
//     const [departureDate, setDepartureDate] = useState('');
//     const [returnDate, setReturnDate] = useState('');
//     const [adults, setAdults] = useState(1);
//     const [loading, setLoading] = useState(false);
//     // Fetch flights from the backend API
//     const fetchFlights = async () => {
//         setLoading(true); // Show loading indicator
//         try {
//             const response = await axios.get("http://localhost:8000/api/flights", {
//                 params: {
//                     originLocationCode: origin,
//                     destinationLocationCode: destination,
//                     departureDate,
//                     returnDate,
//                     adults,
//                 },
//             });
//             setFlights(response.data.data);
//         } catch (error) {
//             console.error("Error fetching flights:", error);
//         } finally {
//             setLoading(false); // Hide loading indicator
//         }
//     };
//     // Extra function for each flight data
//     const handleExtraAction = async (flight) => {
//         console.log(flight);
//         try {
//             const response = await axios.post("http://localhost:8000/api/tourist/bookflight", {
//                 touristId,
//                 flightId: flight.id,
//                 origin: flight.source,  // Ensure `origin` is set
//                 destination: flight.destination,
//                 departureDate: flight.itineraries[0].segments[0].departure.at,
//                 returnDate: flight.returnDate || null,
//                 price: flight.price?.total || 0,
//                 duration: flight.itineraries[0].duration,
//             });
//             if (response.status === 201) {
//                 alert("Flight booked successfully!");
//             }
//         } catch (error) {
//             console.error("Error booking flight:", error.message);
//             alert(error.message);
//         }
//     };
//     return (
//         <div style={styles.container}>
//             {/* Blue Background */}
//             <div style={styles.header}>
//                 <h1 style={styles.title}>Search Your Flight</h1>
//             </div>
//             {/* Search Inputs */}
//             <div style={styles.searchBar}>
//                 <input
//                     type="text"
//                     placeholder="Origin (IATA Code)"
//                     value={origin}
//                     onChange={(e) => setOrigin(e.target.value)}
//                     style={styles.input}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Destination (IATA Code)"
//                     value={destination}
//                     onChange={(e) => setDestination(e.target.value)}
//                     style={styles.input}
//                 />
//                 <input
//                     type="date"
//                     placeholder="Departure Date"
//                     value={departureDate}
//                     onChange={(e) => setDepartureDate(e.target.value)}
//                     style={styles.input}
//                 />
//                 <input
//                     type="date"
//                     placeholder="Return Date (Optional)"
//                     value={returnDate}
//                     onChange={(e) => setReturnDate(e.target.value)}
//                     style={styles.input}
//                 />
//                 <input
//                     type="number"
//                     placeholder="Adults"
//                     value={adults}
//                     onChange={(e) => setAdults(Number(e.target.value))}
//                     min="1"
//                     max="9"
//                     style={styles.input}
//                 />
//                 <button onClick={fetchFlights} style={styles.button}>Search Flights</button>
//             </div>
//             {/* Loading Indicator */}
//             {loading && <p style={styles.loading}>Loading...</p>}
//             {/* Flight Results */}
//             <div style={styles.results}>
//                 {flights.length > 0 ? (
//                     flights.map((flight, index) => (
//                         <div key={index} style={styles.flightCard}>
//                             <p><strong>Flight ID:</strong> {flight.id}</p>
//                             <p><strong>Price:</strong> {flight.price?.total || 'N/A'}</p>
//                             <p><strong>Departure:</strong> {flight.itineraries[0].segments[0].departure.at}</p>
//                             <p><strong>Arrival:</strong> {flight.itineraries[0].segments[0].arrival.at}</p>
//                             <p><strong>Duration:</strong> {flight.itineraries[0].duration}</p>
//                             <button onClick={() => handleExtraAction(flight)} style={styles.extraButton}>
//                                 Booking
//                             </button>
//                         </div>
//                     ))
//                 ) : (
//                     !loading && <p style={styles.noResults}>No flights found. Please search to see results.</p>
//                 )}
//             </div>
//         </div>
//     );
// };
// const styles = {
//     container: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#ADD8E6', // Baby blue background
//       padding: '20px',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//     },
//     header: {
//       width: '100%',
//       textAlign: 'center',
//       marginBottom: '20px',
//       color: '#fff',
//     },
//     title: {
//       fontSize: '2em',
//       fontWeight: 'bold',
//       textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
//     },
//     searchBar: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       padding: '20px',
//       borderRadius: '8px',
//       background: 'linear-gradient(135deg, #1e3c72, #2a5298)', // Blue gradient background for search bar
//       width: '100%',
//       maxWidth: '600px',
//       color: '#fff',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     },
//     input: {
//       width: '100%',
//       padding: '10px',
//       margin: '5px 0',
//       borderRadius: '4px',
//       border: '1px solid #ddd',
//     },
//     button: {
//       padding: '10px 20px',
//       margin: '10px 5px',
//       backgroundColor: '#0071c2',
//       color: '#fff',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '16px',
//     },
//     results: {
//       width: '100%',
//       maxWidth: '600px',
//       marginTop: '20px',
//     },
//     loading: {
//       color: '#0071c2',
//       fontSize: '1.2em',
//       marginTop: '10px',
//     },
//     flightCard: {
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       padding: '15px',
//       margin: '10px 0',
//       backgroundColor: '#fff',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
//     },
//     extraButton: {
//       padding: '8px 16px',
//       backgroundColor: '#34a853',
//       color: '#fff',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '14px',
//       marginTop: '10px',
//     },
//     noResults: {
//       textAlign: 'center',
//       color: '#888',
//     },
//   };
// export default FlightSearch;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faDollarSign, faClock, faArrowRight, faHourglassHalf, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavBar from './Tourist/navbar';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import back from './back/flight2.jpg';
import FlightPass from './flightpass';
import { color } from 'framer-motion';
// import { ToastContainer } from 'react-toastify';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDate = (isoDateString) => {
    if (!isoDateString) return 'Invalid Date';
    const date = new Date(isoDateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Function to parse and format a duration string like PT7H20M into a readable string
  const formatDuration = (durationString) => {
    if (!durationString) return 'Invalid Duration';
  
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = durationString.match(regex);
  
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
  
    return `${hours} hours ${minutes} minutes`;
  };
  
export const FlightSearch = ({ touristId }) => {
    const location = useLocation(); // Access state passed via Link
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    console.log("id:", id);
    const modelName = decodedToken.userType;
    console.log("modelName:", modelName);
    // const { id } = location.state || {}; // Access id from state
    touristId = id;
    const [flights, setFlights] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [loading, setLoading] = useState(false);
    console.log("touristId" + touristId);
    // Fetch flights from the backend API
    const fetchFlights = async () => {
        setLoading(true); // Show loading indicator
        try {
            const response = await axios.get("http://localhost:8000/api/flights", {
                params: {
                    originLocationCode: origin,
                    destinationLocationCode: destination,
                    departureDate,
                    returnDate: departureDate, // Set returnDate to departureDate
                    adults,
                },
            });
            setFlights(response.data.data);
        } catch (error) {
            console.error("Error fetching flights:", error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Extra function for each flight data
    const handleExtraAction = async (flight) => {
        console.log(flight);
        try {
            const response = await axios.post("http://localhost:8000/api/tourist/bookflight", {
                touristId,
                flightId: flight.id,
                origin: flight.source,
                destination: flight.destination,
                departureDate: flight.itineraries[0].segments[0].departure.at,
                returnDate: flight.itineraries[0].segments[0].departure.at, // Set returnDate same as departureDate
                price: flight.price?.total || 0,
                duration: flight.itineraries[0].duration,
            });

            if (response.status === 201) {
                // alert("Flight booked successfully!");
                toast.success("Flight booked successfully!");
            }
        } catch (error) {
            console.error("Error booking flight:", error.message);
            // alert(error.message);
            toast.error("Error booking flight:", error.message);
        }
    };

    return (
        <div style={styles.container_mark2}>
            <ToastContainer />
            {/* <NavBar /> */}
            <br />
            {/* Blue Background */}
            <div style={styles.header_mark2}>
                <h1 style={styles.title_mark2}>Search Your Flight</h1>
            </div>
    
            {/* Search Inputs */}
            <div style={styles.searchBar_mark2}>
                <input
                    type="text"
                    placeholder="Origin (IATA Code)"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    style={styles.input_mark2}
                />
                <input
                    type="text"
                    placeholder="Destination (IATA Code)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    style={styles.input_mark2}
                />
                <input
                    type="date"
                    placeholder="Departure Date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    style={styles.input_mark2}
                />
                <input
                    type="number"
                    placeholder="Adults"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    min="1"
                    max="9"
                    style={styles.input_mark2}
                />
                <button onClick={fetchFlights} style={styles.button_mark2}>Search Flights</button>
            </div>
    
            {/* Loading Indicator */}
            {loading && <p style={styles.loading_mark2}>Loading...</p>}
    
            {/* Flight Results */}
            <div style={styles.results_mark2}>
                {flights.length > 0 ? (
                    // Sort the flights by departure time before mapping
                    flights
                        .slice() // Create a shallow copy to avoid mutating original state
                        .sort((a, b) => 
                            new Date(a.itineraries[0].segments[0].departure.at) - 
                            new Date(b.itineraries[0].segments[0].departure.at)
                        )
                        .map((flight, index) => (
                            <div style={styles.flightCard_mark2} key={flight.id}>
                                <p>
                                    <FontAwesomeIcon icon={faPlane} style={styles.icon_mark2} /> <strong>Flight ID:</strong> {flight.id}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faDollarSign} style={styles.icon_mark2} /> <strong>Price:</strong> {flight.price?.total || 'N/A'}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faClock} style={styles.icon_mark2} /> <strong>Departure:</strong> {formatDate(flight.itineraries[0].segments[0].departure.at)}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faArrowRight} style={styles.icon_mark2} /> <strong>Arrival:</strong> {formatDate(flight.itineraries[0].segments[0].arrival.at)}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faHourglassHalf} style={styles.icon_mark2} /> <strong>Duration:</strong> {formatDuration(flight.itineraries[0].duration)}
                                </p>
                                <button onClick={() => handleExtraAction(flight)} style={styles.extraButton_mark2}>
                                    Booking
                                </button>
                            </div>
                        ))
                ) : (
                    !loading && <p style={styles.noResults_mark2}>Please search to see results.</p>
                )}
            </div>
        </div>
    );
    
};

const styles = {
    container_mark2: {
        minHeight: '100vh',
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '65px 24px',
        /////
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ADD8E6', // Baby blue background fallback  
        display: 'flex',
        alignItems: 'center',
    },

    header_mark2: {
        width: '100%',
        textAlign: 'center',
        marginBottom: '14px', // 70% of 20px
        color: '#000',
    },
    title_mark2: {
        fontSize: '1.4em', // 70% of 2em
        color: '#000', // Change text color to black
        fontWeight: 'bold',
        textShadow: '1.4px 1.4px 2.8px rgba(0, 0, 0, 0.3)', // Adjust shadow size
    },

    searchBar_mark2: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px', // 70% of 20px
        borderRadius: '5.6px', // 70% of 8px
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)', // Blue gradient background for search bar
        width: '100%',
        maxWidth: '420px', // 70% of 600px
        color: '#777',
        boxShadow: '0 2.8px 5.6px rgba(0, 0, 0, 0.1)', // Adjust shadow size
    },
    input_mark2: {
        width: '100%',
        padding: '7px', // 70% of 10px
        margin: '3.5px 0', // 70% of 5px
        borderRadius: '2.8px', // 70% of 4px
        border: '1px solid #ddd',
    },
    button_mark2: {
        padding: '7px 14px', // 70% of 10px 20px
        margin: '7px 3.5px', // 70% of 10px 5px
        backgroundColor: '#0071c2',
        color: '#fff',
        border: 'none',
        borderRadius: '2.8px', // 70% of 4px
        cursor: 'pointer',
        fontSize: '11.2px', // 70% of 16px
    },
    results_mark2: {
        width: '100%',
        maxWidth: '420px', // 70% of 600px
        marginTop: '14px', // 70% of 20px
    },
    results_mark2: {
        width: '100%',
        maxWidth: '620px', // 70% of 600px
        marginTop: '14px', // 70% of 20px
        // padding: '14px', // 70% of 20px
        // Optional: Adds a background with translucency
    },
    flightCard_mark2: {
        border: '1px solid #ccc',
        borderRadius: '10px', // Smooth corners
        padding: '15px',
        margin: '10px 0',
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fully opaque for better visibility
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Softer shadow for elevation
        transition: 'transform 0.2s, box-shadow 0.2s', // Smooth hover effect
        position: 'relative',
        // Ensure contrast for inner text
        color: '#333', // Darker black text
      },
      

      extraButton_mark2: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        position: 'absolute', // Positions the button absolutely within the container
        right: '10px',       // 10px from the right edge
        top: '50%',          // Centers vertically if needed
        transform: 'translateY(-50%)', // Adjusts for proper vertical centering
      },
      
    // Hover Effect for Flight Card
    flightCardHover_mark2: {
        transform: 'scale(1.03)', // Slight zoom-in
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // More pronounced shadow on hover
    },

    // Enhanced Text Appearance
    text_mark2: {
        fontSize: '16px', // Slightly larger for readability
        color: '#333', // Darker text color for contrast
        fontWeight: '500', // Medium weight for better emphasis
        marginBottom: '10px',
    },

    noResults_mark2: {
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        color: '#888',
    },
};

export default FlightSearch;