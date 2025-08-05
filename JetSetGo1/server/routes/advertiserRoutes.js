const express = require('express');
const { showMyActivities, createAdvertiserProfile,updateAdvertiserProfile, getAdvertiserProfile , createActivity, updateActivity, deleteActivity, getActivities , createTransportation, getTransportation, updateTransportation, deleteTransportation,requestAccountDeletion,uploadDoc,uploadDocument, findtransport, findReferenceDetails,GetAllNotifications,markNotificationAsRead,markAllNotificationsAsRead,getUnreadNotifications,getSales,getAllSales,getTotalTouristsForActivityByMonth,getTotalTouristsForActivity} = require('../controllers/advertiserController');
const { changePassword } = require("../controllers/PasswordController");
const router = express.Router();

const advertiserController = require('../controllers/advertiserController');

const {upload} = require('../controllers/advertiserController');

router.patch('/:id/upload-profile-image', upload.single('image'), advertiserController.uploadProfileImage);
router.get('/getAllSales/:id', getAllSales)
router.get("/sales/:id", getSales);

router.patch('/:id/upload-Doc', uploadDoc.array('image'), uploadDocument);


router.get('/:id/tourists-count', getTotalTouristsForActivity);

// Route to get the total tourists count for a specific activity by month
router.get('/:id/tourists-count/month',getTotalTouristsForActivityByMonth);


// Endpoint to mark all notifications as read
router.put('/ReadAllnotifications/:id', markAllNotificationsAsRead);



router.get("/notifications/all/:id",GetAllNotifications)
// Route to get all unread notifications for a specific tour guide
router.get('/notifications/unread/:id', getUnreadNotifications);


router.patch("/MarkAsRead/:id",markNotificationAsRead);
router.patch("/change-password/:id/:modelName", changePassword);

router.post('/createActivity/:id', createActivity);

router.patch('/updateActivity/:id', updateActivity);

router.get('/', getActivities);

router.post('/newTransportation', createTransportation )
router.get('/showTransportation', getTransportation )
router.patch('/updateTransportation/:id', updateTransportation)
router.delete('/deleteTransportation/:id', deleteTransportation )

router.patch('/requestDelete/:id',requestAccountDeletion)

router.get('/findtransport/:id', findtransport)
router.get('/findrefdetails/:id/:type',findReferenceDetails)
// Create or Update Advertiser Profile
// router.post('/create', createAdvertiserProfile);
router.post('/createProfile/:id',createAdvertiserProfile);
router.patch('/updateProfile/:id', updateAdvertiserProfile);
router.get('/profile/:id', getAdvertiserProfile);
router.delete('/deleteAct/delete/:id', deleteActivity); // Delete an activity
router.patch('/update/:id', updateAdvertiserProfile);

router.delete('/:id', deleteActivity); // Delete an activity
// Advertiser activities 
router.patch('/update/:id', updateActivity);
// router.get('/', getActivities);


router.get('/showAll/:id', showMyActivities )

module.exports = router;
