const TourGuide = require('../models/TourGuideModel');  //
const Tourist = require('../models/TouristModels');
  // 
const Advertiser = require('../models/AdvertiserModel');  //
const Seller = require('../models/SellerModel');  //
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadDoc = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
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
    const registerTourGuide = async (req, res) => {
        const { email, username, password, accepted } = req.body;

        try {
            // Check if files were uploaded
            const documentPaths = req.files ? req.files.map(file => file.path) : [];

            // Create new tour guide with documents
            const newTourGuide = await TourGuide.create({
                email,
                username,
                password,
                accepted,
                documents: documentPaths,
            });
                    // Create User
        const user = await User.create({
            username,
            password: password,
            userType: 'TourGuide',
            userDetails: newTourGuide._id,
        });

        // Generate token
        const token = jwt.sign({ id: newTourGuide._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token, tourGuide: newTourGuide });

       // res.status(201).json(newTourGuide);
        console.log("ana tmam fel back")
        } catch (error) {
           // console.log()
            res.status(500).json({ error: error.message });
            
        }
    };



const registerTourist = async (req, res) => {
  const { email, username, password, nationality, dob, job, mobile } = req.body;

  const age = calculateAge(dob); //helper function to calculate age
  if (age < 18) {
    return res
      .status(400)
      .json({ error: "Must be 18 or older to register as a tourist" });
  }

  try {
    const newTourist = await Tourist.create({
      email,
      username,
      password,
      nationality,
      dob,
      job,
      mobile,
    });
        // Create the user entry
        const user = await User.create({
            username,
            password,
            userType: 'Tourist',
            userDetails: newTourist._id,
          });
      
          // Generate JWT
          const token = jwt.sign(
            { id: newTourist._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({ token, message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerAdvertiser = async (req, res) => {
    const { email, username, password, accepted } = req.body;
    console.log(req.body)
    try {
        const documentPaths = req.files ? req.files.map(file => file.path) : [];

        const newAdvertiser = await Advertiser.create({
            email,
            username,
            password,
            accepted,
            documents: documentPaths,
        });
     // Create User
     const user = await User.create({
        username,
        password: password,
        userType: 'Advertisers',
        userDetails: newAdvertiser._id,
    });

    // Generate token
    const token = jwt.sign({ id: newAdvertiser._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token, advertiser: newAdvertiser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const registerSeller = async (req, res) => {
    const { email, username, password, accepted } = req.body;

    try {
        const documentPaths = req.files ? req.files.map(file => file.path) : [];

        const newSeller = await Seller.create({
            email,
            username,
            password,
            accepted,
            documents: documentPaths,
        });

          // Create User
          const user = await User.create({
            username,
            password: password,
            userType: 'Seller',
            userDetails: newSeller._id,
        });

        // Generate token
        const token = jwt.sign({ id: newSeller._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token, seller: newSeller });
    } catch (error) {
        res.status(500).json({ error: 'Error registering seller' });
    }
};


/////////////HELLLPPPERRRRRR TO CALCCC THE AGE OF THE TOURIST//////////////
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birthdate has not yet occurred this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

module.exports = {
  registerTourist,
  registerTourGuide,
  registerAdvertiser,
  registerSeller,
  uploadDoc
};
