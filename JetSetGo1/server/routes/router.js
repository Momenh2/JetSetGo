const express = require('express');
const { create_pref_tag, get_pref_tag, update_pref_tag, delete_pref_tag } = require('../controllers/adminController.js');
const router = express.Router();
const { API_KEY, API_SECRET } = require("../config.js");
const Amadeus = require("amadeus");
// const express = require("express");

// src/router.js
// const router = express.Router();
// Create Amadeus API client

const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});

// City search suggestions endpoint
router.get("/search", async (req, res) => {
  const { keyword } = req.query;
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.city,
    });
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Query hotels in given city endpoint
const BATCH_SIZE = 10; // Adjust batch size as needed

// router.get("/hotels", async (req, res) => {
//   const { cityCode, checkInDate, checkOutDate ,adults} = req.query;

//   // Validate required parameters
//   if (!cityCode || !checkInDate || !checkOutDate) {
//     return res.status(400).json({
//       error: "Missing required parameters. Please provide cityCode, checkInDate, and checkOutDate.",
//     });
//   }

//   try {
//     // Step 1: Get hotels by city code
//     const response = await amadeus.referenceData.locations.hotels.byCity.get({
//       cityCode,
//     });

//     const parsedResponse = JSON.parse(response.body);
//     if (parsedResponse && parsedResponse.data) {
//       const hotelIds = parsedResponse.data.map((hotel) => hotel.hotelId);

//       // Step 2: Batch hotelIds and fetch offers for each batch
//       const offers = [];
//       for (let i = 0; i < hotelIds.length; i += BATCH_SIZE) {
//         const batch = hotelIds.slice(i, i + BATCH_SIZE).join(","); // Convert batch array to comma-separated string

//         // Fetch offers for the current batch of hotelIds
//         const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
//           hotelIds: batch, // Use the comma-separated string
//           checkInDate,
//           checkOutDate,
//         });

//         const offersParsedResponse = JSON.parse(offersResponse.body);
//         if (offersParsedResponse && offersParsedResponse.data) {
//           offers.push(...offersParsedResponse.data);
//         }
//       }

//       // Respond with the combined offers data
//       res.json(offers);
//     } else {
//       res.status(500).json({
//         error: "Unexpected response format from hotel API.",
//       });
//     }
//   } catch (err) {
//     console.error("Error fetching hotel data or offers:", err);

//     res.status(500).json({
//       error: err.response?.data || "Failed to fetch hotel data or offers.",
//     });
//   }
// });








// Query offers for a given hotel endpoint

const breask = 6;

// router.get("/hotels", async (req, res) => {
//   const { cityCode, radius = 5, radiusUnit = "KM" } = req.query;

//   try {
//     const response = await amadeus.referenceData.locations.hotels.byCity.get({
//       cityCode,
//       radius,
//       radiusUnit,
//     });

//     const hotels = JSON.parse(response.body).data.slice(0, 10); // Get only the first 10 hotels
//     res.json(hotels);
//   } catch (err) {
//     res.json(err);
//   }
// });


// router.get("/hotels", async (req, res) => {
//   const { cityCode, checkInDate, checkOutDate, adults, radius = 5, radiusUnit = "KM" } = req.query;

//   // Check if required parameters are provided
//   if (!cityCode || !checkInDate || !checkOutDate || !adults) {
//     return res.status(400).json({ error: "Missing required query parameters" });
//   }

//   try {
//     // Step 1: Fetch hotels using city code
//     const hotelsResponse = await amadeus.referenceData.locations.hotels.byCity.get({
//       cityCode,
//       radius,
//       radiusUnit,
//     });
//     const hotelsData = JSON.parse(hotelsResponse.body).data.slice(0, 10); // Limit to first 10 results

//     // Extract hotel IDs from the response
//     const hotelIds = hotelsData.map(hotel => hotel.hotelId);
//     console.log(hotelIds);

//     if (hotelIds.length === 0) {
//       return res.status(404).json({ error: "No hotels found for the specified city." });
//     }
//     var overall;
//     for(hotelId of hotelIds){
//       const detailedOffersResponse = await amadeus.shopping.hotelOffersByHotel.get({
//         hotelId, // Pass the list of hotel IDs
//         checkInDate,
//         checkOutDate,
//         adults: parseInt(adults, 10), // Convert adults to integer
//       });
//       overall.push(detailedOffersResponse);
//     }
//     // Step 2: Use hotelIds, checkInDate, checkOutDate, and adults to get detailed offers
   
//     const detailedOffersData = JSON.parse(overall.body);

//     // Return the detailed hotel offers
//     res.json(detailedOffersData);
//   } catch (err) {
//     console.error("Error fetching hotel offers:", err);
//     res.status(500).json({ error: "Unable to fetch hotel data" });
//   }
// });

const axios = require('axios');

router.get("/hotels", async (req, res) => {
  const { cityCode, radius = 5, radiusUnit = "KM", checkInDate, checkOutDate, adults } = req.query;

  try {
    // Step 1: Fetch hotels based on cityCode and radius
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode,
      radius,
      radiusUnit,
    });
    console.log("response",response);
    
    // Step 2: Parse and extract hotel IDs
    const hotels = JSON.parse(response.body); // Limit to first 10 hotels
    // res.json(hotels);
    // return;
    const hotelIds = hotels.data.map(hotel => hotel.hotelId).splice(0, 20); // Extract hotelId from each hotel
    hotelIds.push("MCLONGHM");
    
    // Step 3: Prepare data for /fofo endpoint
    const fofoData = {
      hotelIds,
      checkInDate,
      checkOutDate,
      adults,
    };

    // Step 4: Send data to /fofo endpoint using axios
    // const fofoResponse = await axios.post('http://localhost:8000/api/fofo', fofoData);

    // Step 5: Send the /fofo response back to the client
    // res.json(fofoResponse.data);
    const accessToken = await getAmadeusAccessToken();

    // Step 3: Set up the Amadeus API endpoint with dynamic query parameters
    const hotelIdsParam = fofoData.hotelIds.join(',');
    console.log("ssww",hotelIdsParam);
    console.log("fofoData",fofoData);
    console.log(`https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIdsParam}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&paymentPolicy=NONE&roomQuantity=1`);
    const hotelOffersUrl = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIdsParam}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&paymentPolicy=NONE&roomQuantity=1`;

    // Step 4: Fetch hotel offers data from Amadeus API
    const hotelResponse = await fetch(hotelOffersUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!hotelResponse.ok) {
      throw new Error(`Failed to fetch hotel offers: ${hotelResponse.statusText}`);
    }

    // Step 5: Parse and send response data
    const hotelData = await hotelResponse.json();
    res.json(hotelData);

 
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json(err.message);
  }
});


router.get("/offers", async (req, res) => {
  const { hotelId } = req.query;
  try {
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId,
    });
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err.message);
  }
});






// Confirm offer validity endpoint
router.get("/offer", async (req, res) => {
  const { offerId } = req.query;
  try {
    const response = await amadeus.shopping.hotelOffer(offerId).get();
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Booking endpoint
router.post("/booking", async (req, res) => {
  const { offerId } = req.query;
  const { body } = req;
  try {
    const response = await amadeus.booking.hotelBookings.post(
      JSON.stringify({
        data: {
          offerId,
          guests: body.guests,
          payments: body.payments,
        },
      })
    );
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Flight offers search endpoint
router.get("/flights", async (req, res) => {
  const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults = 1 } = req.query;

  // Validate required parameters
  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return res.status(400).json({
      error: "Missing required parameters. Please provide originLocationCode, destinationLocationCode, departureDate, and adults.",
    });
  }

  // Convert departureDate to a Date object and check if it’s in the future
  const departure = new Date(departureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to the start of today for comparison

  if (departure < today) {
    return res.status(400).json({
      error: "Invalid departureDate. Date/Time is in the past.",
    });
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,  // Optional, for round-trip flights
      adults,
    });

    // Parse and send the response
    res.json(JSON.parse(response.body));
  } catch (err) {
    console.error("Error fetching flight data:", err);
    res.status(500).json({
      error: err.response?.data || "Failed to fetch flight data.",
    });
  }
});



// Advertiser activities 
router.post('/createtag', create_pref_tag);
router.patch('/updatetag', update_pref_tag);
router.delete('/deletetag/:id', delete_pref_tag);
router.get('/tag', get_pref_tag);






/////////////////////////////////////////////////////////
const AMADEUS_API_KEY = process.env.API_KEY;
const AMADEUS_API_SECRET = process.env.API_SECRET;

// Helper function to get access token
async function getAmadeusAccessToken() {
  const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const body = new URLSearchParams({
    'grant_type': 'client_credentials',
    'client_id': AMADEUS_API_KEY,
    'client_secret': AMADEUS_API_SECRET,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  console.log(data.access_token);
  return data.access_token;

}

// GET route to fetch hotel offers
router.get('/fofo', async (req, res) => {
  try {
    // Step 1: Retrieve data from the request body
    const { adults, checkInDate, checkOutDate, hotelIds } = req.body;

    if (!adults || !checkInDate || !checkOutDate || !hotelIds || !Array.isArray(hotelIds)) {
      return res.status(400).json({ error: 'Missing required fields or incorrect data format' });
    }

    // Step 2: Retrieve the access token
    const accessToken = await getAmadeusAccessToken();

    // Step 3: Set up the Amadeus API endpoint with dynamic query parameters
    const hotelIdsParam = hotelIds.join(',');
    console.log("ssww",hotelIdsParam);
    const hotelOffersUrl = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIdsParam}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&paymentPolicy=NONE&roomQuantity=1`;

    // Step 4: Fetch hotel offers data from Amadeus API
    const hotelResponse = await fetch(hotelOffersUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!hotelResponse.ok) {
      throw new Error(`Failed to fetch hotel offers: ${hotelResponse.statusText}`);
    }

    // Step 5: Parse and send response data
    const hotelData = await hotelResponse.json();
    res.json(hotelData);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;









