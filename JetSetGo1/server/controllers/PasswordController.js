const bcrypt = require('bcrypt');
const Admin = require('../models/AdminModel');
const Advertiser = require('../models/AdvertiserModel');
const User = require('../models/UserModel'); 
const TourGuide = require('../models/TourGuideModel');
const Tourist = require('../models/TouristModels');
const TourismGoverner = require('../models/TourismGovernerModel')
const Seller = require('../models/SellerModel')

const models={admin: Admin, seller: Seller, tourguide: TourGuide, tourist: Tourist, advertisers: Advertiser, tourismgoverner: TourismGoverner};

const changePassword = async (req, res) => {
    const { id, modelName } = req.params;
    const { oldPassword, newPassword } = req.body;

    const Model = models[modelName.toLowerCase()];
    console.log(modelName)
    console.log("ana gowa el backend")
    console.log(Model)
    if (!Model) {
        return res.status(400).json({ error: 'Model Not found' });
      }

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both old and new passwords are required.' });
    }
    console.log("before the try")
    try {
        
        // Get the model based on user type
        console.log("before const user = ")
        // Find the user in the appropriate collection
        const user = await Model.findById(id);
        console.log("after const user = ")
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        // Find the user in the User model
        const generalUser = await User.findOne({ userDetails: id });
        if (!generalUser) {
            return res.status(404).json({ error: 'User not found in the main User model.' });
        }

        console.log("after !user")

        // Verify old password
       
        if (oldPassword != user.password || oldPassword != generalUser.password) {
            return res.status(400).json({ error: 'Incorrect old password.' });
        }

        console.log("after oldPassword != user.password")

        // Hash the new password and save it
        user.password = newPassword
        generalUser.password = newPassword
        await user.save();
        await generalUser.save();

        console.log("ba3d el save")

        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { changePassword };