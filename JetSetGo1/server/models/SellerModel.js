const mongoose = require('mongoose');
const sellerSchema = new mongoose.Schema({
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
    },  // Name of the seller
    description: {
       type: String
       },  // Description of the seller's business
    accepted: { 
      type: Boolean, 
      default: false 
    },  // If the seller is accepted by the system
    rejected :{
      type:Boolean,
      default:false
     },
    documents: {//////////////////////////
      type: [String]
     },// Paths to required documents
      profileImage: {/////////////////////////////
         type:String
       },// Path to profile image or 
       
    deletionRequested: {/////////////////////////////////
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', sellerSchema);
