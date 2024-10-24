// src/routes/proxyRoutes.js
const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');

// Define routes for different services
router.use('/users', proxyController.proxyToService1);
router.use('/service2', proxyController.proxyToService2);

module.exports = router;
