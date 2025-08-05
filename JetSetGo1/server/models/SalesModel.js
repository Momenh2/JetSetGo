const mongoose = require('mongoose');
// not stated in the requiemnts about its attributes but logically the admin data should be stored
const salesSchema = new mongoose.Schema({
    
    price: { type: Number, required: true },
    quantityPurchased: { type: Number, required: true },
    // lets make it array of numbers and calculate the avergage
    
    Tourists: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist', // Assuming you have a Tourist model
      },
    Seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller', // Assuming you have a Tourist model
    },
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming you have a Tourist model
    },  

    reviews: {
        type: String,
        default:""
    },
    
    ratings: { type: Number,
        default:0
     }, 
     createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Sales', salesSchema);