import React, { useEffect, useState } from "react";
import { getHotels } from "../api";
import dayjs from "dayjs";
import axios from "axios";
import { FaCity, FaCalendarCheck, FaCalendarTimes, FaUser, FaBed, FaDollarSign, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { color } from "framer-motion";
const Hotels = ({ cityCode, checkInDate, checkOutDate, adults, touristId }) => {
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cityCode || !checkInDate || !checkOutDate || !adults) {
            setHotels([]);
            return;
        }

        setLoading(true);
        setError(null);

        const formattedCheckInDate = dayjs(checkInDate).format("YYYY-MM-DD");
        const formattedCheckOutDate = dayjs(checkOutDate).format("YYYY-MM-DD");

        getHotels(cityCode, formattedCheckInDate, formattedCheckOutDate, adults)
            .then((hotelsData) => {
                setHotels(hotelsData || []);
                console.log("Hotels received:", hotelsData);
            })
            .catch((error) => {
                console.error("Error fetching hotels:", error);
                setError("Unable to load hotels. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cityCode, checkInDate, checkOutDate, adults]);

    const handleBooking = async (hotel) => {
        const bookingData = {
            touristId,
            hotelId: hotel.hotelId,
            name: hotel.name,
            address: hotel.address,
            room: hotel.room,
            boardType: hotel.boardType,
            checkInDate,
            checkOutDate,
            price: hotel.price,
            currency: hotel.currency,
            adults,
        };

        try {
            const response = await axios.post("http://localhost:8000/api/tourist/bookhotel", bookingData);
            toast.success("Booking saved successfully!");
            // alert("succ");
        } catch (error) {
            console.error("Error saving booking:", error.message);
            toast.error("Error saving booking:", error.message);
            // alert("Error saving booking. Please try again.");
        }
    };

    if (loading) return <div style={styles.loading_mark}>Loading...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        
        <div style={styles.container_mark}>
            <ToastContainer/>
            {hotels.length > 0 ? (
                hotels.map((hotel) => (
                    <div key={`${hotel.hotelId}-${hotel.offerId}`} style={styles.card_mark}>
                        <div style={styles.cardContent_mark}>
                            {/* Left Section */}
                            <div style={styles.leftSection_mark}>
                                <h2 style={styles.hotelName_mark}>{hotel.name || "Hotel Name Not Available"}</h2>
                                <div style={styles.details_mark}>
                                    <p style={styles.detailItem_mark}>
                                        <span style={styles.label_mark}><FaCity /> City Code: </span> {hotel.cityCode || "Not Available"}
                                    </p>
                                    <div style={styles.dateContainer_mark}>
                                        <p style={styles.detailItem_mark}>
                                            <span style={styles.label_mark}><FaCalendarCheck /> Check-in: </span> {hotel.checkInDate || "Not Available"}
                                        </p>
                                        <p style={styles.detailItem_mark}>
                                            <span style={styles.label_mark}><FaCalendarTimes /> Check-out: </span> {hotel.checkOutDate || "Not Available"}
                                        </p>
                                    </div>
                                    <p style={styles.detailItem_mark}>
                                        <span style={styles.label_mark}><FaUser /> Adults: </span> {adults} Adult(s)
                                    </p>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div style={styles.rightSection_mark}>
                                <div style={styles.details_mark}>
                                    <p style={styles.detailItem_mark}>
                                        <span style={styles.label_mark}><FaBed /> Room Type: </span> {hotel.roomType || "Not Specified"}
                                    </p>
                                    <p style={styles.detailItem_mark}>
                                        <span style={styles.label_mark}><FaBed /> Beds: </span> 
                                        {hotel.beds || "Not Specified"} 
                                        ({hotel.bedType || "Not Specified"})
                                    </p>
                                    <p style={styles.detailItem_mark}>
                                        <span style={styles.label_mark}><FaInfoCircle /> Description: </span> 
                                        {hotel.description || "No description available."}
                                    </p>
                                    <p style={styles.price_mark}>
                                        <FaDollarSign /> {hotel.price || "N/A"} {hotel.currency || "N/A"}
                                    </p>
                                    <p style={styles.detailItem_mark}>
                                        <span style={styles.label_mark}><FaTimesCircle /> Cancellation Deadline: </span> 
                                        {hotel.cancellationDeadline || "Not Available"}
                                    </p>
                                </div>
                                <button style={styles.bookButton_mark} onClick={() => handleBooking(hotel)}>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p style={styles.noHotels}>No hotels found for the specified criteria.</p>
            )}
        </div>
    );
};

const styles = {
    container_mark: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
    },
    card_mark: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
    },
    cardContent_mark: {
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        gap: "24px",
    },
    leftSection_mark: {
        flex: 1,
    },
    rightSection_mark: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
    },
    hotelName_mark: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#1a365d",
        marginBottom: "18px",
        textAlign: "left",
        marginLeft: "0",
    },
    details_mark: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    detailItem_mark: {
        fontSize: "14px",
        margin: 0,
    },
    label_mark: {
        fontWeight: "600",
        color: "#4a5568",
    },
    dateContainer_mark: {
        display: "flex",
        gap: "24px",
    },
    price_mark: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#2c5282",
        marginTop: "8px",
    },
    bookButton_mark: {
        backgroundColor: "#3182ce",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "16px 28px",
        fontSize: "18px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.3s",
        marginLeft: "auto",
    },
    loading_mark: {
        fontSize: "18px",
        textAlign: "center",
        padding: "24px",
        color: "#fff",
    },
    error_mark: {
        fontSize: "18px",
        color: "#e53e3e",
        textAlign: "center",
        padding: "24px",
    },
    noHotels_mark: {
        fontSize: "18px",
        textAlign: "center",
        padding: "24px",
    },
};

export { Hotels };