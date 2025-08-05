const mongoose = require('mongoose');
// const TouristModel = require('./TouristModel');

const bookingSchema = new mongoose.Schema({
    tourist: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "Tourist"
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    referenceType: {
        type: String, 
        enum: ['Activity', 'Itinerary'], 
        required: true 
    },
    price:{
        type: Number, 
        required: true, 
    },
    paymentMethod: { 
        type: String, 
        enum: ['Visa', 'Wallet' ],

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);