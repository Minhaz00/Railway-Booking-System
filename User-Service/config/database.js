// // config/db.js
// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

const connectDB = async (uri = process.env.MONGO_URI) => {
  try {
    // Check if we already have a connection
    if (mongoose.connection.readyState === 1) {
      logger.info('MongoDB already connected');
      return;
    }

    await mongoose.connect(uri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection failed:', error);
  }
};

module.exports = { connectDB, disconnectDB };