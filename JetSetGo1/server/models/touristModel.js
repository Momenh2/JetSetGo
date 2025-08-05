

const mongoose = require('mongoose');
///aaaaaaA11111111111111111111111
const touristSchema = new mongoose.Schema({
      
    addresses: [
        {
          label: String, // e.g., "Home", "Work"
          address: String, // Full address
        },
      ],
      
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ],

    checkouts: [
        {
            deliveryAddress: {
                type: String,
                required: true
            },
            products: [
                {
                    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                    quantity: { type: Number, default: 1 }
                }
            ],
            totalAmount: { type: Number, required: true },
            status: {
                type: String,
                enum: ['pending', 'completed'],
                default: 'pending'
            },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    

    PromoCodesUsed: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PromoCode", // Assuming you have a Tourist model
        },
      ],
   
   
   
    username: { 
        type: String, 
        required: true, 
        unique: true ,
        immutable:true
    },
    email: { type: String, 
        required: true,
         unique: true 
        },
    password: { 
        type: String, 
        required: true 
    },
    mobile: { 
        type: String, 
        required: true 
    },
    nationality: { 
        type: String, 
        required: true 
    },
    dob: { 
        type: Date, 
        required: true ,
        immutable: true
    },  //     Date of Birth (not editable)
    job: { 
        type: String, 
        enum: ['student', 'employee', 'unemployed'],  // List of allowed job types
        required: true
    },
    prefrences:{
        tags: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Tag'
            }],
        budget:{
            from:{type: Number},
            to:{type:Number}
        }    
    },
    wallet: { 
        balance: { 
            type: Number, 
            default: 0 
        },
        transactions: [
            {
                orderId: { 
                    type: String, 
                    required: true 
                },
                amount: { 
                    type: Number, 
                    required: true 
                },
                type: { 
                    type: String, 
                    enum: ['deduction', 'addition'], 
                    required: true 
                },
                orderType: { 
                    type: String, 
                    enum: ['itinerary', 'activity', 'product', 'transportation'], 
                    required: true 
                },
                createdAt: { 
                    type: Date, 
                    default: Date.now 
                }
            }
        ]
    },
    
    deletionRequested: {////////////////////////////////////////////////
        type: Boolean,
        default: false
    },
    TotalPoints: { 
        type: Number, 
        default: 0
    },
    Points: { 
        type: Number, 
        default: 0
    },
    Level: { 
        type: Number,
        enum: [1, 2, 3],  // Only allow values 1, 2, or 3
        default: 1 
    },   
    BookedAnything: {////////////////////////////////////////////////
        type: Boolean,
        default: false
    },
    wishlist: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        }
    ],
    ActivitiesPaidFor : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Activity"  
    }],
    ActivitiesBookmarked : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Activity"  
    }],
    ItinerariesPaidFor : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Itinerary"  
    }],
    ItinerariesBookmarked : [{
        type: mongoose.Schema.Types.ObjectId, ref: "Itinerary"  
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Tourist', touristSchema);

