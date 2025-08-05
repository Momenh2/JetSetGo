const TourGuide = require("../models/TourGuideModel");
const Itinerary = require("../models/ItineraryModel");
const Notification = require("../models/Notification")
const SalesIModel = require("../models/SalesIModel");
const multer = require("multer");
const path = require("path");
//66f8084788afe7e5aff3aefc

const getSales = async (req, res) => {
  const { id: ItineraryID } = req.params;  // Destructure product ID from the route parameters
  console.log(ItineraryID)
  try {
    const sales = await SalesIModel.find({ Itinerary: ItineraryID }).sort({ createdAt: -1 }).populate('Tourists');
    res.status(200).json(sales);     // Send the sales data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sales data' });
  }
};


const getAllSales = async (req, res) => {
  const  {id}  = req.params; // Seller IDs
  try {
    // Fetch sales data for the seller, populate the Product and Seller fields
    const salesWithItinerary = await SalesIModel.find({ TourGuide: id })
      .sort({ createdAt: -1 }).populate('Tourists')
      .populate('Itinerary') // Populate the Product field with product data
    res.status(200).json(salesWithItinerary);  // Send back the populated sales data
  } 
  catch (error) {
    console.error('Error fetching sales with Itinerary:', error);
    res.status(500).json({ error: error.messsage });
  }
};






//////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////


//Deactivate an itinerary with bookings
const itineraryDeactivation = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary has existing bookings
    if (itinerary.isBooked) {
      if (itinerary.active) {
        // Deactivate the itinerary
        itinerary.active = false;
        await itinerary.save();
        return res
          .status(200)
          .json({ message: "Itinerary deactivated successfully", itinerary });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating itinerary status", error });
  }
};

//Activate an itinerary with bookings
const itineraryActivation = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary has existing bookings
    if (itinerary.isBooked) {
      if (!itinerary.active) {
        // Activate the itinerary
        itinerary.active = true;
        await itinerary.save();
        return res
          .status(200)
          .json({ message: "Itinerary activated successfully", itinerary });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating itinerary status", error });
  }
};

// Create Tour Guide Profile

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

const createProfile = async (req, res) => {
  const { id } = req.params;
  const { mobile, experience, previousWork } = req.body;

  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(id);

    // Check if the tour guide is accepted
    if (!tourGuide || !tourGuide.accepted) {
      return res.status(403).json({
        error: "You must be accepted as a tour guide to create a profile",
      });
    }
    if (tourGuide.mobile || tourGuide.experience || tourGuide.previousWork) {
      return res.status(403).json({ error: "You already created a profile" });
    }
    // Update the tour guide profile with new information
    tourGuide.mobile = mobile;
    tourGuide.experience = experience;
    tourGuide.previousWork = previousWork;

    // Save the updated profile
    await tourGuide.save();
    res.status(200).json(tourGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Find the tour guide by ID
    const profile = await TourGuide.findById(id);

    // Check if the profile exists and if the tour guide is accepted
    if (!profile || !profile.accepted) {
      return res.status(403).json({
        error: "You must be accepted as a tour guide to update your profile",
      });
    }

    // If accepted, update the profile
    const updatedProfile = await TourGuide.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Tour Guide Profile
const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the tour guide by ID
    // Find the tour guide by ID
    const profile = await TourGuide.findById(id);

    // Check if the profile exists and if the tour guide is accepted
    if (!profile || !profile.accepted) {
      return res.status(403).json({
        error: "You must be accepted as a tour guide to view the profile",
      });
    }

    // Return the profile data if accepted
    res.status(200).json(profile);
  } catch (err) {
    res.status(404).json({ error: "Profile not found" });
  }
};

// Create a new itinerary with timeline, duration, and locations calculated from activities
// Create Itinerary function
// Create itinerary function
const createItinerary = async (req, res) => {
  try {
    // Extract tour guide ID from URL params
    const { tourGuideId } = req.params;

    // Extract other fields from the request body
    const {
      title,
      description,
      activities,
      locations,
      timeline,
      language,
      price,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      ratings,
      comments,
      tags, // An array of tag IDs
    } = req.body;
    
    console.log(tourGuideId)
    // Ensure the tour guide exists
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Validate activities
    if (!activities || !activities.name || !activities.duration || activities.name.length !== activities.duration.length) {
      return res.status(400).json({ message: "Activities must have matching name and duration arrays." });
    }

    // Validate locations
    if (!locations || !Array.isArray(locations)) {
      return res.status(400).json({ message: "Locations must be an array." });
    }

    // Validate availableDates
    if (!availableDates || !Array.isArray(availableDates)) {
      return res.status(400).json({ message: "Available dates must be an array." });
    }

    // Ensure each available date has a valid date and times array
    availableDates.forEach((dateObj) => {
      if (!dateObj.date || !dateObj.times || !Array.isArray(dateObj.times)) {
        return res.status(400).json({ message: "Each available date must have a valid date and times array." });
      }
    });

    // Create the itinerary
    const itinerary = new Itinerary({
      title,
      description,
      tourGuide: tourGuideId, // Reference the tour guide who created the itinerary
      activities,
      locations,
      timeline,
      language,
      price,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      comments,
      ratings,
      tags, // Tags are passed as an array of ObjectIds
      isBooked: false, // Set default to false for new itineraries
      active: true, // Set active to true when creating an itinerary
      flagged: false, // Set flagged to false by default
    });

    // Save the itinerary
    await itinerary.save();

    // Send success response
    res.status(201).json({ message: "Itinerary created successfully", itinerary });

  } catch (error) {
    console.error("Error creating itinerary:", error);
    res.status(400).json({ message: "Error creating itinerary", error });
  }
};


const getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate("tourGuide"); // No change needed for 'activities'
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(400).json({ message: "Error fetching itineraries", error });
  }
};

const updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res
      .status(200)
      .json({ message: "Itinerary updated successfully", updatedItinerary });
  } catch (error) {
    res.status(400).json({ message: "Error updating itinerary", error });
  }
};

const deleteItinerary = async (req, res) => {
  
  try {
    console.log("Requesting to delete itinerary with id:", req.params.id);
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    console.log("Requesting to delete itinerary with id after search:", req.params.id);
    // If bookings exist, we won't delete the itinerary
    if (itinerary.isBooked) {
      return res
        .status(400)
        .json({ message: "Cannot delete itinerary with existing bookings" });
    }
    console.log("Requesting to delete itinerary with id after after after:", req.params.id);
    await Itinerary.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting itinerary", error });
  }
};

// Controller function to get a single itinerary by ID
const getSingleItinerary = async (req, res) => {
  const { itineraryId } = req.params;
  try {
    console.log("THIS IS THE ID OF ITINRARY YOU ARE VIEWING IN BACKEND " +itineraryId)

    // Find the itinerary by its ID in the database
    const itinerary = await Itinerary.findById(itineraryId).populate('comments.tourist').populate('ratings.tourist');

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


const getSingleItinerary1 = async (req, res) => {
  const { itineraryId } = req.params;
  try {
    console.log("THIS IS THE ID OF ITINRARY YOU ARE VIEWING IN BACKEND " +itineraryId)

    // Find the itinerary by its ID in the database
    const itinerary = await Itinerary.findById(itineraryId);

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



//Read My Itineraries
const showMyItineraries = async (req, res) => {
  const guideId = req.query.guideId;
  try {
    const result = await Itinerary.find({ tourGuide: guideId });
    console.log(guideId)
    res.status(200).json(result);
  } catch {
    res.status(400).json({ error: "Id is required" });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const profileImage = req.file ? req.file.path : null;
    console.log(id);
    // Update the advertiser's profile image in the database
    const tourGuide = await TourGuide.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true }
    );
    console.log("not successfull");

    if (!tourGuide) {
      return res.status(404).json({ error: "Tourguide not found" });
    }
    console.log("Profile image uploaded successfully");

    res.json({
      message: "Profile image uploaded successfully",
      imagePath: profileImage,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
};



const uploadDoc = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|pdf/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Docs Only!");
    }
  },
});

const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No documents uploaded" });
    }

    // Map file paths of uploaded documents
    const documentPaths = req.files.map((file) => file.path);

    // Update the documents array in the database
    const tourGuide = await TourGuide.findByIdAndUpdate(
      id,
      { $push: { documents: { $each: documentPaths } } },
      { new: true }
    );

    if (!tourGuide) {
      return res.status(404).json({ error: "TourGuide not found" });
    }

    res.json({
      message: "Documents uploaded successfully",
      documentPaths: documentPaths,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestAccountDeletion = async (req, res) => {
  const { id } = req.params;

  try {
    const tourGuide = await TourGuide.findById(id);
    if (!tourGuide) return res.status(404).json({ error: "User not found" });

    // Update requestedDeletion field
    tourGuide.deletionRequested = true;
    await tourGuide.save();

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




module.exports = {
  upload,
  createProfile,
  updateProfile,
  getProfile,
  createItinerary,
  getItineraries,
  updateItinerary,
  deleteItinerary,
  showMyItineraries,
  uploadProfileImage,
  requestAccountDeletion,
  uploadDocument,
  uploadDoc,
  upload,
  itineraryActivation,
  itineraryDeactivation,
  uploadProfileImage,
  getSingleItinerary,
  markNotificationAsRead,markAllNotificationsAsRead,getUnreadNotifications,GetAllNotifications,getAllSales,getSales,getSingleItinerary1};
