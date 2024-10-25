const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/book', bookingController.bookSeat);


router.get('/sit-info-by-id/:trainId/coaches/:coachNumber/seats/:seatNumber',bookingController.getSeatById)

router.put("/update-info/:trainId/coaches/:coachNumber/seats/:seatNumber")

module.exports = router;
