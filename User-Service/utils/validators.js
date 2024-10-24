// utils/validators.js
const validator = require('validator');

const validateUserInput = (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};

module.exports = { validateUserInput };
