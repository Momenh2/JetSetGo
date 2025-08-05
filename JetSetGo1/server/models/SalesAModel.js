const mongoose = require('mongoose');
// not stated in the requiemnts about its attributes but logically the admin data should be stored
const salesSchema = new mongoose.Schema({
    
    price: { type: Number, required: true },
    // lets make it array of numbers and calculate the avergage
    
    Tourists: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist', // Assuming you have a Tourist model
      },
    Advertiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advertiser', // Assuming you have a Tourist model
    },
    Activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity', // Assuming you have a Tourist model
    },  

     createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('SalesA', salesSchema);