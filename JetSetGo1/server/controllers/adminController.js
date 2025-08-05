const Admin = require('../models/AdminModel.js');
const preferencetags = require('../models/TagModel.js');
const CategoryModel = require('../models/CategoryModel.js');
const TourismGoverner = require('../models/TourismGovernerModel.js');
const AdvertiserActivityModel = require('../models/AdvertiserActivityModel.js');
const Seller = require('../models/SellerModel');
const TourGuide = require('../models/TourGuideModel');
const Tourist = require('../models/TouristModels.js');
const TourismGovernerModel = require('../models/TourismGovernerModel.js');
const multer = require('multer');
const path = require('path');
const Product= require('../models/ProductModel');
const Advertiser = require('../models/AdvertiserModel.js');
const Itinerary = require("../models/ItineraryModel");
const Complaint = require('../models/ComplaintModel.js')
const PromoCode = require('../models/PromoCodeModel.js');
const Notification = require("../models/Notification")
const mongoose= require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/UserModel');
const SalesModel = require("../models/SalesModel");


const models={admin: Admin, seller: Seller, tourguide: TourGuide, tourist: Tourist, advertiser: Advertiser, tourismgoverner: TourismGoverner};
////////////////////////////////////////////////////////////////////////////////




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








const createPromoCode = async (req, res) => {
  const {discount} = req.body;

  try {
    // Create a new promo code
    const newPromoCode = new PromoCode({discount});

    // Save the new promo code to the database
    const savedPromoCode = await newPromoCode.save();

    // Respond with the newly created promo code
    res.status(201).json(savedPromoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPromoCodes = async (req, res) => {
  try {
    const promocodes = await PromoCode.find(); // Fetch all users from the database
    res.status(200).json({ promocodes });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching PromoCodes.', details: error.message });
  }
};




let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "jetsetgo212@gmail.com",
    pass: "pesw cctk endt iasi",
  },
  tls: {
    rejectUnauthorized: false, // Disable certificate validation (not secure)
  },
});


// Get All Itineraries
const getAllItineraries = async (req, res) => {
    try {
      const itineraries = await Itinerary.find(); // Fetch all itineraries from the database
      res.status(200).json({ itineraries });
    } catch (error) {
      res.status(500).json({ error: 'Server error while fetching itineraries.', details: error.message });
    }
  };
  
  const flagItinerary = async (req, res) => {
    const { itineraryId } = req.params;
  
    try {
      const itinerary = await Itinerary.findById(itineraryId).populate('tourGuide'); // Use populate() to include tourGuide data if necessary
  
      if (!itinerary) {
        return res.status(404).json({ error: 'Itinerary not found.' });
      }
  
      // Set flagged to true
      itinerary.flagged = true;
      await itinerary.save();
  
      // Send notification to the Tour Guide (via Socket.IO)
      if (itinerary.tourGuide) {
        const tourGuide = await TourGuide.findById(itinerary.tourGuide._id);
  
        // Create the notification message
        const notificationMessage = `Your itinerary "${itinerary.title}" has been flagged as inappropriate.`;
  
        // Create the notification object
        const notification = new Notification({
          message: notificationMessage,
          userId: tourGuide._id,
          read: false,
        });
  
        // Save the notification to the database
        await notification.save();
  
        // Check if the tour guide is online (i.e., has a socketId)
        // if (tourGuide.socketId) {
        //   // Emit the notification to the Tour Guide's socket ID
        //   io.to(tourGuide.socketId).emit('new_notification', {
        //     message: notificationMessage,
        //     createdAt: new Date(),
        //   });
        // } else {
        //   // If offline, store the notification in the database
        //   console.log('Tour Guide is offline. Storing notification in database.');
        // }
  
        // Save the notification ObjectId to the tourGuide's notifications array
        tourGuide.notifications.push(notification._id);
        await tourGuide.save();

       const mailOptions = {
        from: process.env.EMAIL_USER,  // Your email address
        to: tourGuide.email,  // The user's email
        subject: 'Iternanry flagged',
        text: notificationMessage,
      };
      console.log("how howa wha :" ,tourGuide.email );
      await transporter.sendMail(mailOptions);

         // SEND EMAIL TO TOUR GUIDE
    //  sendEmailNotification(tourGuide.email, notificationMessage);  // New function to send the email
      }
  
      res.status(200).json({ message: 'Itinerary flagged successfully.', itinerary });
    } catch (error) {
      console.error('Error while flagging itinerary:', error);
      res.status(500).json({ error: 'Server error while flagging itinerary.', details: error.message });
    }
  };
  // Function to send email notification to the Tour Guide
  const flagActivity = async (req, res) => {
    const { activityId } = req.params;
  
    try {
      const activity = await AdvertiserActivityModel.findById(activityId).populate('advertiser');
  
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found.' });
      }
      // Set flagged to true
      activity.flagged = true;
      await activity.save();
  
      // Send notification to the Advertiser
      if (activity.advertiser) {
        const advertiser = await Advertiser.findById(activity.advertiser._id);
  
        // Create the notification message
        const notificationMessage = `Your activity "${activity.title}" has been flagged as inappropriate.`;
  
        // Create the notification object
        const notification = new Notification({
          message: notificationMessage,
          userId: advertiser._id,
          read: false,
        });
  
        // Save the notification to the database
        await notification.save();
  
        // Check if the advertiser is online (i.e., has a socketId)
        // if (advertiser.socketId) {
        //   // Emit the notification to the Advertiser's socket ID
        //   io.to(advertiser.socketId).emit('new_notification', {
        //     message: notificationMessage,
        //     createdAt: new Date(),
        //   });
        // } else {
        //   console.log('Advertiser is offline. Storing notification in database.');
        // }
  
        // Save the notification ObjectId to the advertiser's notifications array
        advertiser.notifications.push(notification._id);
        await advertiser.save();
  
        // Send email notification to the advertiser
        // let transporter = nodemailer.createTransport({
        //   host: "smtp.gmail.com",
        //   port: 465,
        //   secure: true,
        //   auth: {
        //     user: "your-email@example.com",  // Replace with your email
        //     pass: "your-email-password",     // Replace with your password
        //   },
        //   tls: {
        //     rejectUnauthorized: false,
        //   },
        // });
  
        // const mailOptions = {
        //   from: process.env.EMAIL_USER,  // Your email address
        //   to: advertiser.email,  // The advertiser's email
        //   subject: 'Activity Flagged',
        //   text: notificationMessage,
        // };
  
        // await transporter.sendMail(mailOptions);
      }
  
      res.status(200).json({ message: 'Activity flagged successfully.', activity });
    } catch (error) {
      console.error('Error while flagging activity:', error);
      res.status(500).json({ error: 'Error while flagging activity.', details: error.message });
    }
  };
  



//create preference tags
const create_pref_tag = async (req, res) => {
    const { tag_name, description } = req.body;
    try {
        const tag = await preferencetags.create({ tag_name, description });
        res.status(200).json(tag);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};

//read preference tags
const get_pref_tag = async (req, res) => {
    // const { tag_name } = req.body;
    try {
        const tag = await preferencetags.find();
        res.status(200).json(tag);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Add Admin
const addAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Validate that the required fields are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const newAdmin = await Admin.create({ username, password });

    // Send both a success message and the new admin object in the response
    return res.status(201).json({
      message: 'Admin added successfully',
      admin: newAdmin
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
//update preference tags
const update_pref_tag = async (req, res) => {
    const { tag_name, description } = req.body;
    try {
        const tag = await preferencetags.findOneAndUpdate({ tag_name }, { description }, { new: true });
        res.status(200).json(tag);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};

//Delete preference tags
const delete_pref_tag = async (req, res) => {
    const { id } = req.params;
    try {
        const tag2 = await preferencetags.findByIdAndDelete(id);
        console.log(tag2);
        if (!tag2) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        await AdvertiserActivityModel.updateMany(
            { tags: id },
            { $pull: { tags: id } }
        );
        
        res.status(200).json({ message: 'Tag and references deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


////////////////////////////////////////////////////////////////////////////////
//create activity category
const create_act_category = async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await CategoryModel.create({ name , description });
        res.status(200).json(category);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};

//read activity category
const get_act_category = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await CategoryModel.find();
        res.status(200).json(category);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};

//update activity category
const update_act_category = async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await CategoryModel.findOneAndUpdate({ name }, { description }, { new: true });
        res.status(200).json(category);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};

//Delete activity category
const delete_act_category = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the tag to delete
        const category = await CategoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json({ message: 'category deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

////////////////////////////////////////////////////////////////////////////////
//add tourism gouverner 



const add_tourism_governer = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the Tourism Governor document
        const tourism_governer = await TourismGovernerModel.create({
            username,
            password: password,
            email
        });

        // Create the User document with reference to the governor
        const user = await User.create({
            username,
            password: password,
            userType: 'TourismGoverner',
            userDetails: tourism_governer._id
        });

        // Generate a token
        const token = jwt.sign(
            { id: tourism_governer._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ user, token, tourism_governer });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = { add_tourism_governer };


//for testing
const view_tourism_governer = async (req,res) => {
    try{
        const tourism_governer = await TourismGovernerModel.find();
        res.status(200).json(tourism_governer);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};
// Get all users for a specific role
const getAllUsers = async (req, res) => {
  const { role } = req.params;

  // Check if model exists
  const Model = models[role.toLowerCase()];

  if (!Model) {
    return res.status(400).json({ error: `Model '${role}' not found` });
  }

  try {
    const users = await Model.find(); // Fetch all users for the specified model
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Account
const deleteAccount = async (req, res) => {
    const { id, modelName } = req.params;
  
    //Check if model exists
    const Model = models[modelName.toLowerCase()];
  
    if (!Model) {
      return resizeTo
        .status(400)
        .json({ error: `Model '${modelName}' not found` });
    }
    try {
      const deletedAccount = await Model.findByIdAndDelete(id);
      if (!deletedAccount) {
        return resizeTo.status(404).json({ erro: "This account does not exist" });
      }
      res
        .status(200)
        .json({ message: "Account deleted successfully", deletedAccount });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // get all products
const getProducts= async (req,res) => {
    const {id}=req.params
    const products = await Product.find({seller:id}).sort({createdAt: -1})
    res.status(200).json(products)
}

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


// Add new product
// const createProduct = async (req, res) =>{
//     const {name, description, price, quantityAvailable, picture, seller, ratings} = req.body

//     try{
//         const product= await Product.create({name, description, price, quantityAvailable, seller, picture,ratings})
//         res.status(200).json({mssg: 'added a new product'})
//         console.log(product)
//     } catch(error){
//         res.status(400).json({error: error.message})
//     }

// }
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a unique name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage }).single('picture');

// Create a new product function
const createProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Image upload failed' });
        }
        
        const { name, description, price, quantityAvailable, seller, ratings,archieved } = req.body;

        try {
            // Create a new product with the uploaded image path
            const newProduct = new Product({
                name,
                description,
                price,
                quantityAvailable,
                picture: req.file ? req.file.path : null, // Save the image path
                seller,
                ratings,
                archieved
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
};


//  update a product
const updateProduct = async (req, res) =>{
    const { id } = req.params
  
    const updates= req.body
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such product'})
    }
    
  
    const product = await Product.findOneAndUpdate({_id:id},updates, { new: true })
  
    if(!product){
        return res.status(404).json({error:'No such product'})
    }
  
    res.status(200).json(product)
  }

const filterProducts = async(req,res) => {
    const {id} =req.params
    const{min, max}= req.query;

    try{
        const query = {
            price: {
              $gte: min, // Greater than or equal to minPrice
              $lte: max, // Less than or equal to maxPrice
            },
            seller:id
          };
        const products = await Product.find(query)
        res.status(200).json(products)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

const sortByRate = async (req, res) => {
  const {id}= req.params()
    const  {flag}  = req.query; // Use req.query here
    var x=0
    try {
      if (flag=="1") {
        x=1
      }
      else{
        x=-1
      }
        // Get sorted products by ratings in descending order
        const products = await Product.find({seller:id}).sort(  {ratings:x} ); // Change to 1 for ascending order and -1 for descending
        res.status(200).json(products); // Send the sorted products as JSON
    } catch (error) {
        console.error(error);
        res.status(400).send('Error fetching products');
    }
  };


const searchProductName = async(req,res) => {

    const { name } = req.body;
    
    
    try{
        // Use RegEx to match the substring in the product's name (case-insensitive)
        const productname = await Product.find({name: { $regex: name, $options: 'i' }})
        res.status(200).json(productname)
    }catch(error){
        res.status(400).json({error:error.message})
    }

}

const getUploadedDocuments = async (req, res) => {
    try {
        const tourGuides = await TourGuide.find({ accepted: false ,rejected:false }).select('_id username documents');
        const advertisers = await Advertiser.find({ accepted: false ,rejected:false }).select('_id username documents');
        const sellers = await Seller.find({ accepted: false ,rejected:false }).select('_id username documents');
    
        // Combine the results
        const documents = {
          tourGuides: tourGuides.map(tourGuide => ({
            id: tourGuide._id,
            username: tourGuide.username,
            documents: tourGuide.documents
          })),
          advertisers: advertisers.map(advertiser => ({
            id: advertiser._id,
            username: advertiser.username,
            documents: advertiser.documents
          })),
          sellers: sellers.map(seller => ({
            id: seller._id,
            username: seller.username,
            documents: seller.documents
          }))
        };
      // Send the documents as a response
      res.status(200).json(documents);
    } 
    catch (error) {
      res.status(500).json({ error: 'Failed to retrieve documents.' });
    }
  };





  const getComplaints = async (req,res) =>{
    try{
        const complaint = await Complaint.find();

        if(complaint.length === 0)
        {
         return res.status(404).json({error:"No Complaints Found"})
        }
        res.status(200).json(complaint)
    }
    catch(error)
    {
        res.status(400).json({error:error.message})
    }
}






  const AcceptUserStatus = async (req, res) => {
    const { id, modelName } = req.params;
     
    const Model = models[modelName.toLowerCase()];
  
    if (!Model) {
      return res.status(200).json({ message: "Account is accepted", user });
    }
    try {
      const user = await Model.findById(id);
      if (!user) {
        return res.status(200).json({ message: "acc does not exist" });
      }
      user.accepted = true; // Update the accepted field

      await user.save();
      res.status(200).json({ message: "Account is accepted", user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};


const getSales = async (req, res) => {
  const { id: productId } = req.params;  // Destructure product ID from the route parameters
  console.log(productId)
  try {
    const sales = await SalesModel.find({ Product: productId }).sort({ createdAt: -1 }).populate('Tourists');    
    

    res.status(200).json(sales);     // Send the sales data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sales data' });
  }
};

const getAllSales = async (req, res) => {
  const { id } = req.params; // Seller ID
  try {
    // Fetch sales data for the seller, populate the Product and Seller fields
    const salesWithProducts = await SalesModel.find({ Seller: id })
      .sort({ createdAt: -1 })
      .populate('Product') // Populate the Product field with product data
      .populate('Tourists')

    res.status(200).json(salesWithProducts);  // Send back the populated sales data
  } catch (error) {
    console.error('Error fetching sales with products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const archieved_on= async (req, res) =>{
  const { id } = req.params
  console.log(req.body);
  const archieved= req.body
  

  const product = await Product.findOneAndUpdate({_id:id},archieved, { new: true })


  res.status(200).json(product)
}

//Mahmoud REQUIREMENTS ( 74,75,76,77)
////////////////////////////////////////////////////////////////////////////////


const viewComplaint = async (req,res) =>{
    try{
       const {id} = req.params

        if(id)
        {
            const complaint = await Complaint.findById({_id : id})
            res.status(200).json(complaint)
        }
    }
    catch(error)
    {
        res.status(400).json({error:error.message})
    }
}

//Most likely a POST request
const resolveComplaint = async (req,res) =>{
    try{
        const {complaintId,reply} = req.body

        if(complaintId)
        {
            const complaint = await Complaint.findById(complaintId)
            console.log(reply)
            complaint.status = 'resolved'
            complaint.adminResponse = reply
            await complaint.save();
            
            console.log(complaint.status)
            console.log(complaint.adminResponse)
            res.status(200).json(complaint) //IN Frontend (if ok then continue to another page which says go back)
        }
    }
    catch(error)
    {
        res.status(400).json({error:error.message})
    }
}









const RejectUserStatus = async (req, res) => {
    const { id, modelName } = req.params;
     
    const Model = models[modelName.toLowerCase()];
    console.log(Model)
    if (!Model) {
      return res
        .status(400)
        .json({ error: `Model '${modelName}' not found` });
    }
    try {
      const user = await Model.findById(id);
      if (!user) {
        return res.status(404).json({ erro: "This account does not exist" });
      }
      user.rejected = true; // Update the accepted field

      await user.save();
      res.status(200).json({ message: "Account is rejected", user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};
const showUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching Users.', details: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Fetch all users
    const users = await User.find();

    // Count total users
    const totalUsers = users.length;

    // Count users created this month
    const usersThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Send the counts as a response
    res.status(200).json({
      totalUsers,
      usersThisMonth,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching users.', details: error.message });
  }
};


module.exports = { getComplaints,RejectUserStatus,getUploadedDocuments,create_pref_tag ,  get_pref_tag , update_pref_tag , delete_pref_tag , create_act_category , get_act_category , update_act_category , delete_act_category , add_tourism_governer , view_tourism_governer,addAdmin, deleteAccount, getAllUsers
    ,getProducts, createProduct, updateProduct, filterProducts, sortByRate, searchProductName,getSingleProduct,
    flagItinerary,getAllItineraries, AcceptUserStatus,getSales,
    viewComplaint,resolveComplaint,archieved_on,createPromoCode,showUsers,getUsers,getPromoCodes,flagActivity,getAllSales, markAllNotificationsAsRead,GetAllNotifications,markNotificationAsRead,getUnreadNotifications};

