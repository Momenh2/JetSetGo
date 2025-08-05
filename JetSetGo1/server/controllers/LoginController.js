const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const Tourist = require("../models/TouristModels");
const Advertiser = require('../models/AdvertiserModel');
const TourGuide = require("../models/TourGuideModel");
const Seller = require('../models/SellerModel');
const Admin = require('../models/AdminModel');
const TourismGoverner = require('../models/TourismGovernerModel');
const nodemailer = require('nodemailer');


// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET; // Use environment variables in production

// Login function
const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {  
        return res.status(404).json({ error: 'User not found' });
      }
  
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Da el username fel backend : " +username)
      console.log("Da el username bta3 el user msh el sHolder :" + user.username)
      console.log(user.password,password)
      if (user.password!=password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate token with 24-hour expiry
      const token = jwt.sign(
        { id: user.userDetails, userType: user.userType },
        JWT_SECRET,
        { expiresIn: '24h' } // Set expiration to 24 hours
      );
  
      res.json({ token, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      console.log(error.message);
    }
  };

// Logout function
const  logout = (req, res) => {
  // If using token-based authentication, this can simply inform the client to delete the token
  res.json({ message: 'Logout successful' });
};

// Create User function
const createUser = async (req, res) => {
  const { username, password, userType, userDetails } = req.body;

  try {
    // Ensure userType is valid
    if (!['Tourist', 'Advertiser', 'TourGuide', 'Seller', 'Admin', 'TourismGoverner'].includes(userType)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: password,
      userType,
      userDetails
    });

    res.status(201).json({ user, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Populate User Data
const populateUserData = async (req, res) => {
  try {
    const models = {
      Tourist,
      Advertiser,
      TourGuide,
      Seller,
      Admin,
      TourismGoverner,
    };

    const all = []; // Declare 'all' here

    for (const [key, Model] of Object.entries(models)) {
      const data = await Model.find();
      for (const item of data) {
        try {
          const existingUser = await User.findOne({ username: item.username });
          if (existingUser) {
            console.log(`User with username ${item.username} already exists, skipping...`);
            continue;
          }

          const newUser = new User({
            username: item.username,
            password: item.password,
            userType: key,
            userDetails: item._id,
          });

          await newUser.save();
          all.push(newUser); // Add new user to 'all' array
        } catch (err) {
          if (err.code === 11000) {
            console.log(`Duplicate key error: ${err.keyValue.username}, skipping this item...`);
            continue;
          } else {
            console.error(`Error while processing item: ${item}`, err);
          }
        }
      }
    }

    res.status(200).json({ message: 'User data populated successfully', all, count: `count: ${all.length}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while populating user data' });
  }
};


const getUsersWithDefaultPassword = async (req,res) => {
  try {
    // Define the default password to search for
    const defaultPassword = 'defaultPassword123';

    console.log('Starting query to fetch users with the default password...');

    // Find all users with the default password
    const users = await User.find({ password: defaultPassword });

    // Log the number of users fetched
    console.log(`Query completed. Found ${users.length} users with the default password.`);

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error while fetching users with default password:', error);
    throw new Error('Failed to fetch users with default password');
  }
};


const deleteAllUsers = async (req,res) => {
  try {
    console.log('Starting to delete all users...');

    // Delete all users
    const result = await User.deleteMany({});

    console.log(`Deletion completed. Deleted ${result.deletedCount} users.`);
    // return result.deletedCount;
    res.status(200).json({ message: `All users deleted successfully${result.deletedCount}` });  
  } catch (error) {
    console.error('Error while deleting all users:', error);
    throw new Error('Failed to delete all users');
  }
};

const fetchAllUsers = async (req,res) => {
  try {
    console.log('Fetching all users from the database...');

    // Fetch all users
    const users = await User.find();

    console.log(`Fetch completed. Found ${users.length} users.`);
    // return users;
    res.status(200).json(users);
  } catch (error) {
    console.error('Error while fetching all users:', error);
    throw new Error('Failed to fetch all users');
  }
};
const getUserEmailById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from request parameters

    console.log(`Fetching user with ID: ${id}...`);

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      console.log(`No user found with ID: ${id}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User found. UserType: ${user.userType}, UserDetails: ${user.userDetails}`);

    // Dynamically determine the model to use based on userType
    const models = {
      Tourist,
      Advertiser,
      TourGuide,
      Seller,
      Admin,
      TourismGoverner,
    };

    const Model = models[user.userType];
    if (!Model) {
      console.log(`Invalid userType: ${user.userType}`);
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Fetch user details from the corresponding model
    const userDetails = await Model.findById(user.userDetails);

    if (!userDetails) {
      console.log(`No details found for UserDetails ID: ${user.userDetails}`);
      return res.status(404).json({ error: 'User details not found' });
    }

    // Assuming email is stored in the `email` field of the respective model
    console.log(`User email found: ${userDetails.email}`);
    res.status(200).json({ email: userDetails.email });
  } catch (error) {
    console.error('Error fetching user email by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch user email by ID' });
  }
};
const getUserEmailByUsername = async (req, res) => {
  try {
    const { username } = req.body; // Extract the username from request parameters

    console.log(`Fetching user with username: ${username}...`);

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      console.log(`No user found with username: ${username}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User found. UserType: ${user.userType}, UserDetails: ${user.userDetails}`);

    // Dynamically determine the model to use based on userType
    const models = {
      Tourist,
      Advertiser,
      TourGuide,
      Seller,
      Admin,
      TourismGoverner,
    };

    const Model = models[user.userType];
    if (!Model) {
      console.log(`Invalid userType: ${user.userType}`);
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Fetch user details from the corresponding model
    const userDetails = await Model.findById(user.userDetails);

    if (!userDetails) {
      console.log(`No details found for UserDetails ID: ${user.userDetails}`);
      return res.status(404).json({ error: 'User details not found' });
    }

    // Assuming email is stored in the `email` field of the respective model
    console.log(`User email found: ${userDetails.email}`);
    // res.status(200).json({ email: userDetails.email });
    ///////////
    const email = userDetails.email;
    const resetToken = jwt.sign({ email: userDetails.email,id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Generate the password reset link (could also include the token in a URL)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Set up the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Your email address
      to: email,  // The user's email
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({ message: 'Password reset email sent successfully.' });
  
    /////////////
  } catch (error) {
    console.error('Error fetching user email by username:', error.message);
    res.status(500).json({ error: 'Failed to fetch user email by username' });
  }
};



// Password reset function
const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;  // Extract the email from the request body

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a password reset token (e.g., a JWT or unique token)
    const resetToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Generate the password reset link (could also include the token in a URL)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Set up the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Your email address
      to: email,  // The user's email
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Error sending password reset email' });
  }
};



const changePassword = async (req, res) => {
  try {
    const { id, newPassword } = req.body; // Extract user ID and new password from request body

    if (!id || !newPassword) {
      return res.status(400).json({ error: "User ID and new password are required" });
    }

    // Find the user by ID in the main User collection
    const user = await User.findById(id);

    if (!user) {
      console.log(`No user found with ID: ${id}`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`User found. UserType: ${user.userType}, UserDetails: ${user.userDetails}`);

    // Dynamically determine the model to use based on userType
    const models = {
      Tourist,
      Advertiser,
      TourGuide,
      Seller,
      Admin,
      TourismGoverner,
    };

    const Model = models[user.userType];
    if (!Model) {
      console.log(`Invalid userType: ${user.userType}`);
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Fetch user details from the corresponding model
    const userDetails = await Model.findById(user.userDetails);

    if (!userDetails) {
      console.log(`No details found for UserDetails ID: ${user.userDetails}`);
      return res.status(404).json({ error: "User details not found" });
    }

    // Update the password in both the User schema and the corresponding user model
    user.password = newPassword;
    userDetails.password = newPassword;

    await user.save();
    await userDetails.save();

    console.log(`Password updated successfully for user ID: ${id}`);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Failed to change password" });
  }
};



``

module.exports = { logout, populateUserData, login, createUser, getUsersWithDefaultPassword ,deleteAllUsers,fetchAllUsers,getUserEmailById,getUserEmailByUsername,sendPasswordResetEmail,changePassword};




  // Async function enables allows handling of promises with await
  
    // First, define send settings by creating a new transporter: 
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
   
    
    // // Define and send message inside transporter.sendEmail() and await info about send from promise:
    // let info = await transporter.sendMail({
    //   from: '"You" <***-example-person@gmail.com>',
    //   to: "magedmark50@gmail.com",
    //   subject: "Testing, testing, 123",
    //   html: `
    //   <h1>Hello there</h1>
    //   <p>Isn't NodeMailer useful?</p>
    //   `,
    // });
  
    // console.log(info.messageId); // Random ID generated after successful send (optional)
  