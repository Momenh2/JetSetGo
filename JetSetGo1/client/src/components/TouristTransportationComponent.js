import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import bus from "./back/bus.jpeg";
import car from "./back/car.jpg";
import { format, isSameDay, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faBus,
  faUsers,
  faMapMarkerAlt,
  faClock,
  faDollarSign,
  faCalendarAlt,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransportBookingPage = () => {
  const [transports, setTransports] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [cardMaxWidth, setCardMaxWidth] = useState("400px"); // state for maxWidth
  const [selectedDate, setSelectedDate] = useState(null);
  const [seats, setSeats] = useState(1);
  const [filter, setFilter] = useState("ALL");
  const expandedCardRef = useRef(null);
  const [fullCapacityDates, setFullCapacityDates] = useState([]);
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken?.id;

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/advertisers/showTransportation"
        );
        if (!response.ok) throw new Error("Error fetching transports");
        const data = await response.json();
        setTransports(
          data.filter(
            (transport) =>
              transport.vehicle === "car" || transport.capacity > 0
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransports();
  }, []);

  const handleFilterChange = (filterType) => setFilter(filterType);

  const filteredTransports =
    filter === "ALL"
      ? transports
      : transports.filter(
        (transport) =>
          transport.vehicle.toLowerCase() === filter.toLowerCase()
      );

  const handleBooking = async () => {
    if (!selectedTransport || !selectedDate) {
      console.log("Selected transport:", selectedTransport, "Selected date:", selectedDate)
      // alert("Please select a valid transport and departure day.");
      toast.error("Please select a valid transport and departure day.");
      return;
    }
    console.log("Selected transport:", selectedTransport._id, "Selected date:", selectedDate, "Seats:", seats, "Tourist ID:", id);
    try {
      const response = await fetch(
        "http://localhost:8000/api/tourist/newTransportBooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transportationId: selectedTransport._id,
            touristId: id,
            date: selectedDate,
            seats,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking failed:", errorData);
        // alert(`Booking failed: ${errorData.error || "Unknown error"}`);
        toast.error(`Booking failed: ${errorData.error || "Unknown error"}`);
        return;
      }

      const bookingData = await response.json();
      // alert("Booking successful!");
      toast.success("Booking successful!");
      console.log("Booking details:", bookingData);

      // Refresh transport data
      const updatedResponse = await fetch(
        "http://localhost:8000/api/advertisers/showTransportation"
      );
      if (updatedResponse.ok) {
        const updatedTransports = await updatedResponse.json();
        setTransports(
          updatedTransports.filter(
            (transport) => transport.vehicle === "car" || transport.capacity > 0
          )
        );
      }
    } catch (error) {
      console.error("Error booking transport:", error);
      // alert("An error occurred while booking. Please try again.");
      toast.error("An error occurred while booking. Please try again.");
    }
  };

  const handleClickOutside = (event) => {
    if (
      expandedCardRef.current &&
      !expandedCardRef.current.contains(event.target)
    ) {
      setSelectedTransport(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <h2>Available Transports</h2>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {["ALL", "car", "bus"].map((filterType) => (
          <button
            key={filterType}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: filter === filterType ? "#007bff" : "#f5f5f5",
              color: filter === filterType ? "#fff" : "#333",
              cursor: "pointer",
            }}
            onClick={() => handleFilterChange(filterType)}
          >
            {filterType.toUpperCase()}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gap: "15px",
          gridTemplateColumns: "repeat(3, 1fr)",
          margin: "0 auto",
          justifyItems: "center", // Horizontally centers the items within each grid cell
          alignItems: "center",   // Vertically centers the items within each grid cell
        }}

      >
        {filteredTransports.map((transport) => (
          <div
            key={transport._id}
            ref={selectedTransport === transport ? expandedCardRef : null}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Default shadow
              overflow: "hidden",
              transition: "all 0.3s ease",
              backgroundColor: selectedTransport === transport ? "#f9f9f9" : "#fff",
              maxWidth: selectedTransport === transport ? "800px" : cardMaxWidth,
              width: "100%",
              // height: "50px",
              ":hover": {
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // Shadow increases on hover
                transform: "translateY(-4px)", // Slightly lift the card on hover
              }
            }}

            onClick={() => {
              setSelectedTransport(transport);
              // setSelectedDate(null); 
              setCardMaxWidth("400px");
            }}
          >
            <div style={{ flex: "1", padding: "10px" }}>
              <img
                src={transport.vehicle === "car" ? car : bus}
                alt={transport.vehicle}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                {transport.vehicle === "car" ? (
                  <>
                    <FontAwesomeIcon icon={faCar} /> Car
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBus} /> Bus
                  </>
                )}
              </span>
              {transport.vehicle === "car" ? (
                <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span style={{ fontWeight: "500" }}>Capacity:</span> 4
                </p>
              ) : (
                <>
                  <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span style={{ fontWeight: "500" }}>Capacity:</span> {transport.capacity}
                  </p>
                </>
              )}

              {transport.vehicle === "car" ? null : (
                <>
                  <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span style={{ fontWeight: "500" }}>Pickup Location:</span> {transport.bLocation?.pickup || "Not provided"}
                  </p>
                  <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span style={{ fontWeight: "500" }}>Dropoff Location:</span> {transport.bLocation?.dropoff || "Not provided"}
                  </p>
                </>
              )}

              {transport.vehicle === "bus" ? null : (
                <>
                  <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span style={{ fontWeight: "500" }}>Pickup Location:</span> {transport.cLocation || "Not provided"}
                  </p>
                </>
              )}

              {transport.vehicle === "bus" ? (
                <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                  <FontAwesomeIcon icon={faClock} />
                  <span style={{ fontWeight: "500" }}>Departure Time:</span> {transport.time || "Not provided"}
                </p>
              ) : (
                <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                  <FontAwesomeIcon icon={faClock} />
                  <span style={{ fontWeight: "500" }}>Time:</span> {transport.time || "Not provided"}
                </p>
              )}

              <div style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#444" }}>
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span style={{ fontWeight: "500" }}>Days:</span>{" "}
                {Array.isArray(transport.days) && transport.days.length > 0
                  ? transport.days.join(", ")
                  : "Not provided"}
              </div>

              <p style={{ margin: "0", fontSize: "1.1em", fontWeight: "600", color: "#222" }}>
                <FontAwesomeIcon icon={faDollarSign} />
                <span style={{ fontWeight: "600" }}>Price:</span> ${transport.price}
              </p>

              {transport.vehicle === "car" ? (
                <p style={{ margin: "0", fontSize: "0.9em", fontWeight: "400", color: "#555" }}>
                  <br />
                </p>
              ) : null}
            </div>


              {selectedTransport === transport && (
                <div
                  style={{
                    flex: "1",
                    padding: "10px",
                    borderLeft: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div>
                    <h4>Booking Details</h4>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = format(date, "yyyy-MM-dd");
                          console.log("Date selected:", formattedDate);
                          setSelectedDate(formattedDate);
                        }
                      }}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      filterDate={(date) => {
                        // Allowed days for transport (e.g., ['monday', 'wednesday'])
                        const allowedDays = transport.days.map((day) => day.toLowerCase());

                        // Map weekday index to weekday name
                        const weekdayIndexToName = [
                          'sunday',
                          'monday',
                          'tuesday',
                          'wednesday',
                          'thursday',
                          'friday',
                          'saturday',
                        ];

                        // Exclude dates (e.g., ['2024-12-02'])
                        const excludedDates = transport.fullDays; // Example list
                        const isAllowedDay = allowedDays.includes(weekdayIndexToName[date.getDay()]);
                        const isExcludedDate = excludedDates.some((excludedDate) => isSameDay(date, parseISO(excludedDate))
                        );
                        return isAllowedDay && !isExcludedDate;
                      }}
                      inline
                    />

                  </div>

                  <div style={{ marginTop: "10px" }}>
                    {transport.vehicle !== "car" && (
                      <div style={{ marginBottom: "10px" }}>
                        <label style={{ fontSize: "0.9em", display: "block" }}>
                          Seats:
                        </label>
                        <input
                          type="number"
                          value={seats}
                          onChange={(e) => setSeats(Number(e.target.value))}
                          min="1"
                          max={transport.capacity}
                          style={{
                            width: "100%",
                            padding: "5px",
                            marginTop: "5px",
                          }}
                        />
                      </div>

                    )}
                    <button
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={handleBooking}
                    >
                      Book and Pay
                    </button>
                  </div>
                </div>
              )}
            </div>
        ))}
          </div>
    </div>
      );
};

      export default TransportBookingPage;