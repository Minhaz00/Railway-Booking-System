// controllers/userController.js
const { createUser, validateUserLogin } = require('../services/userService');
const logger = require('../config/logger'); // Importing the logger

// Register a new user
const registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    logger.info(`User registered: ${user.email}`); // Log successful registration
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    logger.error(`Error during user registration: ${error.message}`); // Log error during registration
    
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await validateUserLogin(email, password);
    logger.info(`User logged in: ${email}`); // Log successful login
    
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    logger.error(`Login failed for user ${email}: ${error.message}`); // Log error during login
    
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser };
