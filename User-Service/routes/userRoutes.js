// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Route for registering a user
router.post('/register', registerUser);

// Route for logging in a user
router.post('/login', loginUser);

module.exports = router;
