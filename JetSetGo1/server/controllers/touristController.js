const TransportBooking = require("../models/TransportationBookingModel");
const ActivityItineraryBooking =  require('../models/bookingmodel.js');
const Transportation = require("../models/TransportationModel.js");
const mongoose = require("mongoose");
const Product = require("../models/ProductModel");
const Tourist = require("../models/TouristModels");
const Itinerary = require("../models/ItineraryModel");  
const Activity = require("../models/AdvertiserActivityModel");
const Tag = require("../models/TagModel");
const HistoricalLocationModel = require("../models/HistoricalLocationModel");
const MuseumModel = require("../models/MuseumModel");
const ComplaintModel = require("../models/ComplaintModel");
const Category = require("../models/CategoryModel");
const PromoCode = require('../models/PromoCodeModel.js');
const Booking = require("../models/bookingmodel");
const SalesModel = require("../models/SalesModel");
const SalesIModel = require("../models/SalesIModel");
const TourGuide = require("../models/TourGuideModel.js");
const FlightBooking = require('../models/FlightBooking');
const nodemailer = require('nodemailer');
const Order = require('../models/OrderModel');
const SalesAModel = require("../models/SalesAModel");
const Notification = require("../models/Notification")



// Controller to get all unread notifications for a tour guide
const getUnreadNotifications = async (req, res) => {
  const { id } = req.params; // TourGuide's ID passed in the URL parameter

  try {
    // Query for unread notifications for the specified TourGuide
    const unreadNotifications = await Notification.find({
      userId: id,
      read: false,  
      }).sort({ createdAt: -1 })  // Sort by creation date, descending (most recent first)
      .limit(3);  // Limit to 3 notifications;

    // Check if notifications were found
    if (unreadNotifications.length === 0) {
      return res.status(200).json({ message: 'No unread notifications.' });
    }

    // Return the unread notifications
    return res.status(200).json(unreadNotifications);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return res.status(500).json({ error: 'Error fetching unread notifications.' });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  const { id } = req.params;  // Get the Tour Guide ID from the URL parameter
  try {
    // Update notifications that are unread (read: false) to read: true
    await Notification.updateMany({ userId: id, read: false }, { $set: { read: true } });
    res.status(200).json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read.', details: error.message });
  }
};

// Route to mark notifications as read
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read.', details: error.message });
  }
};

// Route to mark notifications as read
const GetAllNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch all notifications, sorted by creation date (most recent first)
    const notifications = await Notification.find({ userId: id })
      .sort({ createdAt: -1 });  // Sort by creation date, descending

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};



const rateItinerary = async (req, res) => {
  try {
    const { _id, star, activityId } = req.body;

    const activity = await Itinerary.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    let alreadyRated = activity.ratings.find(
      (rating) => rating.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      await Itinerary.updateOne(
        { _id: activityId, "ratings._id": alreadyRated._id },
        {
          $set: { "ratings.$.star": star },
        },
        { new: true }
      );
    } else {
      await Itinerary.findByIdAndUpdate(
        activityId,
        {
          $push: { ratings: { star, postedby: _id } },
        },
        { new: true }
      );
    }

    const getAllRatings = await Activity.findById(activityId);
    if (!getAllRatings) {
      return res.status(404).json({ message: "Activity not found" });
    }

    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);

    let finalActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );

    res.json(finalActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const isActivity = async (id) => {
  try {
    // Check if the ID belongs to the Activity collection
    const activity = await Activity.findById(id);
    if (activity) {
      return "activity";
    }

    // Check if the ID belongs to the Itinerary collection
    const itinerary = await Itinerary.findById(id);
    if (itinerary) {
      return "itinerary";
    }

    // If not found in either collection
    return null;
  } catch (error) {
    console.error("Error in isActivity function:", error.message);
    return null;
  }
};

const getUserRating = async (req, res) => {
  try {
    const { _id, activityId } = req.params; // Extract user ID and activityId

    // First, search in the Activity collection
    const activity = await Activity.findById(activityId);
    console.log("Checking in Activity:", activity);

    if (activity) {
      const userRating = activity.ratings.find(
        (rating) => rating.postedby.toString() === _id.toString()
      );
      if (userRating) {
        return res.json({ rating: userRating.star });
      }
    }

    // If not found in Activity, check in the Itinerary collection
    const itinerary = await Itinerary.findById(activityId);
    console.log("Checking in Itinerary:", itinerary);

    if (itinerary) {
      const userRating = itinerary.ratings.find(
        (rating) => rating.tourist.toString() === _id.toString()
      );
      if (userRating) {
        return res.json({ rating: userRating.rating });
      }
    }

    // If neither has the rating
    res.json({ rating: null });
  } catch (error) {
    console.error("Error fetching user rating:", error);
    res.status(500).json({ message: error.message });
  }
};

const myActivityItineraryBooking = async (req, res) => {
  const { touristId } = req.params;

  try {
    console.log("el tourist that i am using"+touristId);
    // Search for all bookings where the tourist field matches the provided touristId
    const ActivityItineraryBookingProfile = await ActivityItineraryBooking.find({ tourist: touristId });
    console.log(ActivityItineraryBookingProfile);
    if (ActivityItineraryBookingProfile.length === 0) {
      return res.status(404).json({ error: 'No bookings found for this tourist' });
    }

    res.status(200).json(ActivityItineraryBookingProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching bookings' });
  }
};


const addComment = async (req, res) => {
  const { tourGuideId, touristId, comment } = req.body;
  console.log("soso",tourGuideId, touristId, comment);
  try {
    // Find the tour guide by ID and populate tourists for validation
    const tourGuide = await TourGuide.findById(tourGuideId).populate(
      "Tourists"
    );

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found." });
    }

    // Check if the tourist is associated with the tour guide
    if (
      // tourGuide.Tourists.some((tourist) => tourist._id.toString() === touristId)
      1==1
    ) {
      // Add the structured comment
      const newComment = {
        tourist: touristId,
        text: comment,
        createdAt: new Date(),
      };
      tourGuide.comments.push(newComment);
      await tourGuide.save();

      return res.status(200).json({
        message: "Comment added successfully.",
        comment: newComment,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Tourist not associated with this tour guide." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error adding comment.", error });
  }
};

const addItineraryRating = async (req, res) => {
  const { itineraryId, touristId, rating } = req.body;

  console.log("Request data:", itineraryId, touristId, rating);

  try {
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Check if the tourist has already rated the itinerary
    const existingRating = itinerary.ratings.find(
      (r) => r.tourist.toString() === touristId
    );

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
    } else {
      // Add a new rating
      itinerary.ratings.push({ tourist: touristId, rating });
    }

    // Recalculate the average rating
    const totalRatings = itinerary.ratings.length;
    const sumOfRatings = itinerary.ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    itinerary.rating = sumOfRatings / totalRatings; // Average rating

    await itinerary.save(); // Save the updated itinerary

    return res
      .status(200)
      .json({ message: "Rating added/updated successfully.", itinerary });
  } catch (error) {
    return res.status(500).json({ message: "Error adding/updating rating.", error });
  }
};


const addItineraryComment = async (req, res) => {
  const { itineraryId, touristId, comment } = req.body;

  try {
    // Find the itinerary by ID and populate tourists for validation
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Check if the tourist is associated with the itinerary
    if (
      // 
      // itinerary.Tourists.some((tourist) => tourist._id.toString() === touristId)
      1==1
    ) {
      // Add the structured comment
      const newComment = {
        tourist: touristId,
        text: comment,
        createdAt: new Date(),
      };
      itinerary.comments.push(newComment);
      await itinerary.save();

      return res.status(200).json({
        message: "Comment added successfully.",
        comment: newComment,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Tourist not associated with this itinerary." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding comment.", error });
  }
};

const getSingleActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const itemType = await isActivity(id);
    if (!itemType) {
      return res.status(404).json({ message: "Item not found" });
    }
    const Model = itemType === "activity" ? Activity : Itinerary;
    const item = await Model.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


async function addWalletTransaction(req, res) {
  const { touristId, orderId, amount, type, orderType } = req.body;

  try {
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Validate deduction transactions
      if (type === 'deduction' && tourist.wallet.balance < amount) {
          return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

    // Update the ActivitiesPaidFor array if the orderType is 'activity'
    if (orderType === "activity" && type === 'deduction') {
      if (!tourist.ActivitiesPaidFor.includes(orderId)) {
        tourist.ActivitiesPaidFor.push(orderId); // Add the orderId to ActivitiesPaidFor
      }
      const activity = await Activity.findById(orderId);
        
        if (!activity) {
          return res.status(404).json({ message: `Activity with ID ${orderId} not found` });
        }




        const sale = new SalesAModel({
          price: activity.price,
          Tourists: touristId,
          Advertiser: activity.advertiser,
          Activity: orderId,
        });


        await sale.save();

        const booking = new Booking({
          tourist: touristId,
          referenceId: orderId,
          referenceType: "Activity",
          price: amount,
          paymentMethod: "Wallet",
        });
  
  
        await booking.save();


    }
      
        // Update the ActivitiesPaidFor array if the orderType is 'activity'
    if (orderType === "itinerary"&& type === 'deduction') {
      if (!tourist.ItinerariesPaidFor.includes(orderId)) {
        tourist.ItinerariesPaidFor.push(orderId); // Add the orderId to ActivitiesPaidFor
      }
      const itinerary = await Itinerary.findById(orderId);
        
      if (!itinerary) {
        return res.status(404).json({ message: `Itinerary with ID ${orderId} not found` });
      }


      itinerary.Tourists.push(touristId);
      itinerary.save();

      const sale = new SalesIModel({
        price: itinerary.price,
        Tourists: touristId,
        TourGuide: itinerary.tourGuide,
        Itinerary: orderId,
      });


      await sale.save();

      const booking = new Booking({
        tourist: touristId,
        referenceId: orderId,
        referenceType: "Itinerary",
        price: amount,
        paymentMethod: "Wallet",
      });


      await booking.save();

    }



    if (orderType === "activity" && type === 'addition') {
      const activity = await Activity.findById(orderId);
        
        if (!activity) {
          return res.status(404).json({ message: `Activity with ID ${orderId} not found` });
        }

        const sale = new SalesAModel({
          price: -activity.price,
          Tourists: touristId,
          Advertiser: activity.advertiser,
          Activity: orderId,
        });


        await sale.save();
    }
      

    if (orderType === "itinerary"&& type === 'addition') {
      const itinerary = await Itinerary.findById(orderId);
        
      if (!itinerary) {
        return res.status(404).json({ message: `Itinerary with ID ${orderId} not found` });
      }




      const sale = new SalesIModel({
        price: -itinerary.price,
        Tourists: touristId,
        TourGuide: itinerary.tourGuide,
        Itinerary: orderId,
      });


      await sale.save();

    }



      // Update balance
      const newBalance = type === 'addition' 
          ? tourist.wallet.balance + amount 
          : tourist.wallet.balance - amount;

 

      

      // Add transaction
      tourist.wallet.transactions.push({
          orderId,
          amount,
          type,
          orderType
      });

      // Update wallet balance
      tourist.wallet.balance = newBalance;


      await tourist.save();

      res.status(200).json({
          message: 'Transaction successful',
          wallet: tourist.wallet
      });
  } catch (error) {
    console.error('Error adding wallet transaction:', error);
    res.status(500).json({
        message: 'Internal server error',
        error: {
            message: error.message || 'An unknown error occurred',
            stack: error.stack || null
        }
    });
}
}




async function getWalletDetails(req, res) {
  const { touristId } = req.body;

  try {
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      res.status(200).json({
          balance: tourist.wallet.balance,
          transactions: tourist.wallet.transactions
      });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
  }
}
// Function to pay using wallet
const payWithWallet = async (req, res) => {
  const { touristId } = req.params;  // Tourist ID from the URL
  const token = req.headers.authorization.split(" ")[1];  // Token from the headers

  try {
      // Fetch the tourist's details from the database
      const tourist = await Tourist.findById(touristId);

      if (!tourist) {
          return res.status(404).json({ message: "Tourist not found." });
      }

      // Fetch the tourist's cart items
      const cart = await Cart.findOne({ tourist: touristId });

      if (!cart || cart.items.length === 0) {
          return res.status(400).json({ message: "Your cart is empty." });
      }

      // Calculate the total amount to pay for the products in the cart
      const totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

      // Check if the tourist has enough balance in their wallet
      if (tourist.walletBalance < totalAmount) {
          return res.status(400).json({ message: "Insufficient funds in wallet." });
      }

      // Deduct the total amount from the wallet balance
      tourist.walletBalance -= totalAmount;

      // Save the updated wallet balance
      await tourist.save();

      // Optionally, mark the cart as paid or process the order (this depends on your business logic)
      // For example, we can clear the cart after successful payment
      await Cart.updateOne({ tourist: touristId }, { $set: { items: [], paid: true } });

      // Respond with a success message
      return res.status(200).json({ message: "Payment successful.", newWalletBalance: tourist.walletBalance });

  } catch (error) {
      console.error("Error processing payment:", error);
      return res.status(500).json({ message: "Internal server error." });
  }
};

// Checkout Controller
const checkout = async (req, res) => {
  const { touristId } = req.params; // Get touristId from the URL or request
  const { selectedAddressId } = req.body; // Get the selected address ID from the body

  try {
    // Find the tourist by ID and populate the cart with product details
    const tourist = await Tourist.findById(touristId).populate('cart.product');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Find the selected address
    const selectedAddress = tourist.addresses.find(
      (address) => address._id.toString() === selectedAddressId
    );

    if (!selectedAddress) {
      return res
        .status(400)
        .json({ message: 'Selected address not found or invalid' });
    }

    // Calculate the total amount of the products in the cart
    let totalAmount = 0;
    const cartProducts = tourist.cart.map((item) => {
      const product = item.product;
      const totalProductCost = item.quantity * product.price;
      totalAmount += totalProductCost;
      return {
        product: product._id,
        quantity: item.quantity,
      };
    });

    // Create a new checkout entry for the tourist
    const newCheckout = {
      deliveryAddress: selectedAddress.address,
      products: cartProducts,
      totalAmount,
    };

    // Add the checkout entry to the tourist's checkouts array
    tourist.checkouts.push(newCheckout);

    // Optionally, clear the cart after checkout
    tourist.cart = [];
    await tourist.save();

    // Return the checkout details
    res.status(201).json({
      message: 'Checkout successful',
      checkout: newCheckout,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Add a new address
const addAddress = async (req, res) => {
  const { touristId } = req.params;
  const { label, address } = req.body;

  if (!label || !address) {
    return res.status(400).json({ message: 'Label and address are required' });
  }

  try {
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the new address
    tourist.addresses.push({ label, address });
    await tourist.save();

    res.status(201).json({ message: 'Address added successfully', addresses: tourist.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all addresses for a tourist
const getAddresses = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.status(200).json({ addresses: tourist.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


async function updateCartQuantity(req, res) {
  try {
      const { touristId, productId, action } = req.params;

      // Find the tourist
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
          return res.status(404).json({ error: "Tourist not found" });
      }

      // Find the cart item for the product in the tourist's cart
      const cartItem = tourist.cart.find(item => item.product.toString() === productId);
      if (!cartItem) {
          return res.status(404).json({ error: "Product not found in cart" });
      }

      // Fetch the product to get the available quantity
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ error: "Product not found" });
      }

      const availableQuantity = product.quantityAvailable;
      
      // Determine the maximum allowed quantity
      const maxQuantity = availableQuantity;
      const minQuantity = 1; // Ensure the quantity is at least 1 (or any other threshold)

      // Increase or decrease the quantity based on the action
      if (action === 'increase') {
          if (cartItem.quantity < maxQuantity) {
              cartItem.quantity += 1; // Increase quantity by 1
          } else {
              return res.status(400).json({ error: "Cannot increase quantity beyond available stock" });
          }
      } else if (action === 'decrease') {
          if (cartItem.quantity > minQuantity) {
              cartItem.quantity -= 1; // Decrease quantity by 1
          } else {
              return res.status(400).json({ error: "Cannot decrease quantity below 1" });
          }
      }

      // Save the updated tourist cart
      await tourist.save();

      // Return the updated cart
      res.status(200).json(tourist.cart);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to update cart" });
  }
}

async function addToCart(req, res) {
  try {
      const { touristId, productId } = req.params;
      const { quantity } = req.body; // Quantity comes from the body
      const tourist = await Tourist.findById(touristId);
      if (!tourist) throw new Error('Tourist not found');

      const product = await Product.findById(productId);
      if (!product || product.archieved) throw new Error('Product not available');

      const cartItem = tourist.cart.find(item => item.product.toString() === productId);
      if (cartItem) {
          // If product already in cart, update quantity
          cartItem.quantity += quantity;
      } else {
          // Add new product to cart
          tourist.cart.push({ product: productId, quantity });
      }

      await tourist.save();
      res.status(200).json(tourist.cart);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function removeFromCart(req, res) {
  try {
      const { touristId, productId } = req.params;
      const tourist = await Tourist.findById(touristId);
      if (!tourist) throw new Error('Tourist not found');

      tourist.cart = tourist.cart.filter(item => item.product.toString() !== productId);
      await tourist.save();

      res.status(200).json(tourist.cart);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function viewCart(req, res) {
  try {
      const { touristId } = req.params;
      const tourist = await Tourist.findById(touristId).populate('cart.product');
      if (!tourist) throw new Error('Tourist not found');

      const cart = tourist.cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          total: item.product.price * item.quantity
      }));

      res.status(200).json(cart);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}


const applyPromoCode = async (req, res) => {
  const { promoCodeId } = req.body;  // Get the promo code ID from the request body

  try {
    // Find the promo code by ID
    const promoCode = await PromoCode.findById(promoCodeId);

    if (!promoCode) {
      return res.status(404).json({ error: 'iNVALID Promo Code' });  // If the promo code doesn't exist
    }

    // Return the valid promo code details
    return res.status(200).json({
      message: 'Promo code applied successfully',
      promoCode: promoCode,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}













// Create Order
const createOrder = async (req, res) => {
  try {
      const { touristID,  products, totalPrice,deliveryAddress,paymentMethod,} = req.body;

      const newOrder = new Order({
          touristID,
          products,
          totalPrice,
          deliveryAddress,
          paymentMethod,
      });

      await newOrder.save();
      res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Read Order by ID
 const getOrderById = async (req, res) => {
  try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId).populate('touristID').populate('products');
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
      const { id } = req.params;

      // Step 1: Find the order by ID
      const order = await Order.findById(id);
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Step 2: Prevent cancellation if the order is already Shipped or Delivered
      if (['Shipped', 'Delivered'].includes(order.orderStatus)) {
          return res.status(400).json({ 
              message: 'Order cannot be cancelled as it is already Shipped or Delivered' 
          });
      }

      // Step 3: Handle refunds if the order is Paid
      if (order.orderStatus === 'Paid') {
          // Find the tourist associated with the order
          const tourist = await Tourist.findById(order.touristID);
          if (!tourist) {
              return res.status(404).json({ message: 'Tourist not found' });
          }

          // Refund the order total price to the tourist's wallet
          tourist.wallet.balance += order.totalPrice;

          // Record the transaction in the tourist's wallet
          tourist.wallet.transactions.push({
              orderId: id,
              amount: order.totalPrice,
              type: 'addition', // Indicating a refund
              orderType: 'product'
          });

          // Save the updated tourist document
          await tourist.save();
      }

      // Step 4: Update product quantities if applicable
      for (const product of order.products) {
          const productDetails = await Product.findById(product.productID);
          if (!productDetails) {
              return res.status(404).json({ 
                  message: `Product with ID ${product.productID} not found` 
              });
          }

          // Restore the stock for cancelled orders
          productDetails.quantityAvailable += product.quantity;

          // Save the updated product details
          await productDetails.save();
      }

      // Step 5: Update the order status to "Cancelled"
      order.orderStatus = 'Cancelled';
      await order.save();

      // Step 6: Respond to the client
      res.status(200).json({ message: 'Order cancelled successfully', order });

  } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ error: error.message });
  }
};
const changeOrderStatus = async (req, res) => {
  try {
    const { id, newStatus } = req.body; // New status from the request body

    // Validate the new status
    const validStatuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    // Find the order
    const order = await Order.findById(id).populate('products.productID');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Prevent changing status for Delivered orders
    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be updated' });
    }

    // Prevent status change to Cancelled if Shipped or Delivered
    if (newStatus === 'Cancelled' && (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered')) {
      return res.status(400).json({ message: 'Order cannot be cancelled as it is already Shipped or Delivered' });
    }

    if (newStatus === 'Paid') {
      // Iterate over products in the order and create a sale for each
      for (const product of order.products) {
        const productDetails = await Product.findById(product.productID);
    
        if (!productDetails) {
          return res.status(404).json({ message: `Product with ID ${product.productID} not found` });
        }
    
        // Check if there's enough quantity available
        if (productDetails.quantityAvailable < product.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for product with ID ${product.productID}` 
          });
        }
    
        // Deduct the quantity purchased from quantityAvailable
        productDetails.quantityAvailable -= product.quantity;
        if(productDetails.quantityAvailable<=0){

             ///NOTTTTTIIIFICATIONNNNNNNNNNNNNN////
        }
    
        // Save the updated product details
        await productDetails.save();
      }
    }



    if (newStatus === 'Delivered') {
      // Iterate over products in the order and create a sale for each
      for (const product of order.products) {
        const productDetails = await Product.findById(product.productID);
        
        if (!productDetails) {
          return res.status(404).json({ message: `Product with ID ${product.productID} not found` });
        }




        const sale = new SalesModel({
          price: productDetails.price,
          quantityPurchased: product.quantity,
          Tourists: order.touristID,
          Seller: productDetails.seller,
          Product: product.productID,
          ratings: 0,
          reviews: "",
        });


        await sale.save();
      }
        
        const tourist = await Tourist.findById(order.touristID);

        if (!tourist) {
          return res.status(404).json({ message: "Tourist not found" });
        } 

        
        // Calculate loyalty points based on the level
        let pointsEarned = 0;
        if (tourist.Level === 1) {
          pointsEarned = order.totalPrice * 0.5;
        } else if (tourist.Level === 2) {
          pointsEarned = order.totalPrice * 1;
        } else if (tourist.Level === 3) {
          pointsEarned = order.totalPrice * 1.5;
        }

        // Update Points, TotalPoints, and Level
        tourist.Points += pointsEarned;
        tourist.TotalPoints += pointsEarned;

        // Update Level based on new TotalPoints
        if (tourist.TotalPoints > 500000) {
          tourist.Level = 3;
        } else if (tourist.TotalPoints > 100000) {
          tourist.Level = 2;
        } else {
          tourist.Level = 1;
        }

        await tourist.save();
    }

    // Update the status
    order.orderStatus = newStatus;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersByTourist = async (req, res) => {
  try {
      const { touristID } = req.body;


      // Check if the touristID is a valid ObjectId and cast it if necessary
      if (!mongoose.Types.ObjectId.isValid(touristID)) {
          return res.status(400).json({ message: 'Invalid tourist ID' });
      }

      // Find all orders for the given tourist ID
      const orders = await Order.find({ touristID: new mongoose.Types.ObjectId(touristID) }).populate('products');

      // Check if orders exist
      if (orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this tourist' });
      }

      res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const updateOrderDetails = async (req, res) => {
  const { orderId, deliveryAddress, paymentMethod, totalPrice } = req.body; // Include totalPrice in the request body

  // Validate input
  if (!orderId || (!deliveryAddress && !paymentMethod && totalPrice === undefined)) {
    return res.status(400).json({
      error: 'Order ID, delivery address, payment method, or total price is missing.',
    });
  }

  try {
    // Build the update object dynamically based on provided fields
    const updateFields = {
      ...(deliveryAddress && { deliveryAddress }), // Update delivery address if provided
      ...(paymentMethod && { paymentMethod }), // Update payment method if provided
      ...(totalPrice !== undefined && { totalPrice }), // Update total price if provided
    };

    // Find the order and update it
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateFields,
      { new: true, runValidators: true } // Return updated document and apply schema validators
    );

    // Check if order exists
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Respond with the updated order
    res.status(200).json({
      message: 'Order updated successfully.',
      order: updatedOrder,
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({
      error: 'An error occurred while updating the order.',
    });
  }
};
















// Function to share via email using Tourist model
shareViaEmail = async (req, res) => {
  const { touristIds, subject, body } = req.body;

  // Validate the request body
  if (!touristIds || !Array.isArray(touristIds) || touristIds.length === 0) {
    return res.status(400).json({ error: 'No tourist IDs provided' });
  }
  if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and body are required' });
  }

  try {
    // Fetch emails of the specified tourists from the database
    const tourists = await Tourist.find({ _id: { $in: touristIds } }, 'email');
    const emails = tourists.map((tourist) => tourist.email);

    if (emails.length === 0) {
      return res.status(404).json({ error: 'No valid emails found for the given tourist IDs' });
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
        user: 'your-email@example.com', // Your email
        pass: 'your-email-password', // Your email password or app-specific password
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: 'jetsetgo212@gmail.com', // Sender address
      to: emails.join(','), // Recipient emails, joined as a string
      subject, // Subject line
      text: body, // Plain text body
    });

    console.log('Email sent: %s', info.messageId);
    return res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send emails.' });
  }
};


const getTagNameById = async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findById(tagId, "tag_name"); // Only select `tag_name`

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json({ tag_name: tag.tag_name });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tag name" });
  }
};

const getCategoryNameById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId, "name");

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ name: category.name });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category name" });
  }
};

const createTransportBooking = async (req, res) => {
  const { transportationId, touristId, date, seats } = req.body;

  try {
    // Find the transportation record
    const transportation = await Transportation.findById(transportationId);
    if (!transportation) {
      return res.status(404).json({ error: "Transportation not found" });
    }
    const newTransportBooking = await TransportBooking.create({
      transportationId,
      touristId,
      date,
      seats,
    });
    // Respond with the created booking
    res.status(201).json(newTransportBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTransportBooking };
// Read Transportation
const getTransportBooking = async (req, res) => {
  // const { id } = req.params;

  try {
    const TransportBookingProfile = await TransportBooking.find();
    res.status(200).json(TransportBookingProfile);
  } catch (err) {
    res.status(404).json({ error: "Transportation Booking not found" });
  }
};

//Delete Transportation
const deleteTransportBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteTransportBooking = await TransportBooking.findById(id);

    if (!deleteTransportBooking) {
      return res
        .status(404)
        .json({ message: "Transportation Booking not found" });
    } else {
      const bookingDate = deleteTransportBooking.date;
      const hoursDiff = (new Date(bookingDate) - new Date()) / (1000 * 60 * 60);

      if (hoursDiff < 48) {
        return res
          .status(400)
          .json({ message: "Cannot cancel within 48 hours" });
      } else {
        await TransportBooking.deleteOne({ _id: deleteTransportBooking._id });
        res
          .status(200)
          .json({ message: "Transportation Booking deleted successfully" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectPrefrences = async (req, res) => {
  const { id } = req.params;
  const {tags,budget} = req.body;

  const updates ={
    tags, 
    budget:{
      from:budget.from,
      to:budget.to,
    },
  };

  try {
    const myPrefrences = await Tourist.findByIdAndUpdate(id, {$set:{ prefrences :updates}}, { new: true });
    res.status(200).json(myPrefrences);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPrefrences = async (req, res) => {
  const { id } = req.params;
  console.log(id);

   try {
     const TouristProfile = await Tourist.findById(id);
     console.log(TouristProfile.preferences);
     const PrefrencesProfile = TouristProfile.prefrences;
     res.status(200).json(PrefrencesProfile);
   } catch (err) {
     res.status(404).json({ error: 'Tourist not found' });
   }
 };

const multer = require("multer");

// get all products
const getProducts = async (req, res) => {
  try {
    // Fetch products that are not archived
    const products = await Product.find({ archieved: false, quantityAvailable: { $gt: 0 } }).sort({
      createdAt: -1,
    });
    res.status(200).json(products); // Return the filtered products
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to retrieve products" }); // Handle any errors
  }
};


const filterProducts = async (req, res) => {
  const { min, max } = req.query;

  try {
    const query = {
      price: {
        $gte: min, // Greater than or equal to minPrice
        $lte: max, // Less than or equal to maxPrice
      },archieved:false
    };
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sortByRate = async (req, res) => {
  const { flag } = req.query; // Use req.query here
  var x = 0;
  try {
    if (flag == "1") {
      x = 1;
    } else {
      x = -1;
    }
    // Get sorted products by ratings in descending order
    const products = await Product.find({archieved:false}).sort({ ratings: x }); // Change to 1 for ascending order and -1 for descending
    res.status(200).json(products); // Send the sorted products as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
};

const searchProductName = async (req, res) => {
  const { name } = req.body;

  try {
    // Use RegEx to match the substring in the product's name (case-insensitive)
    const productname = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    res.status(200).json(productname);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update tourist information
const updateInfo = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.username || updates.wallet) {
      return res
        .status(403)
        .json({ error: "You cannot edit username or wallet" });
    }
    const updatedInfo = await Tourist.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json(updatedInfo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get tourist information
const getInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Tourist.findById(id);
    res.status(200).json(profile);
  } catch (err) {
    res.status(404).json({ error: "Profile not found" });
  }
};

//Search Historical Location by Name
const searchHistoricalPlaceByName = async (req, res) => {
  const nameReq = req.body;
  try {
    const Historical = await HistoricalLocationModel.find(nameReq);
    if (Historical.length == 0) {
      return res.status(404).json({ error: "Historical Place not found" });
    }
    res.status(200).json(Historical);
  } catch (error) {
    res.status(404).json({ error: "Historical Place not found here" });
  }
};

//Search Historical Location by Category
const searchHistoricalPlaceByCategory = async (req, res) => {
  const nameReq = req.body;
  try {
    const Historical = await HistoricalLocationModel.find(nameReq);
    if (Historical.length == 0) {
      return res.status(404).json({ error: "Historical Place not found" });
    }
    res.status(200).json(Historical);
  } catch (error) {
    res.status(404).json({ error: "Historical Place not found" });
  }
};

//Search Historical Location by Tag
const searchHistoricalPlaceByTag = async (req, res) => {
  const { tagId } = req.body; // Extract tagId from the request body (already an ObjectId)

  try {
    const Historical = await HistoricalLocationModel.find(req.body);
    if (Historical.length == 0) {
      return res.status(404).json({ error: "Historical Place not found" });
    }
    res.status(200).json(Historical);
  } catch (error) {
    res.status(404).json({ error: "Historical Place not found" });
  }
};

//Search Museum by Tag
const searchMuseumByTag = async (req, res) => {
  const { tagId } = req.body; // Extract tagId from the request body (already an ObjectId)

  try {
    // Step 1: Find Activities that have the tagId in their tags array
    const activities = await MuseumModel.find({ tags: tagId }).populate("tags"); // Optional: populate 'tags' to return tag details

    if (activities.length === 0) {
      return res
        .status(404)
        .json({ error: "No activities found for this tag" });
    }

    // Step 2: Return the list of activities
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for activities" });
  }
};

//Search Museum by Name
const searchMuseumByName = async (req, res) => {
  const nameReq = req.body;
  try {
    const Museum = await MuseumModel.find(nameReq);

    res.status(200).json(Museum);
  } catch (error) {
    res.status(404).json({ error: "Museum not found" });
  }
};

//Search Museum by Category
const searchMuseumByCategory = async (req, res) => {
  const nameReq = req.body;
  try {
    const Museum = await MuseumModel.find(nameReq);
    if (Museum.length == 0) {
      return res.status(404).json({ error: "Museum not found" });
    }
    res.status(200).json(Museum);
  } catch (error) {
    res.status(404).json({ error: "Museum not found" });
  }
};

//Seach Itinerary by budget
const searchItineraryByBudget = async (req, res) => {
  const budget = req.body;
  try {
    const itinerary = await Itinerary.find({
      active: true,
      flagged: false,
    });
    const result = itinerary.filter((el) => el.price <= budget.price);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: "Itinerary not found" });
  }
};

//Search Itinerary By date

const searchItineraryByDate = async (req, res) => {
  const { availableDates } = req.body; // Extracting availableDates from request body

  try {
    // Extract the date from the availableDates array (it should match any of the dates in the DB)
    const searchDate = new Date(availableDates[0].date); // Assuming the request contains one date

    // Find all itineraries where any availableDates in the array matches the search date
    const itineraries = await Itinerary.find({
       "availableDates.date": searchDate,
        active: true,
        flagged: false,
       // Check all availableDates in each itinerary
    });
    //console.log(req.body)
    //const itineraries = await Itinerary.find(req.body)

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching for itineraries" });
  }
};

//Search Itinerary By Language
const searchItineraryByLanguage = async (req, res) => {
  const languageReq = req.body;
  try {
    const itinerary = await Itinerary.find(languageReq,{
      active: true,
      flagged: false,
    });
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(404).json({ error: "Itinerary not found" });
  }
};

//Search Itinerary By Name
const searchItineraryByName = async (req, res) => {
  const name = req.body;
  try {
    const itinerary = await Itinerary.find(name,{
      active: true,
      flagged: false,
    });
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(404).json({ error: "Itinerary not found" });
  }
};

//Search Itinerary By category
const searchItineraryByCategory = async (req, res) => {
  const category = req.body;
  try {
    const itinerary = await Itinerary.find(category,{
      active: true,
      flagged: false,
    });
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(404).json({ error: "Itinerary not found" });
  }
};

//Search Itinerary By tag
const searchItineraryByTag = async (req, res) => {
  const { tagId } = req.body; // Extract tagId from the request body (already an ObjectId)

  try {
    // Step 1: Find itineraries that have the tagId in their tags array
    const itineraries = await Itinerary.find({ tags: tagId,
      active: true,
      flagged: false,
     }).populate("tags"); // Optional: populate 'tags' to return tag details

    // Step 2: Return the list of itineraries
    res.status(200).json(itineraries);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for itineraries" });
  }
};

//Seach Activity by date
const searchActivityByDate = async (req, res) => {
  const dateReq = req.body;
  try {
    const activty = await Activity.find(dateReq);
    if (activty.length === 0) {
      return res
        .status(404)
        .json({ error: "No activities found on this date" });
    }
    res.status(200).json(activty);
  } catch (error) {
    res.status(404).json({ error: "Activity not found" });
  }
};

//Seach Activity by rating 
const searchActivityByRating = async (req,res) =>{
  const ratingReq = req.body
  try{
    console.log(ratingReq)
    const activty = await Activity.find(ratingReq)
    res.status(200).json(activty)
  }
  catch(error){
    res.status(400).json({error:"Activity not found"})
  }
};

//Seach Activity by budget
const searchActivityByBudget = async (req, res) => {
  const budget = req.body;

  try {
    const activty = await Activity.find();
    if (activty.length === 0) {
      return res.status(404).json({ error: "No activities found" });
    }
    const result = activty.filter((el) => el.price <= budget.price);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: "Activity not found" });
  }
};

//Search Activity by name
const searchActivityByName = async (req, res) => {
  const activityName = req.body;
  try {
    const activty = await Activity.find(activityName);
    if (activty.length === 0) {
      return res.status(404).json({ error: "No activities found" });
    }
    res.status(200).json(activty);
  } catch (error) {
    res.status(404).json({ error: "Activity not found" });
  }
};

//Seach Activity by category
const searchActivityByCategory = async (req, res) => {
  const categoryName = req.body;
  try {
    const activty = await Activity.find(categoryName);
    if (activty.length === 0) {
      return res.status(404).json({ error: "No activities found" });
    }
    res.status(200).json(activty);
  } catch (error) {
    res.status(404).json({ error: "Activity not found" });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Retrieve all categories
    res.status(200).json(categories); // Send categories as JSON
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching categories" });
  }
};

// Fetch activities by category
const getActivitiesByCategory = async (req, res) => {
  const { categoryId } = req.params; // Extract category ID from the request params

  try {
    // Query activities where the category matches the provided categoryId
    const activities = await Activity.find({ category: categoryId }).populate(
      "category"
    ); // Optionally populate category details

    if (activities.length === 0) {
      return res
        .status(404)
        .json({ error: "No activities found for this category" });
    }

    res.status(200).json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching activities" });
  }
};


//Search TagId by Name
// In your backend file

const getTagIdByName = async (req, res) => {
  const { name } = req.body;
  console.log("Received name:", name); // Log to ensure `name` is received correctly

  try {
      const tag = await Tag.findOne({ tag_name: name }); // Use tag_name instead of name
      if (tag) {
          console.log("Tag found:", tag); // Log the tag object if found
          res.status(200).json({ tagId: tag._id });
      } else {
          console.log("No tag found with name:", name); // Log if no match is found
          res.status(404).json({ error: "Tag not found" });
      }
  } catch (error) {
      console.error("Error fetching tag ID:", error);
      res.status(500).json({ error: "An error occurred while fetching tag ID" });
  }
};


//Search Activity By Tag
const searchActivityByTag = async (req, res) => {
  let { tagId } = req.body; // Expect tagId as a string
  

  try {
    // Search for activities with this tagId
    const activities = await Activity.find({ tags : { $in: [tagId] } }).populate('tags');

    if (activities.length === 0) {
      return res.status(404).json({ error: "No activities found for this tag" });
    }

    // Return the list of activities
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error in searchActivityByTag:', error);
    res.status(500).json({ error: "An error occurred while searching for activities" });
  }
};






const getUpcomingActivities = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const upcomingActivities = await Activity.find({
      date: { $gte: currentDate }, // Find activities with a date greater than or equal to the current date
    });

    res.status(200).json(upcomingActivities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a unique name
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage }).single("picture");

const sortActivityByPrice = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedActivityByPrice = await Activity.find({
      date: { $gte: currentDate }, // Find activities with a date greater than or equal to the current date
    }).sort({ price: 1 });
    res.status(200).json(sortedActivityByPrice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sortActivityByRating = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedActivityByRating = await Activity.find({
      date: { $gte: currentDate }, // Find activities with a date greater than or equal to the current date
    }).sort({ rating: 1 });
    res.status(200).json(sortedActivityByRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUpcomingItineraries = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date

    const upcomingItineraries = await Itinerary.find({
      availableDates: {
        $elemMatch: {
          date: { $gte: currentDate }, // Check if at least one date is greater than or equal to the current date
        },
      },active : true, flagged:false
    });

    res.status(200).json(upcomingItineraries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sortItineraryByPrice = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedItineraryByPrice = await Itinerary.find({
      availableDates: {
        $elemMatch: {
          date: { $gte: currentDate }, // Check if at least one date is greater than or equal to the current date
        },
      },
        active: true,
        flagged: false,
      }
    ).sort({ price: 1 });
    res.status(200).json(sortedItineraryByPrice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sortItineraryByRating = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedItineraryByRating = await Itinerary.find({
      availableDates: {
        $elemMatch: {
          date: { $gte: currentDate }, // Check if at least one date is greater than or equal to the current date
        },
      },
        active: true,
        flagged: false,
      }
    ).sort({ rating: 1 });
    res.status(200).json(sortedItineraryByRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMuseums = async (req, res) => {
  try {
    const museum = await MuseumModel.find();
    res.status(200).json(museum);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const filterMuseumsByTag = async (req, res) => {
  try {
    const { id } = req.params;

    // Query museums where the tags array contains the given tagId
    const museums = await MuseumModel.find({ tags: id });

    if (museums.length === 0) {
      return res
        .status(404)
        .json({ message: "No museums found with the given tag" });
    }

    res.status(200).json(museums);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getHistoricalLocations = async (req, res) => {
  try {
    const historicalLocation = await HistoricalLocationModel.find();
    res.status(200).json(historicalLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const filterHistoricalLocationsByTag = async (req, res) => {
  try {
    const { id } = req.params;
    // Query historical locations where the tags array contains the given tagId
    const historicalLocations = await HistoricalLocationModel.find({
      tags: id,
    });

    if (historicalLocations.length === 0) {
      return res
        .status(404)
        .json({ message: "No historical locations found with the given tag" });
    }

    res.status(200).json(historicalLocations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getComplaints = async (req, res) => {
  const { id } = req.params; // Extract touristId from route parameters

  try {
    // Find complaints for the given userId and populate the user's username
    const complaints = await ComplaintModel.find({ userId: id })
      .populate({
        path: 'userId',         // Path to populate, assuming it's named `userId`
        select: 'username',     // Field to retrieve from the `Tourist` model (the username)
        model: 'Tourist'        // The referenced model is 'Tourist'
      })
      .sort({ createdAt: -1 });  // Sorting complaints by the createdAt date in descending order

    if (complaints.length === 0) {
      return res
        .status(404)
        .json({ message: "No complaints found for this tourist." });
    }
    console.log(complaints)

    res.status(200).json(complaints); // Return the complaints with populated username
  } catch (error) {
    console.error(error); // Log error details
    res.status(500).json({ error: "Failed to retrieve complaints." }); // Return error message
  }
};

const ADDRateReview = async (req, res) => {
  const { reviews, ratings, touristId, productId } = req.body;
  console.log(req.body);

  try {
    // Find the sale record based on tourist and product IDs
    const sale = await SalesModel.findOne({
      Tourists: touristId,
      Product: productId,
    });
    console.log(sale);

    if (!sale) {
      return res
        .status(404)
        .json({ error: "Sale record not found for this tourist and product." });
    }

    // Add the rating and review
    sale.reviews = reviews; // Assuming sale.reviews is a single value; if it's an array, use sale.reviews.push(reviews)
    sale.ratings = ratings; // Assuming sale.ratings is a single value; if it's an array, use sale.ratings.push(ratings)

    await sale.save();

    res.status(200).json({
      message: "Rating and review added successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error adding rating and review: ${error.message}` });
  }
};




const addSalesI = async (req, res) => {
  console.log(req.body);
  const {
    price,
    touristId,
    ItineraryId,
    TourguideId,
  } = req.body;

  if (!price || !touristId || !ItineraryId || !TourguideId) {
    return res
      .status(400)
      .json({
        error:
          "All fields are required: price, touristId, ItineraryId, and TourguideId.",
      });
  }

  try {
    // Create a new sale
    const sale = await SalesIModel.create({
      price: price,
      Tourists: touristId, // Make sure the field names match your schema
      TourGuide: TourguideId,
      Itinerary: ItineraryId,
    });

    res.status(201).json(sale); // Use 201 status for created resource
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addSalesA= async (req, res) => {
  console.log(req.body);
  const {
    price,
    touristId,
    ActivityId,
    AdvertiserId,
  } = req.body;

  if (!price || !touristId || !ActivityId || !AdvertiserId) {
    return res
      .status(400)
      .json({
        error:
          "All fields are required: price, touristId, ActivityId, and AdvertiserId.",
      });
  }

  try {
    // Create a new sale
    const sale = await SalesAModel.create({
      price: price,
      Tourists: touristId, // Make sure the field names match your schema
      Advertiser: AdvertiserId,
      Activity: ActivityId,
    });

    res.status(201).json(sale); // Use 201 status for created resource
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




const addSales = async (req, res) => {
  console.log(req.body);
  const {
    price,
    quantityPurchased,
    touristId,
    productId,
    sellerId,
    ratings,
    reviews,
  } = req.body;

  if (!price || !quantityPurchased || !touristId || !productId || !sellerId) {
    return res
      .status(400)
      .json({
        error:
          "All fields are required: price, quantityPurchased, touristId, productId, and sellerId.",
      });
  }

  try {
    // Create a new sale
    const sale = await SalesModel.create({
      price: price,
      quantityPurchased: quantityPurchased,
      Tourists: touristId, // Make sure the field names match your schema
      Seller: sellerId,
      Product: productId,
      reviews: reviews,
      ratings: ratings,
    });

    res.status(201).json(sale); // Use 201 status for created resource
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addComplaint = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming touristId is passed in the URL
    const tourist = await Tourist.findById(userId);

    const { title, body, date } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Create a new complaint
    const complaint = new ComplaintModel({
      userId,
      title,
      body,
      date: date || Date.now(), // If date is not provided, use the current date
    });

    // Save the complaint
    const savedComplaint = await complaint.save();

    // Return the saved complaint
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error("Error adding complaint:", error);
    res.status(500).json({ error: "Server error while adding complaint" });
  }
};

// Function to update wallet by converting points to EGP
async function updatePointsToWallet(req, res) {
  try {
    const { touristId } = req.params; // Assuming touristId is passed in the URL
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if points are sufficient for conversion
    if (tourist.Points >= 10000) {
      const egpToAdd = Math.floor(tourist.Points / 10000) * 100;
      const remainingPoints = tourist.Points % 10000;

      // Update Points and wallet fields
      tourist.Points = remainingPoints;
      tourist.wallet += egpToAdd;

      await tourist.save();
      return res
        .status(200)
        .json({ message: "Wallet updated successfully", tourist });
    } else {
      return res
        .status(200)
        .json({ message: "Not enough points for conversion", tourist });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
}

async function payForItinerary(req, res) {
  try {
    const { touristId } = req.params; // Assuming touristId is passed in the URL
    const { itineraryId } = req.body; // Receive itineraryId from the body

    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the itinerary the tourist is paying for
    const itinerary = await Itinerary.findById(itineraryId,{
      active: true,
      flagged: false,
    });
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Use the price from the itinerary as the amount to be paid
    const amountPaid = itinerary.price;

    // Check if the tourist has enough balance in their wallet
    if (tourist.wallet < amountPaid) {
      return res.status(400).json({ message: "Insufficient funds in wallet" });
    }

    // Deduct the amount from the wallet
    tourist.wallet -= amountPaid;

    // Calculate loyalty points based on the level
    let pointsEarned = 0;
    if (tourist.Level === 1) {
      pointsEarned = amountPaid * 0.5;
    } else if (tourist.Level === 2) {
      pointsEarned = amountPaid * 1;
    } else if (tourist.Level === 3) {
      pointsEarned = amountPaid * 1.5;
    }

    // Update Points, TotalPoints, and Level
    tourist.Points += pointsEarned;
    tourist.TotalPoints += pointsEarned;

    // Update Level based on new TotalPoints
    if (tourist.TotalPoints > 500000) {
      tourist.Level = 3;
    } else if (tourist.TotalPoints > 100000) {
      tourist.Level = 2;
    } else {
      tourist.Level = 1;
    }

    await tourist.save();

    // Update the itinerary's booked status and add the tourist to participants
    itinerary.isBooked = true;
    itinerary.Tourists.push(tourist._id);
    await itinerary.save();

    return res.status(200).json({
      message: "Payment successful, wallet and points updated",
      tourist,
      itinerary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
}

async function payForActivity(req, res) {
  try {
    const { touristId } = req.params; // Assuming touristId is passed in the URL
    const { activityId } = req.body; // Receive touristId and activityId from the body

    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity the tourist is paying for
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Use the price from the activity as the amount to be paid
    const amountPaid = activity.price;

    // Check if the tourist has enough balance in their wallet
    if (tourist.wallet < amountPaid) {
      return res.status(400).json({ message: "Insufficient funds in wallet" });
    }

    // Deduct the amount from the wallet
    tourist.wallet -= amountPaid;

    // Calculate loyalty points based on the level
    let pointsEarned = 0;
    if (tourist.Level === 1) {
      pointsEarned = amountPaid * 0.5;
    } else if (tourist.Level === 2) {
      pointsEarned = amountPaid * 1;
    } else if (tourist.Level === 3) {
      pointsEarned = amountPaid * 1.5;
    }

    // Update Points, TotalPoints, and Level
    tourist.Points += pointsEarned;
    tourist.TotalPoints += pointsEarned;

    // Update Level based on new TotalPoints
    if (tourist.TotalPoints > 500000) {
      tourist.Level = 3;
    } else if (tourist.TotalPoints > 100000) {
      tourist.Level = 2;
    } else {
      tourist.Level = 1;
    }

    await tourist.save();

    // Update the activity's booked status and add the tourist to participants
    activity.isBooked = true;
    activity.Tourists.push(tourist._id);
    await activity.save();

    return res.status(200).json({
      message: "Payment successful, wallet and points updated",
      tourist,
      activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
}



const getTouristActivities = async (req, res) => {
  try {
    const { touristId } = req.params;

    const activities = await Activity.find({ Tourists: touristId }).populate('comments.postedby', 'name');

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const rateActivity = async (req, res) => {
  try {
    const { _id, star, activityId } = req.body;

    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    let alreadyRated = activity.ratings.find(
      (rating) => rating.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      await Activity.updateOne(
        { _id: activityId, "ratings._id": alreadyRated._id },
        {
          $set: { "ratings.$.star": star },
        },
        { new: true }
      );
    } else {
      await Activity.findByIdAndUpdate(
        activityId,
        {
          $push: { ratings: { star, postedby: _id } },
        },
        { new: true }
      );
    }

    const getAllRatings = await Activity.findById(activityId);
    if (!getAllRatings) {
      return res.status(404).json({ message: "Activity not found" });
    }

    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);

    let finalActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );

    res.json(finalActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const isCommentByTourist = async (req, res) => {
  try {
    const { touristId, commentId } = req.body;

    // Find the activity containing the comment by the commentId
    const activity = await Activity.findOne({
      "comments._id": commentId
    });

    if (!activity) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Find the specific comment
    const comment = activity.comments.id(commentId);

    // Check if the comment was posted by the given touristId
    if (comment.postedby.toString() === touristId) {
      res.json(true); // The comment was posted by the user
    } else {
      res.json(false); // The comment was not posted by the user
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCommentToActivity = async (req, res) => {
  try {
    // const _id = req.user._id;
    const { _id, activityId, text } = req.body;

    // Find the activity by its ID and add the comment
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        $push: { comments: { text, postedby: _id } },
      },
      { new: true } // Return the updated document
    ).populate("comments.postedby", "name"); // Optionally, populate the user info

    res.json(updatedActivity); // Return the updated activity with the new comment
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCommentFromActivity = async (req, res) => {
  try {
    const { _id, activityId, commentId } = req.body;
    // const _id = req.user._id;

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        $pull: { comments: { _id: commentId, postedby: _id } }, // Remove the comment if it matches the user's ID
      },
      { new: true } // Return the updated document
    );

    if (!updatedActivity) {
      return res
        .status(404)
        .json({ message: "Comment not found or not authorized to delete" });
    }

    res.json(updatedActivity); // Return the updated activity after deleting the comment
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const findReference = async (referenceId) => {
//   const event = await Activity.findById(referenceId);
//   if (event) return { reference: event, referenceType: 'Activity' };

//   const itinerary = await Itinerary.findById(referenceId);
//   if (itinerary) return { reference: itinerary, referenceType: 'Itinerary' };

//   return null;
// };

const book_activity_Itinerary = async (req, res) => {
  try {
    const { tourist, referenceId } = req.body;
    const reference =
      (await Activity.findById(referenceId)) ||
      (await Itinerary.findById(referenceId,{
        active: true,
        flagged: false,
      }));

    if (!reference) {
      return res
        .status(404)
        .json({ message: "No Activity or itinerary found with the given ID" });
    }
    const referenceType =
      reference instanceof Activity ? "Activity" : "Itinerary";

    const booking = new Booking({ tourist, referenceId, referenceType });
    await booking.save();
    const touristt = await Tourist.findById(tourist);
    touristt.BookedAnything = true;
    await touristt.save();

    if (referenceType === "Activity") {
      await Activity.findByIdAndUpdate(
        referenceId,
        { $push: { Tourists: tourist } },
        { new: true }
      );
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addBookMarkedActivities = async (req, res) => {
  const { id } = req.params;  // Get itineraryId from the request params
  const { touristId } = req.body;         // Get touristId from the request body
  
  try {
    // Find the itinerary by the itineraryId
    const activity = await Activity.findById(id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    // Find the tourist by the touristId
    const tourist = await Tourist.findById(touristId); // Assuming you have a Tourist model
    if (!tourist) return res.status(404).json({ error: "Tourist not found" });

    // Check if the itinerary is already in the tourist's bookmarks
    if (tourist.ActivitiesBookmarked.includes(id)) {
      return res.status(400).json({ message: "This itinerary is already bookmarked" });
    }

    // Add the itineraryId to the ItinerariesBookmarked array
    tourist.ActivitiesBookmarked.push(id);
    
    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    return res.status(200).json({ message: "Itinerary bookmarked successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while processing the bookmarking request.",
    });
  }
};


const getBookmarkedActivities = async (req, res) => {
  const { id } = req.params;  // Get touristId from the request params

  try {
    // Find the tourist by the touristId
    const tourist = await Tourist.findById(id).populate('ActivitiesBookmarked');  // Populate the itineraries

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Return the itineraries in the ItinerariesBookmarked array
    return res.status(200).json({
      message: "Bookmarked itineraries retrieved successfully",
      activities: tourist.ActivitiesBookmarked,  // This will return an array of itinerary documents
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the bookmarked itineraries.",
    });
  }
};

const removeBookmarkedActivities = async (req, res) => {
  const { touristId, activityId } = req.params;  // Get touristId and itineraryId from request params
  
  try {
    // Find the tourist by the touristId
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the itinerary is in the tourist's bookmarks
    if (!tourist.ActivitiesBookmarked.includes(activityId)) {
      return res.status(400).json({ message: "This itinerary is not bookmarked by the tourist" });
    }

    // Remove the itineraryId from the ItinerariesBookmarked array
    tourist.ActivitiesBookmarked.pull(activityId);
    
    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    return res.status(200).json({ message: "Itinerary removed from bookmarks successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while removing the itinerary from bookmarks.",
    });
  }
};



const addBookMarked = async (req, res) => {
  const { id } = req.params;  // Get itineraryId from the request params
  const { touristId } = req.body;         // Get touristId from the request body
  
  try {
    // Find the itinerary by the itineraryId
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });

    // Find the tourist by the touristId
    const tourist = await Tourist.findById(touristId); // Assuming you have a Tourist model
    if (!tourist) return res.status(404).json({ error: "Tourist not found" });

    // Check if the itinerary is already in the tourist's bookmarks
    if (tourist.ItinerariesBookmarked.includes(id)) {
      return res.status(400).json({ message: "This itinerary is already bookmarked" });
    }

    // Add the itineraryId to the ItinerariesBookmarked array
    tourist.ItinerariesBookmarked.push(id);
    
    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    return res.status(200).json({ message: "Itinerary bookmarked successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while processing the bookmarking request.",
    });
  }
};


const getBookmarkedItineraries = async (req, res) => {
  const { id } = req.params;  // Get touristId from the request params

  try {
    // Find the tourist by the touristId
    const tourist = await Tourist.findById(id).populate('ItinerariesBookmarked');  // Populate the itineraries

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Return the itineraries in the ItinerariesBookmarked array
    return res.status(200).json({
      message: "Bookmarked itineraries retrieved successfully",
      itineraries: tourist.ItinerariesBookmarked,  // This will return an array of itinerary documents
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the bookmarked itineraries.",
    });
  }
};

const removeBookmarkedItinerary = async (req, res) => {
  const { touristId, itineraryId } = req.params;  // Get touristId and itineraryId from request params
  
  try {
    // Find the tourist by the touristId
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the itinerary is in the tourist's bookmarks
    if (!tourist.ItinerariesBookmarked.includes(itineraryId)) {
      return res.status(400).json({ message: "This itinerary is not bookmarked by the tourist" });
    }

    // Remove the itineraryId from the ItinerariesBookmarked array
    tourist.ItinerariesBookmarked.pull(itineraryId);
    
    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    return res.status(200).json({ message: "Itinerary removed from bookmarks successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while removing the itinerary from bookmarks.",
    });
  }
};


const getTouristBookedActivities = async (req, res) => {
  try {
    const { touristId } = req.params;
    console.log("jjnjnj"+touristId);
    // Find all bookings for the tourist
    const bookings = await Booking.find({ tourist: touristId });

    // Extract reference IDs and types from bookings
    const activityIds = bookings
      .filter(booking => booking.referenceType === 'Activity')
      .map(booking => booking.referenceId);

    const itineraryIds = bookings
      .filter(booking => booking.referenceType === 'Itinerary')
      .map(booking => booking.referenceId);

    // Find activities and itineraries based on IDs
    const activities = await Activity.find({ _id: { $in: activityIds } })
    //.populate('comments.postedby', 'name');
    const itineraries = await Itinerary.find({ _id: { $in: itineraryIds } },{
      active: true,
      flagged: false,
    })
    //.populate('comments.postedby', 'name');

    res.json({ activities, itineraries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Create a new flight booking
const createFlightBooking = async (req, res) => {
  const { touristId, flightId, origin, destination, departureDate, returnDate, price, duration } = req.body;

  try {
    // Validate touristId format
    if (!mongoose.Types.ObjectId.isValid(touristId)) {
      return res.status(400).json({ message: 'Invalid tourist ID format' });
    }

    // Convert touristId to an ObjectId
    const touristObjectId = new mongoose.Types.ObjectId(touristId);

    // Check if the tourist exists
    const tourist = await Tourist.findById(touristObjectId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Create a new flight booking
    const newBooking = new FlightBooking({
      touristId: touristObjectId,
      flightId,
      origin,
      destination,
      departureDate,
      returnDate,
      price,
      duration,
    });

    // Save the booking to the database
    await newBooking.save();

    // Respond with success
    res.status(201).json({ message: 'Flight booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating flight booking:', error);
    res.status(500).json({ message: 'Failed to create flight booking' });
  }
};



const cancel_booking = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const booking = await Booking.findById(booking_id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const reference =
      (await Activity.findById(booking.referenceId)) ||
      (await Itinerary.findById(booking.referenceId,{
        active: true,
        flagged: false,
      }));

    if (!reference) {
      return res
        .status(404)
        .json({ message: `${booking.referenceType} not found` });
    }

    let eventDate;

    if (reference instanceof Activity) {
      eventDate = reference.date;
    } else if (
      reference instanceof Itinerary &&
      reference.availableDates.length > 0
    ) {
      eventDate = reference.availableDates[0].date;
    }

    if (!eventDate) {
      return res
        .status(404)
        .json({ message: "No valid date found for cancellation" });
    }
    const hoursDiff = (new Date(eventDate) - new Date()) / (1000 * 60 * 60);

    if (hoursDiff < 48) {
      return res.status(400).json({ message: "Cannot cancel within 48 hours" });
    }

    await Booking.deleteOne({ _id: booking_id });

    // Remove the tourist from the Tourists array in the Activity model
    if (booking.referenceType === "Activity") {
      await Activity.findByIdAndUpdate(
        booking.referenceId,
        { $pull: { Tourists: booking.tourist } },
        { new: true }
      );
    }

    res.status(200).json({ message: "Booking canceled and tourist removed from the activity" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const myTransportBooking = async (req, res) => {
  const { touristId } = req.params;

  try {
    const TransportBookingProfile = await TransportBooking.find({ touristId });
    res.status(200).json(TransportBookingProfile);
  } catch (err) {
    res.status(404).json({ error: 'Transportation Booking not found' });
  }
};





// controllers/hotelBookingController.js
// controllers/hotelBookingController.js
const HotelBooking = require("../models/HotelBooking");
const TouristModels = require("../models/TouristModels");

const createBooking = async (req, res) => {
    const { touristId, ...bookingData } = req.body; // Extract touristId from request body
    try {
        const booking = new HotelBooking({ touristId, ...bookingData });
        await booking.save();
        res.status(201).json({ message: "Booking saved successfully", booking });
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({ message: "Error saving booking", error });
    }
};



const fetchID = async (req, res) => {
  try {
    const { touristId } = req.params; // Assuming touristId is passed in the URL
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json(tourist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const fetchActivityID = async (req, res) => {
  const { activityId } = req.params;
  const activity = await Activity.findById(activityId); // Replace Activity with your model

  try {
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};

const fetchItineraryID = async (req, res) => {
  const { itineraryId } = req.params;
  const itinerary = await Itinerary.findById(itineraryId,{
    active: true,
    flagged: false,
  }); // Replace Itinerary with your model

  try {
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};

const requestAccountDeletion = async (req, res) => {
  const { id } = req.params;

  try {
    const tourist = await Tourist.findById(id);
    if (!tourist) return res.status(404).json({ error: "User not found" });

    // Update requestedDeletion field
    tourist.deletionRequested = true;
    await tourist.save();

    return res
      .status(200)
      .json({ message: "Deletion request submitted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "An error occurred while processing the deletion request.",
      });
  }
};

// Method to add a rating from a tourist to a tour guide
const addRating = async (req, res) => {
  const { tourGuideId, touristId, rating } = req.body;

  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(tourGuideId);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found." });
    }

    // Check if the tourist is associated with the tour guide
    if (!tourGuide.Tourists.includes(touristId)) {
      return res
        .status(400)
        .json({ message: "Tourist not associated with this tour guide." });
    }

    // Check if the tourist has already rated the tour guide
    const existingRating = tourGuide.ratings.find(
      (r) => r.tourist.toString() === touristId
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "Tourist has already rated this tour guide." });
    }

    // Add the new rating
    tourGuide.ratings.push({ tourist: touristId, rating });

    // Calculate the average rating
    const totalRatings = tourGuide.ratings.length;
    const sumOfRatings = tourGuide.ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    tourGuide.rate = sumOfRatings / totalRatings; // Average rating

    await tourGuide.save(); // Save the updated tour guide

    return res
      .status(200)
      .json({ message: "Rating added successfully.", tourGuide });
  } catch (error) {
    return res.status(500).json({ message: "Error adding rating.", error });
  }
};






// Method for a tourist to follow an itinerary (add tourist to Itinerary.Tourists)
const followItinerary = async (req, res) => {
  const { itineraryId, touristId } = req.body;

  try {
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId,{
      active: true,
      flagged: false,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Check if the tourist is already following the itinerary
    if (itinerary.Tourists.includes(touristId)) {
      return res
        .status(400)
        .json({ message: "Tourist already following this itinerary." });
    }

    // Add the tourist to the Tourists array
    itinerary.Tourists.push(touristId);
    await itinerary.save(); // Save the updated itinerary

    return res
      .status(200)
      .json({ message: "Itinerary followed successfully.", itinerary });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error following itinerary.", error });
  }
};

// Method for a tourist to unfollow an itinerary (remove tourist from Itinerary.Tourists)
const unfollowItinerary = async (req, res) => {
  const { itineraryId, touristId } = req.body;

  try {
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId,{
      active: true,
      flagged: false,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Check if the tourist is actually following the itinerary
    const index = itinerary.Tourists.indexOf(touristId);
    if (index === -1) {
      return res
        .status(400)
        .json({ message: "Tourist is not following this itinerary." });
    }

    // Remove the tourist from the Tourists array
    itinerary.Tourists.splice(index, 1); // Remove tourist by index
    await itinerary.save(); // Save the updated itinerary

    return res
      .status(200)
      .json({ message: "Itinerary unfollowed successfully.", itinerary });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error unfollowing itinerary.", error });
  }
};
// Method for a tourist to follow a tour guide (add tourist to TourGuide.Tourists)
const compeleteWithTourGuide = async (req, res) => {
  const { tourGuideId, touristId } = req.body;

  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(tourGuideId);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found." });
    }

    // Check if the tourist is already following the tour guide
    if (tourGuide.Tourists.includes(touristId)) {
      return res
        .status(400)
        .json({ message: "Tourist already following this tour guide." });
    }

    // Add the tourist to the Tourists array
    tourGuide.Tourists.push(touristId);
    await tourGuide.save(); // Save the updated tour guide

    return res
      .status(200)
      .json({ message: "Tour guide followed successfully.", tourGuide });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error following tour guide.", error });
  }
};

// Get all tour guides with whom the user (tourist) completed a tour
const getCompletedTourGuides = async (req, res) => {
  try {
    const touristId = req.params.touristId;

    // Find all tour guides who have the given tourist ID in their 'Tourists' field
    const completedTourGuides = await TourGuide.find({ Tourists: touristId });

    res.status(200).json(completedTourGuides);
  } catch (error) {
    console.error("Error fetching completed tour guides:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all itineraries that the tourist is following
const getFollowedItineraries = async (req, res) => {
  try {
    const touristId = req.params.touristId;

    // Find all itineraries where the given tourist ID is in the 'Tourists' field
    const followedItineraries = await Itinerary.find({ Tourists: touristId },{
      active: true,
      flagged: false,
    });

    res.status(200).json(followedItineraries);
  } catch (error) {
    console.error("Error fetching followed itineraries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTourGuideProfiles = async (req, res) => {
  try {
    // Fetch all tour guides from the database
    const tourGuides = await TourGuide.find();

    // If no tour guides are found, send a 404 error
    if (!tourGuides || tourGuides.length === 0) {
      return res.status(404).json({ message: "No tour guides found." });
    }

    // Return the list of tour guide profiles
    res.status(200).json({ tourGuides });
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching tour guides:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching tour guides." });
  }
};

const getItinerariesByTourGuide = async (req, res) => {
  try {
    // Extract the tour guide's ID from the request parameters
    const { tourGuideId } = req.params;

    // Find itineraries that belong to the specified tour guide
    const itineraries = await Itinerary.find({
      tourGuide: tourGuideId,
    },{
      active: true,
      flagged: false,
    }).populate("tourGuide");

    // Return the filtered itineraries as a response
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching itineraries for the tour guide",
      error,
    });
  }
};

const getSingleItinerary = async (req, res) => {
  const { itineraryId } = req.params;

  try {
    // Find the itinerary by its ID in the database
    const itinerary = await Itinerary.findById(itineraryId,{
      active: true,
      flagged: false,
    });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    // If found, send the itinerary data as the response
    res.status(200).json(itinerary);
  } catch (error) {
    // Handle any errors (e.g., invalid ID format, database issues)
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller function to get tourist username by touristId
const getTouristUsername = async (req, res) => {
  try {
    // Get the touristId from the request parameters
    const { touristId } = req.body;

    // Find the tourist by the provided touristId
    const tourist = await Tourist.findById(touristId);

    // If tourist not found, return a 404 error
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Return the tourist's username
    return res.status(200).json({ username: tourist.username });
  } catch (error) {
    console.error("Error fetching tourist username:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return
  }
  const product = await Product.find({ _id: id }).populate('seller');

  if (!product) {
    return res.status(404).json({ error: 'No such product' })
  }
  res.status(200).json(product)
}


const getSales = async (req, res) => {
  const { id: productId } = req.params;  // Destructure product ID from the route parameters

  try {
    const sales = await SalesModel.find({ Product: productId }).sort({ createdAt: -1 }).populate('Tourists');  
   

    res.status(200).json(sales);     // Send the sales data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sales data' });
  }
};

const getWishlistProducts = async (req, res) => {
  const {id}= req.params;

  try {
    
    const tourist = await Tourist.findById(id).populate({
      path: 'wishlist.product', // Path to populate
      select: '-archieved', // Optional: Exclude fields like 'archived' if not needed
    });
    res.status(200).json(tourist); // Return the filtered products
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to retrieve products" }); // Handle any errors
  }
};

const addProductWishlist = async (req, res) => {
  const touristId= req.params.id;
  
  const {productId} = req.body;

  try {
    // Validate the product existence
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if the product is already in the wishlist
    const productAlreadyInWishlist = tourist.wishlist.some(
      (item) => item.product.toString() === productId
    );
    if (productAlreadyInWishlist) {
      return res.status(400).json({ message: 'Product is already in the wishlist' });
    }

    // Add the product to the wishlist
    tourist.wishlist.push({ product: productId });
    await tourist.save();

    res.status(200).json({ message: 'Product added to wishlist successfully', wishlist: tourist.wishlist });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ message: 'Failed to add product to wishlist' });
  }
};

const removeProductFromWishlist = async (req, res) => {
  const  touristId  = req.params.id;
  const {productId} = req.body;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if the product exists in the wishlist
    const productIndex = tourist.wishlist.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(400).json({ message: 'Product not found in wishlist' });
    }

    // Remove the product from the wishlist
    tourist.wishlist.splice(productIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully', wishlist: tourist.wishlist });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove product from wishlist' });
  }
};

const getFullBookingDays = async (req, res) => {
  const { transportationId } = req.body;
  // console.log(transportationId,"lhgfdfghjklkjhgfghujikolkhigyuyuyguyg");
  try {
    // Fetch the transportation by ID
    const transportation = await Transportation.findById(transportationId);
    if (!transportation) {
      return res.status(404).json({ error: "Transportation not found" });
    }

    // Fetch all bookings for this transportation
    const bookings = await TransportBooking.find({ transportationId })
      .sort({ date: 1 }) // Order bookings by date (ascending)
      .lean(); // Use lean() for better performance if you don't need Mongoose documents
    console.log("booking",bookings);
    // Create a map to count bookings by date
    const bookingCountByDate = {};

    bookings.forEach((booking) => {
      const date = booking.date.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
      bookingCountByDate[date] = (bookingCountByDate[date] || 0) + booking.seats;
    });

    // Check for dates with full capacity
    const fullCapacityDates = [];
    for (const [date, count] of Object.entries(bookingCountByDate)) {
      if (count >= transportation.capacity) {
        fullCapacityDates.push({ date, count });
      }
    }
    console.log(transportation.capacity,"capacity");

    // Return the results
    res.status(200).json({
      transportationId,
      fullCapacityDates,
      allBookings: bookings, // Optional: include all bookings in response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getTourist = async (req, res) => {
  try {
    // Fetch all tourists from the database
    const tourists = await Tourist.find();

    // Return the data as JSON
    res.status(200).json(tourists);
  } catch (error) {
    console.error("Error fetching tourists:", error.message);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

const getTags = async (req,res) =>{
  try{
    const tags = await Tag.find();
    res.status(200).json(tags);
  }
  catch(error)
  {
    console.error("Error sending receipt:", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
}

module.exports = {
  createTransportBooking,
  getTransportBooking,
  deleteTransportBooking,
  selectPrefrences,
  getPrefrences,
  searchHistoricalPlaceByTag,
  searchHistoricalPlaceByName,
  searchHistoricalPlaceByCategory,
  searchMuseumByTag,
  searchMuseumByName,
  searchMuseumByCategory,
  searchActivityByBudget,
  searchActivityByDate,
  searchActivityByRating,
  searchActivityByTag,
  searchActivityByCategory,
  searchActivityByName,
  searchItineraryByDate,
  searchItineraryByBudget,
  searchItineraryByLanguage,
  searchItineraryByCategory,
  searchItineraryByName,
  searchItineraryByTag,
  getUpcomingActivities,
  sortActivityByPrice,
  sortActivityByRating,
  getUpcomingItineraries,
  sortItineraryByPrice,
  sortItineraryByRating,
  getMuseums,
  filterMuseumsByTag,
  getHistoricalLocations,
  filterHistoricalLocationsByTag,
  getProducts,
  filterProducts,
  sortByRate,
  searchProductName,
  updateInfo,
  getInfo,
  getComplaints,
  ADDRateReview,
  addSales,
  requestAccountDeletion,
  addComplaint,
  updatePointsToWallet,
  payForItinerary,
  payForActivity,
  getTagNameById,
  getCategoryNameById,
  getActivitiesByCategory,
  getCategories,
  rateActivity,
  addCommentToActivity,
  deleteCommentFromActivity,
  book_activity_Itinerary,
  cancel_booking,
  fetchID,
  fetchActivityID,
  fetchItineraryID,
  addRating,
  addComment,
  addItineraryRating,
  addItineraryComment,
  followItinerary,
  unfollowItinerary,
  compeleteWithTourGuide,
  getFollowedItineraries,
  getCompletedTourGuides,
  getAllTourGuideProfiles,
  getItinerariesByTourGuide,
  getSingleItinerary,
  getTouristUsername,getTouristActivities,getTouristBookedActivities,getUserRating,isCommentByTourist,createFlightBooking,createBooking,getSingleProduct,removeProductFromWishlist,addProductWishlist,getWishlistProducts,getSales,

  getTagIdByName, myTransportBooking, myActivityItineraryBooking, upload, shareViaEmail,payWithWallet,checkout,addAddress,getAddresses,updateCartQuantity,addToCart,removeFromCart,viewCart,applyPromoCode,updateOrderDetails,getOrdersByTourist,changeOrderStatus,cancelOrder,getOrderById,createOrder,getWalletDetails,addWalletTransaction,addSalesI,addSalesA,GetAllNotifications,markNotificationAsRead,markAllNotificationsAsRead,getUnreadNotifications,getSingleActivity,getFullBookingDays,isActivity,getBookmarkedActivities,removeBookmarkedActivities,addBookMarkedActivities
  
  ,getSingleProduct,addBookMarked,getBookmarkedItineraries,removeBookmarkedItinerary,getTourist,getTags
};
