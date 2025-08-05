const mongoose = require('mongoose');

const advertiserSchema = new mongoose.Schema({
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
    companyProfile: { 
      type: String 
    },  // Information about the company
    websiteLink: { 
      type: String 
    },  // Link to the company website
    hotline: { 
      type: String
     },  // Company hotline
    accepted: { 
      type: Boolean, 
      default: false 
    },  // If the advertiser is accepted by the system
    rejected :{
      type:Boolean,
      default:false
     },
    documents: {/////////////////////////////
      type: [String]
     },// Paths to required documents
    profileImage: {/////////////////////////////
         type:String
       },// Path to profile image or logo
       
      deletionRequested: {////////////////////////////////
        type: Boolean,
        default: false
    },

    socketId: {
      type: String,
      default: null, // Initialize with null, it will be set when they connect
    },

    notifications : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification"
   }],
   
   flagged: {
    type: Boolean,
    default: false,
  },
     
    createdAt: { 
      type: Date, 
      default: Date.now }
});

module.exports = mongoose.model('Advertiser', advertiserSchema);