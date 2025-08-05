require("dotenv").config(); // For the env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

// Import routes
const advertiserRoutes = require("./routes/advertiserRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const tourGuideRoutes = require("./routes/tourGuideRoutes");
const TourGuide = require("./models/TourGuideModel")
const Advertiser = require("./models/AdvertiserModel.js")
const tourismGovernerRoutes = require("./routes/tourismGovernerRoutes");
const touristRoutes = require("./routes/touristRoutes");
const guestRoutes = require('./routes/guestRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const registerRoutes = require('./routes/registerRoutes');
const router = require('./routes/router.js');
const Loginrouter = require('./routes/UserRoutes.js');
const Notification = require("./models/Notification")

// Express app
const app = express();

// Middleware to handle CORS and JSON body
app.use(cors({
  origin: 'http://localhost:3000',  // Allow frontend to access backend (React app)
  methods: ['GET', 'POST','DELETE','PATCH','PUT'],         // Allow only GET and POST methods
  credentials: true                 // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json()); // Allows us to access the body of requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Use routes
app.use('/api/register', registerRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/advertisers', advertiserRoutes);
app.use('/api/tourism-governer', tourismGovernerRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/tour-guides', tourGuideRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api', router);
app.use("/uploads", express.static("uploads"));
app.use('/user', Loginrouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Mongo :)");

  
    // Create the HTTP server and attach it to Express app
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 8000}`);
    });

    // Create the Socket.IO server and configure CORS
    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',  // Allow requests only from your frontend
        methods: ['GET', 'POST'],         // Allow only GET and POST methods
        credentials: true                 // Allow credentials (cookies, authorization headers, etc.)
      }
    });

    // Handle socket connections
    io.on('connection', (socket) => {
      console.log('Someone has connected!');

      socket.on('register', async ({ userId }) => {
        try {
          // Clear any existing socketId for the user
          await TourGuide.updateOne({ _id: userId }, { $set: { socketId: null } });
          await Advertiser.updateOne({ _id: userId }, { $set: { socketId: null } });
      
          // Update the socketId in the user model
          const tourGuide = await TourGuide.findById(userId);
          if (tourGuide) {
            // Update socketId and save
            tourGuide.socketId = socket.id;
            await tourGuide.save();
      
            // Retrieve unread notifications from the database
            const notifications = await Notification.find({ userId: tourGuide._id, read: false });
      
            // Emit the unread notifications to the client
            socket.emit('notifications', notifications);
      
            // Mark the notifications as read
            // await Notification.updateMany({ userId: tourGuide._id, read: false }, { $set: { read: true } });
          }
      
          // You can do similar logic for Advertiser if needed
          const advertiser = await Advertiser.findById(userId);
          if (advertiser) {
            advertiser.socketId = socket.id;
            await advertiser.save();
          }
        } catch (error) {
          console.error('Error in register socket event:', error);
        }
      });
      

  // Handle disconnection
    socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);

    // You can choose to remove the socketId from the model upon disconnection if needed
    await TourGuide.updateMany({ socketId: socket.id }, { $set: { socketId: null } });
    await Advertiser.updateMany({ socketId: socket.id }, { $set: { socketId: null } });

      // Handle disconnect event
      });
      socket.on('reconnect', async () => {
        console.log('User reconnected:', socket.id);
      
        // Optionally, you can re-fetch the user's data or reset state
        const user = await TourGuide.findOne({ socketId: socket.id });
        if (user) {
          console.log('User reconnected:', user);
        }
      });

      // Handle custom events
      socket.on('chat_message', (msg) => {
        console.log('Received message:', msg);
        io.emit('chat_message', msg); // Broadcast message to all connected clients
      });
    });
  })


  .catch((error) => {
    console.log(error);
  });
