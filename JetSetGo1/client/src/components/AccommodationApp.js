import React, { useState } from 'react';
import Search from './Search';
import { DateFilters } from "./DateFilters";
import { Hotels } from "./Hotels";
import back from './back/hotel2.jpg'; // Import the background image
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AccommodationApp = ({ touristId }) => {
    const [cityCode, setCityCode] = useState("");
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split("T")[0]);
    const [checkOutDate, setCheckOutDate] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]
    );
    const [adults, setAdults] = useState(1);
    const [showHotels, setShowHotels] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAdultsChange = (event) => {
        const count = parseInt(event.target.value, 10);
        setAdults(count);
    };

    const handleSearchClick = () => {
        setShowHotels(false); // Reset to hide Hotels component
        setIsLoading(true); // Start loading indicator
        setTimeout(() => {
            setShowHotels(true); // Show Hotels after loading
            setIsLoading(false); // Stop loading indicator
        }, 2000); // Simulating a network request delay
    };

    const styles = {
    appContainer: {
        minHeight: '100vh',
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '65px 24px',
    },
    contentBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '19px',
        borderRadius: '14px',
        boxShadow: '0px 5px 14px rgba(0, 0, 0, 0.2)',
        maxWidth: '706px',
        width: '100%',
        margin: '18px auto',
        minHeight: '160px',
    },
    searchRow: {
        marginBottom: '12px',
    },
    inputRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '14px 0',
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '16px',
        color: '#555',
        marginBottom: '-6px',
        position: 'relative',
        top: '-12px',
    },
    searchButton: {
        backgroundColor: '#0071c2',
        color: '#fff',
        border: 'none',
        padding: '12px 29px',
        cursor: 'pointer',
        fontSize: '14px',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    },
    searchButtonHover: {
        backgroundColor: '#005fa3',
    },
    loadingIndicator: {
        fontSize: '24px',
        color: '#f071c2',
        marginTop: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hotelsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(1430px, 1fr))',
        gap: '24px',
        width: '90%',
        padding: '24px 0',
        alignItems: 'start',
    },
};


    return (
        <div style={styles.appContainer}>
            <div style={styles.contentBox}>
                <div style={styles.searchRow}>
                    <Search setCityCode={setCityCode} />
                </div>

                <div style={styles.inputRow}>
                    <DateFilters
                        checkInDate={checkInDate}
                        checkOutDate={checkOutDate}
                        setCheckInDate={setCheckInDate}
                        setCheckOutDate={setCheckOutDate}
                    />

                    <label style={styles.label}>
                        Adults:
                        <select value={adults} onChange={handleAdultsChange}>
                            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        style={styles.searchButton}
                        onClick={handleSearchClick}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = styles.searchButtonHover.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = styles.searchButton.backgroundColor)}
                    >
                        Search
                    </button>
                </div>
            </div>
            {showHotels && cityCode ? (
                <div style={styles.hotelsContainer}>
                    <Hotels
                        cityCode={cityCode}
                        checkInDate={checkInDate}
                        checkOutDate={checkOutDate}
                        adults={adults}
                        touristId={touristId}
                    />
                </div>
            ) : (
                !isLoading
            )}
        </div>
    );
};

export default AccommodationApp;
