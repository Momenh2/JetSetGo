import React, { useState, useEffect, useRef } from "react";

// DateFilters Component
const DateFilters = ({ checkInDate, checkOutDate, setCheckOutDate, setCheckInDate }) => {
  const minCheckIn = useRef(new Date()); // Current date as the minimum check-in date

  useEffect(() => {
    const minCheckOutDate = new Date(checkInDate);
    minCheckOutDate.setDate(minCheckOutDate.getDate() + 1); // Add 1 day to check-in date for minimum check-out

    // Ensure check-out date is at least one day after the check-in date
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setCheckOutDate(minCheckOutDate.toISOString().split("T")[0]);
    }
  }, [checkInDate, checkOutDate, setCheckOutDate]);

  const handleCheckInChange = (event) => {
    setCheckInDate(event.target.value);
  };

  const handleCheckOutChange = (event) => {
    setCheckOutDate(event.target.value);
  };

  return (
    <div style={styles.dateFilters}>
      <div style={styles.datePicker}>
        <label>Check In</label>
        <input
          type="date"
          value={checkInDate}
          min={minCheckIn.current.toISOString().split("T")[0]} // Minimum is the current date
          onChange={handleCheckInChange}
          style={styles.input}
        />
      </div>

      <div style={styles.spacer}></div> {/* Spacer for layout */}

      <div style={styles.datePicker}>
        <label>Check Out</label>
        <input
          type="date"
          value={checkOutDate}
          min={new Date(checkInDate).toISOString().split("T")[0]} // Minimum check-out is one day after check-in
          onChange={handleCheckOutChange}
          style={styles.input}
        />
      </div>
    </div>
  );
};

// CSS-in-JS Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  h1: {
    marginBottom: "20px",
  },
  datePicker: {
    marginBottom: "20px",
  },
  spacer: {
    width: "20px",
  },
  dateFilters: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};

export { DateFilters };
