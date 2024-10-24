const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } }));

// Only connect to database if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// basic routes
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).send('Server Error');
});

module.exports = app;