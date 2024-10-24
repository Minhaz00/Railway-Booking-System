const redisService = require('../services/redisService');

const bookSeat = async (req, res) => {
  const { userId, trainId, seatId } = req.body;

  try {
    const lock = await redisService.lockSeat(trainId, seatId);
    if (!lock) {
      return res.status(400).json({ message: 'Seat is already booked or on hold' });
    }

    // Simulate seat being held for 5 minutes
    setTimeout(() => {
      redisService.releaseSeat(trainId, seatId);
    }, 5 * 60 * 1000); // 5 minutes

    return res.status(200).json({ message: 'Seat is on hold for 5 minutes' });
  } catch (error) {
    return res.status(500).json({ message: 'Error booking seat' });
  }
};

module.exports = { bookSeat };
