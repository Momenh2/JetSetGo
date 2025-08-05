const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    touristID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tourist', 
        required: true 
    },
    deliveryAddress: { 
        type: String, 

    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    products: [{
        productID: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        }
    }],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    orderStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['Visa', 'Wallet','CoD' ],

    }
});

module.exports = mongoose.model('Order', orderSchema);