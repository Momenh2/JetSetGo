const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true
  },

  time: {
    type: String,
    required: true
  },
  
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },  // Reference to the activity category
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advertiser',
    required: true
  },
  bookingOpen: {
    type: Boolean,
    default: true
  },
  rate: { 
    type: [Number],
  },////////////Malosh lazma
  specialDiscounts: {
    type: String,
    default: null
  },
  Tourists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist', // Assuming you have a Tourist model
  }],
  flagged: {
    type: Boolean,
    default: false,
  },
 
  ratings: [
    {
      star: Number,
      postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tourist",
      },
    },
  ],
  totalrating: {
    type: String,
    default: "0",
  },
  comments: [
    {
      text: String,
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});



module.exports = mongoose.model('Activity', activitySchema);
