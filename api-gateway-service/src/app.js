// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Import morgan
const proxyRoutes = require('./routes/proxyRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', proxyRoutes);

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
