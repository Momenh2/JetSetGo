const mongoose = require('mongoose');
const Transportation = require('../models/TransportationModel.js');

const transportationBookingSchema = new mongoose.Schema({
  transportationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transportation', 
    required: true 
  },
  touristId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tourist', 
    required: true 
  },
  date: {
    type: Date,
    required: true
  },
  seats: {
    type: Number,
    default: 1 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

transportationBookingSchema.pre('save', async function (next) {
  try {
    const transportation = await mongoose.model('Transportation').findById(this.transportationId);
    if (!transportation) {
      return next(new Error('Invalid Transportation ID.'));
    }
    const bookingWeekday = new Date(this.date).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

    if (!transportation.days.includes(bookingWeekday)) {
      return next(new Error(`Transportation is not available on ${bookingWeekday}.`));
    }
    const totalBookedSeats = await mongoose.model('TransportationBooking')
      .aggregate([
        { $match: { transportationId: this.transportationId, date: this.date } },
        { $group: { _id: null, totalSeats: { $sum: '$seats' } } }
      ]);

    const bookedSeats = totalBookedSeats[0]?.totalSeats || 0;
    if (bookedSeats + this.seats > transportation.capacity) {
      return next(new Error('Booking exceeds available capacity for the selected date.'));
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('TransportationBooking', transportationBookingSchema);