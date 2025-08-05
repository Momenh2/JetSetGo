import React, { useEffect, useState } from "react";
import { getHotels } from '../api'; // Assuming you have an API to fetch hotels

const AccommodationSearch = ({ cityCode }) => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    if (!cityCode) return;
    console.log("cityCode:", cityCode);

    const fetchHotels = async () => {
      const hotelData = await getHotels(cityCode);
      setHotels(hotelData || []);
    };

    fetchHotels();
  }, [cityCode]);

  return (
    <div>
      {hotels.length > 0 ? (
        hotels.map((hotel) => {
          const {
            id,
            name = "Hotel Name Not Available",
            address = {},
          } = hotel;

          // Extract address fields with fallback values
          const addressLines = address.lines ? address.lines.join(", ") : "Address Not Available";
          const city = address.cityName ? `, ${address.cityName}` : "";
          const state = address.stateCode ? `, ${address.stateCode}` : "";
          const country = address.countryCode ? `, ${address.countryCode}` : "";

          return (
            <div key={id}>
              <h2>{name}</h2>
              <p>{`${addressLines}${city}${state}${country}`}</p>
              {/* Render other hotel details here */}
            </div>
          );
        })
      ) : (
        <p>No hotels available for the selected city.</p>
      )}
    </div>
  );
};

export default AccommodationSearch;
