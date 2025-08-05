const express = require('express');
const { createSellerProfile, updateSellerProfile, getSellerProfile, 
    getProducts, createProduct, updateProduct,filterProducts,sortByRate, 
    searchProductName,getSingleProduct ,requestAccountDeletion, 
    uploadDoc,uploadDocument,archieved_on,getAllSales,uploadProductImage
    ,getSales,  markAllNotificationsAsRead,GetAllNotifications,markNotificationAsRead,getUnreadNotifications} = require('../controllers/sellerController');
const router = express.Router();
const SellerController = require('../controllers/sellerController')
const {uploadLogo} = require('../controllers/sellerController');

router.patch('/:id/upload-profile-image', uploadLogo.single('image'), SellerController.uploadProfileImage);

router.patch('/:id/upload-Doc', uploadDoc.array('image'), uploadDocument);

router.get('/getAllSales/:id', getAllSales)
router.get("/sales/:id", getSales);


// const sellerController = require('../controllers/sellerController');
//  multer = require('../config/multer');
// router.patch('/:id/upload-profile-image', multer.single('image'), sellerController.uploadProfileImage);
router.patch('/requestDelete/:id',requestAccountDeletion)

router.patch("/updateProductPicture/:id/:productId", uploadProductImage);


// Endpoint to mark all notifications as read
router.put('/ReadAllnotifications/:id', markAllNotificationsAsRead);



router.get("/notifications/all/:id",GetAllNotifications)
// Route to get all unread notifications for a specific tour guide
router.get('/notifications/unread/:id', getUnreadNotifications);


router.patch("/MarkAsRead/:id",markNotificationAsRead);
////////////////////////////////////////////////////////////////////////



const { changePassword } = require("../controllers/PasswordController");
router.patch("/change-password/:id/:modelName", changePassword);

// Create or Update Seller Profile
router.post('/create/:id', createSellerProfile);
router.patch('/update/:id', updateSellerProfile);
router.get('/profile/:id', getSellerProfile);


router.get('/Products/:id',getProducts )
router.get('/filterProducts/:id',filterProducts)
router.get('/sortByRate/:id',sortByRate)
router.get('/searchProductName',searchProductName)
router.post('/createProduct',createProduct)
router.get('/getSingleProduct/:id', getSingleProduct)
router.patch("/archieved/:id", archieved_on);
// Update workout
router.patch('/product/:id', updateProduct)

const multer = require('multer');

// Define multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Then, use it in your route
router.post('/createProduct', upload.single('picture'), createProduct);

module.exports = router;
    