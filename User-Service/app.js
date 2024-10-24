// app.js
const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/database');
const logger = require('./config/logger');  // Import winston logger
const morgan = require("morgan")
dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } }));
connectDB();

// Request logging middleware
// app.use((req, res, next) => {
//   logger.info(`${req.method} ${req.url}`);
//   next();
// });

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).send('Server Error');
});

module.exports = app;
