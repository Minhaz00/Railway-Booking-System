const seatService = require("../services/seatService");

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
      const seat = await seatService.getSeatById(req.params.seatId);
      if (!seat) {
        return res.status(404).json({ error: "Seat not found" });
      }
      res.json(seat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update seat status (e.g., booking a seat, holding a seat)
  async updateSeat(req, res) {
    const { trainId, coachNumber, seatNumber } = req.params;
    const { status } = req.body;
console.log(trainId, coachNumber, seatNumber,status)
    try {
      // Check if status is valid
      if (!["BOOKED", "FREE", "ON_HOLD", "BLOCKED"].includes(status)) {
        return res.status(400).json({ error: "Invalid seat status" });
      }

      const updatedSeat = await seatService.updateSeatStatus(
        trainId,
        coachNumber,
        seatNumber,
        status
      );

      if (!updatedSeat) {
        return res.status(404).json({ error: "Seat not found" });
      }

      res.json(updatedSeat);
    } catch (error) {
      res.status(500).json({ error: "Error updating seat status" });
    }
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
