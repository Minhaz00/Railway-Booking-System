const express = require('express');
const seatController = require('../controllers/seatController');
const trainController = require('../controllers/trainController');
const router = express.Router();

// Get all seats for a specific coach
router.get('/coaches/:coachId/seats', seatController.getSeatsByCoach);

// Get seat by seat ID
router.get('/seats/:seatId', seatController.getSeatById);

// // Update seat status (e.g., booking or marking seat as blocked)
// router.patch('/seats/:seatId/status', seatController.updateSeatStatus);

// // Release seat (set status to FREE)
// router.patch('/seats/:seatId/release', seatController.releaseSeat);






router.get('/:trainId/coaches/:coachNumber/seats/:seatNumber', trainController.getSeatById);

// Update a specific seat's status
router.put('/:trainId/coaches/:coachNumber/seats/:seatNumber', trainController.updateSeatStatus);


module.exports = router;
