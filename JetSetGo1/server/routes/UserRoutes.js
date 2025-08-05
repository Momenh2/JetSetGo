const express = require('express');
const { logout, populateUserData, login, createUser ,getUsersWithDefaultPassword,deleteAllUsers,fetchAllUsers,getUserEmailById,getUserEmailByUsername,sendPasswordResetEmail,changePassword} = require('../controllers/LoginController.js');

const Loginrouter = express.Router();

// Login route
Loginrouter.post('/login', login);

// Logout route
Loginrouter.delete('/logout', logout);

// Create user route
Loginrouter.post('/create', createUser);

// Populate user data route
Loginrouter.get('/populate', populateUserData);

Loginrouter.get('/test', getUsersWithDefaultPassword);
Loginrouter.get('/del_test', deleteAllUsers);
Loginrouter.get('/getall', fetchAllUsers);


Loginrouter.post('/getmail', getUserEmailByUsername);

Loginrouter.post('/reset', sendPasswordResetEmail);

Loginrouter.post('/change-password', changePassword);




module.exports = Loginrouter;
