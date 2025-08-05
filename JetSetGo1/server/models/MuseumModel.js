const mongoose = require('mongoose');

const museumSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true
     },
    openingHours: { 
        type: String,
         required: true 
        },
    ticketPrices: { 
        foreigner: { type: Number, required: true },
        native: { type: Number, required: true },
        student: { type: Number, required: true }
    },
    pictures: [{ type: String }],
    tags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tag',
        required: true 
 
    }],
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',  // Reference to the Category model
        required: true 
    },
    governor: { type: mongoose.Schema.Types.ObjectId, ref: 'TourismGovernor', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Museum', museumSchema);
