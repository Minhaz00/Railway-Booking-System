// app.js
const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
const logger = require('./config/logger');  // Import winston logger

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).send('Server Error');
});

module.exports = app;
