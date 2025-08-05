
const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  discount: {
    type: Number,
    required: true,  // The discount amount in percentage (e.g. 20 for 20% off)
    min: 0,
    max: 100,  // Discount percentage should be between 0 and 100
  },
  Tourist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',  // Reference to the Admin who created this promo code
  }],

  isActive: {
    type: Boolean,
    default: true,  // Promo code can be deactivated if needed
  },

//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Admin',  // Reference to the Admin who created this promo code
//     required: true,
//   },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically sets the creation date to the current date and time
  },
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);