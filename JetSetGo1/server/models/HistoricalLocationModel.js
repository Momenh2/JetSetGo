const mongoose = require('mongoose');
const { format } = require('path');

const historicalLocationSchema = new mongoose.Schema({
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
        required: true,
    },
    openingHours: {
        from: { type: Number, required: true },
        to: { type: Number, required: true },
    },
    ticketPrices: {
        foreigner: { type: Number, required: true },
        native: { type: Number, required: true },
        student: { type: Number, required: true },
    },
    pictures: [{ type: String }],
    tags: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'HistoricalTag' 
    },
        
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
    },
    
  governor: { type: mongoose.Schema.Types.ObjectId, ref: 'TourismGovernor', required: true },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('HistoricalLocation', historicalLocationSchema);