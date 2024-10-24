const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/initiate', paymentController.initiatePayment); // Send OTP
router.post('/verify', paymentController.verifyOTP);         // Verify OTP and process payment

module.exports = router;
