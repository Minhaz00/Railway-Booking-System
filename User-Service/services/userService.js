// services/userService.js
const User = require('../models/userModel');

// Function to create a new user
const createUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Create new user
  const user = new User({ name, email, password });
  await user.save();
  return user;
};

// Function to validate user login
const validateUserLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return user;
};

module.exports = { createUser, validateUserLogin };
