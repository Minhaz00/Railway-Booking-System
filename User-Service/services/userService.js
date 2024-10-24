const User = require('../models/userModel');
const logger = require('../config/logger');

const createUser = async (userData) => {
  const { name, email, password, username } = userData;

  // Check if the email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error('Email already in use');
  }

  // Check if the username already exists
  const existingUsername = await User.findOne({  });
  if (existingUsername) {
    throw new Error('Username already in use');
  }

  // Create new user
  const user = new User({ name, email, password, username });
  await user.save();
  return user;
};

// Function to validate user login
const validateUserLogin = async (email, password) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      logger.error(`Login failed for email: ${email} - User not found`);
      throw new Error('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.matchPassword(password); // Using the method defined in user schema
    if (!isMatch) {
      logger.error(`Login failed for email: ${email} - Incorrect password`);
      throw new Error('Invalid email or password');
    }

    logger.info(`Login successful for email: ${email}`);
    return user; // If successful, return the user

  } catch (error) {
    logger.error(`Error during user login for email: ${email} - ${error.message}`);
    throw error;
  }
};

module.exports = { createUser, validateUserLogin };
