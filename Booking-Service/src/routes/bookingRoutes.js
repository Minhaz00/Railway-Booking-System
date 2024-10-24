const express = require('express');
const { bookSeat } = require('../controllers/bookingController');
const router = express.Router();

router.post('/book', bookSeat);

module.exports = router;
