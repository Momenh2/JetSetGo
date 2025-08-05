// models/HotelBooking.js
const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist", required: true }, // Link to Tourist model
    hotelId: { type: String, required: false },
    offerId: { type: String, required: false },
    name: { type: String, required: false },
    address: { type: String, required: false },
    room: { type: String, required: false },
    boardType: { type: String, required: false },
    checkInDate: { type: Date, required: false },
    checkOutDate: { type: Date, required: false },
    price: { type: Number, required: false },
    currency: { type: String, required: false },
    adults: { type: Number, required: false },
});

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
