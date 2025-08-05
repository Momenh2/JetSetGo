const Tourist = require("../models/TouristModels");
const Advertiser = require('../models/AdvertiserModel');
const TourGuide = require("../models/TourGuideModel");
const Seller = require('../models/SellerModel');
const Admin = require('../models/AdminModel.js');
const TourismGoverner = require('../models/TourismGovernerModel.js');

const mongoose = require('mongoose');

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index:true
    // minlength: 3 
  },
  password: {
    type: String,
    required: true,
    // minlength: 6,
    // index: true
  },
  userType: {
    type: String,
    enum: ['Tourist', 'Advertisers', 'TourGuide', 'Seller', 'Admin', 'TourismGoverner'],
    required: true
  },
  userDetails: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userType' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook (example: hash password before saving)
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const bcrypt = require('bcryptjs');
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

module.exports = mongoose.model('User', UserSchema);
