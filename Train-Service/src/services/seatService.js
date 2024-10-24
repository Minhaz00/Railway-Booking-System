const seatService = require("../services/seatService");
const Seat = require("../models/Seat");
class SeatController {
  // Get all seats for a specific coach
  async getSeatsByCoach(req, res) {
    try {
      const seats = await seatService.getSeatsByCoach(req.params.coachId);
      res.json(seats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get seat by seat ID
  async getSeatById(req, res) {
    try {
      console.log(req.params.trainId);
      console.log(req.params.coachId);
      
      const seat = await seatService.getSeatById(req.params.seatId);
      if (!seatStatus || seatStatus.length === 0) {
        return res.status(404).json({ error: "No seats found" });
      }
      if (!seat) {
        return res.status(404).json({ error: "Seat not found" });
      }
      res.json(seat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update seat status (e.g., booking a seat, holding a seat)
  async updateSeatStatus(trainId, coachNumber, seatNumber, status) {
    const seat = await Seat.findOne({
      where: { trainId, coachNumber, seatNumber },
    });

    if (!seat) {
      return null; // Seat not found
    }

    seat.status = status;
    await seat.save();

    return seat;
  }

  // Release a seat (set status to FREE)
  async releaseSeat(req, res) {
    try {
      const seat = await seatService.updateSeatStatus(
        req.params.seatId,
        "FREE"
      );
      if (!seat) {
        return res.status(404).json({ error: "Seat not found" });
      }
      res.json(seat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SeatController();
