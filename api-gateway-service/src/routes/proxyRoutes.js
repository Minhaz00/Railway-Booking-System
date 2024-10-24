// src/routes/proxyRoutes.js
const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');

// Define routes for different services
router.use('/user-service', proxyController.proxyToService1);
router.use('/payment-service', proxyController.proxyToService3);
// router.use('/train-service', proxyController.proxyToService2);
// router.use('/notification-service', proxyController.proxyToService4);

module.exports = router;
