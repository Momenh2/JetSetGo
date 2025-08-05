// src/api.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api"; // Adjust as needed

export const search = (keyword) => {
  const cancelTokenSource = axios.CancelToken.source();

  const process = async (callback) => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { keyword },
        cancelToken: cancelTokenSource.token,
      });

      // Check if the response data exists and is an array
      if (response.data && Array.isArray(response.data.data)) {
        callback(
          response.data.data.map((location) => ({
            city: location.name,
            country: location.address.countryName,
            code: location.address.cityCode,
            state: location.address.stateCode,
          }))
        );
      } else {
        // Handle case where 'data' is not available or is in an unexpected format
        console.error("Unexpected response format:", response.data);
        callback([]); // Return an empty array or handle the error accordingly
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching data:", error);
      }
      callback([]); // Return an empty array in case of error
    }
  };

  return { process, cancel: () => cancelTokenSource.cancel() };
};




//   export const getHotels = async (cityCode, checkInDate, checkOutDate, adults) => {
//     try {
//     const response = await axios.get(
//       `${BASE_URL}/hotels?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`
//     );

//     const hotels = response.data; // Directly access response.data since it's already an array

//     // Ensure each item has the properties you need
//     if (Array.isArray(hotels)) {
//       console.log("Hotels received:", hotels.filter((hotel) => hotel && hotel.name && hotel.address));
//       return hotels.filter((hotel) => hotel && hotel.name && hotel.address);
//     } else {
//       console.error("Unexpected response format:", response.data);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching hotels:", error);
//     return [];
//   }
// };

export const getHotels = async (cityCode, checkInDate, checkOutDate, adults) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/hotels?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`
    );

    const hotelOffers = response.data.data; // Access the array of hotel offers
    console.log("Hotel offers received imp:", hotelOffers);

    const hotels = hotelOffers.flatMap((offer) => {
      const hotel = offer.hotel;

      return offer.offers.map((individualOffer) => {
        return {
          hotelId: hotel.hotelId,
          name: hotel.name || "Hotel Name Not Available",
          cityCode: hotel.cityCode || "Not Available",
          latitude: hotel.latitude || "Not Available",
          longitude: hotel.longitude || "Not Available",
          contact: hotel.contact?.phone || "Not Available",
          available: offer.available || false,
          offerId: individualOffer.id,
          checkInDate: individualOffer.checkInDate || "Not Available",
          checkOutDate: individualOffer.checkOutDate || "Not Available",
          price: individualOffer.price?.total || "N/A",
          currency: individualOffer.price?.currency || "N/A",
          room: individualOffer.room?.name || "Not Specified",
          roomType: individualOffer.room?.type || "Not Specified", // Added correct mapping for room type
          beds: individualOffer.room?.typeEstimated?.beds || "Not Specified", // Added handling for beds
          bedType: individualOffer.room?.typeEstimated?.bedType || "Not Specified", // Added handling for bed type
          description: individualOffer.room?.description?.text || "No description available.",
          cancellationDeadline:
            individualOffer.policies?.cancellations?.[0]?.deadline || "Not Available", // Fixed cancellation deadline
        };
      });
    });

    console.log("Processed Hotels Data:", hotels);
    return hotels;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return []; // Return empty array in case of error
  }
};


