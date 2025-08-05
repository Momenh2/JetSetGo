// const express = require('express');
const express = require("express");
// const multer = require('../config/multer');
const {
  createProfile,
  updateProfile,
  getProfile,
  createItinerary,
  getItineraries,
  updateItinerary,
  deleteItinerary,
  showMyItineraries,
  itineraryActivation,
  itineraryDeactivation,
  requestAccountDeletion,
  uploadDoc,
  uploadDocument,
  getSingleItinerary,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotifications,
  GetAllNotifications,
  getSales,
  getAllSales
} = require("../controllers/tourGuideController");
const tourGuideController = require("../controllers/tourGuideController");
const router = express.Router();

const { upload } = require("../controllers/tourGuideController");

router.patch(
  "/:id/upload-profile-image",
  upload.single("image"),
  tourGuideController.uploadProfileImage
);

router.patch("/:id/upload-Doc", uploadDoc.array("image"), uploadDocument);

router.post("/test", (req, res) => {
  res.send("Tour Guide Test Route is working!");
});


router.get('/getAllSales/:id', getAllSales)
router.get("/sales/:id", getSales);


///////////////////////////////////////////


///////////////////////////////////////



// Endpoint to mark all notifications as read
router.put('/ReadAllnotifications/:id', markAllNotificationsAsRead);



router.get("/notifications/all/:id",GetAllNotifications)
// Route to get all unread notifications for a specific tour guide
router.get('/notifications/unread/:id', getUnreadNotifications);


router.patch("/MarkAsRead/:id",markNotificationAsRead);

router.get("/showAll", showMyItineraries);

router.get("/getSingleItinerary/:itineraryId",getSingleItinerary)

const { changePassword } = require("../controllers/PasswordController");
router.patch("/change-password/:id/:modelName", changePassword);

// router.patch('/:id/upload-profile-image', multer.single('image'), tourGuideController.uploadProfileImage);

router.patch("/requestDelete/:id", requestAccountDeletion);

// const router = express.Router();

// Add this above other routes

// const router = express.Router();

// Create or Update Tour Guide Profile
// router.post('/create', createProfile);
router.patch("/update/:id", updateProfile);
router.get("/profile/:id", getProfile);
// Create or Update Tour Guide Profile
router.post("/create/:id", createProfile);
// router.patch("/update/:id", updateProfile);
// router.get("/profile/:id", getProfile);
// router.post("/createItinerary", createItinerary); // in general which is just for testing w ma3loma ghalat men sprint
// Route to create an itinerary by tour guide
router.post('/createItinerary/:tourGuideId', createItinerary);
router.get("/getItineraries", getItineraries);
router.patch("/updateItinerary/:id", updateItinerary);
router.delete("/deleteItinerary/:id", deleteItinerary);

//Activate an itinerary with bookings
router.patch("/itineraries/activate/:id", itineraryActivation);
//Deactivate an itinerary with bookings
router.patch("/itineraries/deactivate/:id", itineraryDeactivation);

//66f80af288afe7e5aff3af00
module.exports = router;
