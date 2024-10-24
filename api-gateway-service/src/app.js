// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const proxyRoutes = require('./routes/proxyRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', proxyRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
