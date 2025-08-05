const Advertiser = require('../models/AdvertiserModel');
const Activity = require('../models/AdvertiserActivityModel');
const Itinerary = require ('../models/ItineraryModel');
const SalesAModel = require("../models/SalesAModel");
const Notification = require("../models/Notification")
const TransportBooking = require("../models/TransportationBookingModel");

const multer = require('multer');
const path = require('path');
const Transportation = require('../models/TransportationModel');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

const getSales = async (req, res) => {
  const { id: ActivityID } = req.params;  // Destructure product ID from the route parameters
  console.log(ActivityID)
  try {
    const sales = await SalesAModel.find({ Activity: ActivityID }).sort({ createdAt: -1 }).populate('Tourists');
    res.status(200).json(sales);     // Send the sales data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sales data' });
  }
};


const getAllSales = async (req, res) => {
  const  {id}  = req.params; // Seller IDs
  try {
    // Fetch sales data for the seller, populate the Product and Seller fields
    const salesWithActivity = await SalesAModel.find({ Advertiser: id })
      .sort({ createdAt: -1 }).populate('Tourists')
      .populate('Activity') // Populate the Product field with product data
    res.status(200).json(salesWithActivity);  // Send back the populated sales data
  } 
  catch (error) {
    console.error('Error fetching sales with Activity:', error);
    res.status(500).json({ error: error.messsage });
  }
};

// Function to get total number of tourists for a specific activity
const getTotalTouristsForActivity = async (req, res) => {
  const { id: AdvertiserID } = req.params;  // Extract Advertiser ID from params
  const { activityID } = req.query;         // Extract Activity ID from query params

  try {
    const touristsCount = await SalesAModel.aggregate([
      { $match: { Advertiser: mongoose.Types.ObjectId(AdvertiserID), Activity: mongoose.Types.ObjectId(activityID) } },  // Match Advertiser and Activity
      { $group: { _id: '$Tourists', count: { $sum: 1 } } },   // Group by Tourist ID (assuming tourists are unique for each activity)
      { $count: 'totalTourists' }  // Count the number of unique tourists
    ]);

    if (touristsCount.length === 0) {
      return res.status(200).json({ totalTourists: 0 });
    }
    res.status(200).json({ totalTourists: touristsCount[0].totalTourists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tourists count for the activity' });
  }
};

// Function to get total number of tourists for a specific activity, filtered by month and year
const getTotalTouristsForActivityByMonth = async (req, res) => {
  const { id: AdvertiserID } = req.params;  // Extract Advertiser ID from params
  const { activityID } = req.query;         // Extract Activity ID from query params
  const { year, month } = req.query;        // Extract year and month from query params

  if (!year || !month) {
    return res.status(400).json({ error: 'Year and month are required for this filter.' });
  }

  try {
    const touristsCountByMonth = await SalesAModel.aggregate([
      { $match: { Advertiser: mongoose.Types.ObjectId(AdvertiserID), Activity: mongoose.Types.ObjectId(activityID) } },
      { 
        $addFields: {
          month: { $month: '$createdAt' },    // Extract month from createdAt
          year: { $year: '$createdAt' }       // Extract year from createdAt
        }
      },
      { $match: { year: parseInt(year), month: parseInt(month) } },  // Filter by specific year and month
      { $group: { _id: '$Tourists', count: { $sum: 1 } } },  // Group by Tourist ID (ensure unique tourists)
      { $count: 'totalTourists' }  // Count the unique tourists
    ]);

    if (touristsCountByMonth.length === 0) {
      return res.status(200).json({ totalTourists: 0 });
    }

    res.status(200).json({ totalTourists: touristsCountByMonth[0].totalTourists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tourists count for the activity by month' });
  }
};




// Controller to get all unread notifications for an advertiser
const getUnreadNotifications = async (req, res) => {
  const { id } = req.params; // Advertiser's ID passed in the URL parameter

  try {
    // Query for unread notifications for the specified Advertiser
    const unreadNotifications = await Notification.find({
      userId: id,
      read: false,
    }).sort({ createdAt: -1 })  // Sort by creation date, descending (most recent first)
      .limit(3);  // Limit to 3 notifications

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
  const { id } = req.params;  // Get the Advertiser ID from the URL parameter

  try {
    // Update notifications that are unread (read: false) to read: true
    await Notification.updateMany({ userId: id, read: false }, { $set: { read: true } });
    res.status(200).json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking notifications as read.', details: error.message });
  }
};

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


// Create Transportation
const createTransportation = async (req, res) => {
    const {vehicle, carModel, days, time, cLocation, capacity, bLocation, price, advertiser} = req.body;

    const transportData = {
      vehicle,
      days,
      time,
      price,
      advertiser,
    };
  
    // Conditionally add fields based on vehicle type
    if (vehicle === 'car') {
      transportData.carModel = carModel;
      transportData.cLocation = cLocation;
    } else if (vehicle === 'bus') {
      transportData.bLocation = bLocation;
      transportData.capacity = capacity;
    }
  

  try {
    const newTransportation = await Transportation.create(transportData);
    res.status(201).json(newTransportation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
  
const getTransportation = async (req, res) => {
  try {
    // Fetch all transportation
    const allTransportations = await Transportation.find().lean(); // Use lean() for better performance
    const allBookings = await TransportBooking.find().lean(); // Fetch all bookings

    // Prepare result with fullDays for each transportation
    const result = allTransportations.map((transportation) => {
      const bookingsForTransportation = allBookings.filter(
        (booking) => booking.transportationId.toString() === transportation._id.toString()
      );

      // Create a map to count bookings by date
      const bookingCountByDate = {};
      bookingsForTransportation.forEach((booking) => {
        if (booking.date) { // Ensure booking.date exists
          const date = new Date(booking.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
          bookingCountByDate[date] = (bookingCountByDate[date] || 0) + booking.seats;
        }
      });

      // Identify full capacity dates
      const fullDays = Object.entries(bookingCountByDate)
        .filter(([date, count]) => count >= transportation.capacity)
        .map(([date]) => date);

      return {
        ...transportation,
        fullDays, // Add the fullDays attribute
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};  
  


  // Update Transportation 
  const updateTransportation = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const updatedTransportation = await Transportation.findByIdAndUpdate(id, updates, { new: true });
      res.status(200).json(updatedTransportation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  //Delete Transportation
  const deleteTransportation = async (req, res) => {
    const { id } = req.params;
  
    try {
        const deletedTransportation = await Transportation.findByIdAndDelete(id);
        
        if (!deletedTransportation) {
            return res.status(404).json({ message: 'Transportation not found' });
        }
        
        res.status(200).json({ message: 'Transportation deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  };

const createAdvertiserProfile = async (req, res) => {
  const { id } = req.params;
  const { companyProfile, websiteLink, hotline } = req.body;

  try {
      // Find the advertiser by ID
      const advertiser = await Advertiser.findById(id);
  
      // Check if the advertiser is accepted
      if (!advertiser || !advertiser.accepted) {
          return res.status(403).json({ error: 'You must be accepted as an advertiser to create a profile' });
      }

      // Check if the profile fields are already set
      if (advertiser.companyProfile || advertiser.websiteLink || advertiser.hotline) {
          return res.status(403).json({ error: 'You already created a profile' });
      }

      // Update the advertiser profile with new information
      advertiser.companyProfile = companyProfile;
      advertiser.websiteLink = websiteLink;
      advertiser.hotline = hotline;

      // Save the updated profile
      await advertiser.save();
      res.status(200).json(advertiser);

  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};

// Update Advertiser Profile
const updateAdvertiserProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Find the advertiser by ID
    const advertiser = await Advertiser.findById(id);

    // Check if the advertiser exists and if they are accepted
    if (!advertiser || !advertiser.accepted) {
      return res.status(403).json({ error: 'You must be accepted as an advertiser to update your profile' });
    }

    // If accepted, update the profile
    const updatedAdvertiser = await Advertiser.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedAdvertiser);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Advertiser Profile
const getAdvertiserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the advertiser by ID
    const advertiser = await Advertiser.findById(id);

    // Check if the advertiser exists and if they are accepted
    if (!advertiser || !advertiser.accepted) {
      return res.status(403).json({ error: 'You must be accepted as an advertiser to view the profile' });
    }

    // Return the profile data if accepted
    res.status(200).json(advertiser);

  } catch (err) {
    res.status(404).json({ error: 'Profile not found' });
  }
};
///delete activity
const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
      const deletedActivity = await Activity.findByIdAndDelete(id);
      
      if (!deletedActivity) {
          return res.status(404).json({ message: 'Activity not found' });
      }
      
      res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
// Create Activity
const createActivity = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    time,
    location,
    price,
    category,
    tags,
    bookingOpen,
    specialDiscounts
  } = req.body;

  try {
    

    // Create a new activity with the provided details
    const newActivity = await Activity.create({
      title,
      description,
      date,
      time,
      location,
      price,
      //category,
      //tags,
      //id,
      category, // Use the category ObjectId
      tags,  // Use the tags ObjectIds
      advertiser: id,  // Advertiser passed as a route param
      bookingOpen,
      specialDiscounts
    });

    // Return the created activity in the response
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Activity
const updateActivity = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
 
  try {
    let updatedActivity;

    // Check if there's a new tag to add in the request body
    if (updates.newTag) {
      const { newTag, ...otherUpdates } = updates; // Destructure to separate the newTag from other updates
      // Add the new tag and update other fields
      updatedActivity = await Activity.findByIdAndUpdate(id,{ $push: { tags: newTag },
                                                              $set: otherUpdates, // Update other fields if provided
                                                             },
                                                                 { new: true }
      );
    } 
    else{
      updatedActivity = await Activity.findByIdAndUpdate(id, updates, { new: true });
    } 
    res.status(200).json(updatedActivity); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Read my Activities
const showMyActivities = async(req,res) => {


    const {id} = req.params;

try{
        const result = await Activity.find({advertiser:(id)})
        res.status(200).json(result)
    } catch{
        res.status(400).json({error:"Id is required"})
    }
}

const changePassword = async (req, res) => {
  const { id } = req.params; // Get the user ID from the route parameters
  const { oldPassword, newPassword } = req.body; // Get old and new passwords from the body

  // Validate input
  if (!id || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "User ID, old password, and new password are required." });
  }

  try {
  
      const user = await Advertiser.findById(id);

      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }

      // Compare old password
      const isMatch = await bcrypt.compare(oldPassword, user.password); // Assuming you're using bcrypt

      if (!isMatch) {
          return res.status(400).json({ error: "Old password is incorrect." });
      }

      // Update password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const profileImage = req.file ? req.file.path : null;

    // Update the advertiser's profile image in the database
    const advertiser = await Advertiser.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true }
    );

    if (!advertiser) {
      return res.status(404).json({ error: 'Advertiser not found' });
    }

    res.json({ message: 'Profile image uploaded successfully', imagePath: profileImage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

const requestAccountDeletion = async (req, res) => {
  const {id } = req.params;
  

  try {
      const advertiser = await Advertiser.findById(id);
      if (!advertiser) return res.status(404).json({ error: "User not found" });

      // Update requestedDeletion field
      advertiser.deletionRequested = true;
      await advertiser.save();

      return res.status(200).json({ message: "Deletion request submitted successfully." });
  } catch (error) {
      return res.status(500).json({ error: "An error occurred while processing the deletion request." });
  }
};

const uploadDoc = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Docs Only!');
    }
  }
});

const uploadDocument = async (req, res) => {
  try {
      const { id } = req.params;

      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ error: "No documents uploaded" });
      }

      // Map file paths of uploaded documents
      const documentPaths = req.files.map(file => file.path);

      // Update the documents array in the database
      const advertiser = await Advertiser.findByIdAndUpdate(
          id,
          { $push: { documents: { $each: documentPaths } } },
          { new: true }
      );

      if (!advertiser) {
          return res.status(404).json({ error: "TourGuide not found" });
      }

      res.json({
          message: "Documents uploaded successfully",
          documentPaths: documentPaths
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};





const findtransport = async (req, res) => {
  const { id } = req.params;

  try {
    const transportData = await Transportation.findById(id);
    if (!transportData) {
      return res.status(404).json({ error: 'Transportation post not found' });
    }
    res.status(200).json(transportData);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the transportation post' });
  }
};


const findReferenceDetails = async (req, res) => {
  const { id, type } = req.params;

  try {
    let details;
    if (type === 'Activity') {
      details = await Activity.findById(id);
    } else if (type === 'Itinerary') {
      details = await Itinerary.findById(id);
    }

    if (!details) {
      return res.status(404).json({ error: `${type} not found` });
    }
    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ error: `An error occurred while fetching the ${type} details` });
  }
};

module.exports = {requestAccountDeletion,upload,createAdvertiserProfile,updateAdvertiserProfile, getAdvertiserProfile ,deleteActivity,getActivities,updateActivity,createActivity,showMyActivities,changePassword,uploadProfileImage,  createTransportation, getTransportation, updateTransportation, deleteTransportation,uploadDocument,uploadDoc, findReferenceDetails,findtransport,GetAllNotifications,markNotificationAsRead,markAllNotificationsAsRead,getUnreadNotifications,getAllSales,getSales,getTotalTouristsForActivity,getTotalTouristsForActivityByMonth};

