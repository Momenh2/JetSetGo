// models/FlightBooking.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightBookingSchema = new Schema({
  touristId: {
    type: Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
  },
  flightId: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: false,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FlightBooking', FlightBookingSchema);
