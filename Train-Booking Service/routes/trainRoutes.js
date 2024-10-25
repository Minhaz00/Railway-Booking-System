const express = require('express');
const { createTrain, findTrains, getSeatStatus, updateSeatStatus } = require('../controllers/trainController');

const router = express.Router();

// Route to create a train
router.post('/', createTrain);

// Route to find trains
router.get('/', findTrains);




router.get('/:trainId/coaches/:coachNumber/seats/:seatNumber', getSeatStatus);
router.put('/:trainId/coaches/:coachNumber/seats/:seatNumber', updateSeatStatus);


module.exports = router;
