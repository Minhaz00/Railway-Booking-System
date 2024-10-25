const axios = require("axios");
const { setAsync, delAsync } = require("../config/redis");
const trainService = require("../services/trainService");
const Train = require("../models/Train");
const TRAIN_SERVICE_URL = "http://localhost:3001/api/trains"; // URL of your Train service
const BOOKING_LOCK_PREFIX = "booking_lock_";
const LOCK_EXPIRE_TIME = 50000; // Lock expiration time in milliseconds

const bookSeat = async (req, res) => {
  const { trainId, coachIndex, seatNum } = req.body;

  const lockKey = `${BOOKING_LOCK_PREFIX}${trainId}_${coachIndex}_${seatNum}`;

  try {
    // Attempt to acquire the lock
    const lockAcquired = await setAsync(
      lockKey,
      "LOCKED",
      "PX",
      LOCK_EXPIRE_TIME,
      "NX"
    );

    if (!lockAcquired) {
      return res.status(409).json({
        error: "Seat is currently being booked by another user. Please try again later.",
      });
    }

    // Booking logic goes here
    // 1. Fetch the train and check seat availability
    // 2. If available, update seat status to BOOKED
    // 3. Save updated train information

    // Release the lock after the booking is successful
    await delAsync(lockKey);
    return res.json({ message: "Seat booked successfully." });
  } catch (error) {
    console.error("Error during booking:", error);
    return res.status(500).json({ error: "An error occurred while booking the seat." });
  } finally {
    // Always release the lock if it was acquired
    if (await getAsync(lockKey)) {
      await delAsync(lockKey);
    }
  }
};

const getSeatById = async (req, res) => {
  try {
    const { trainId, coachNumber, seatNumber } = req.params;
    const coachId = coachNumber;

    // Fetch the train by ID
    const train = await trainService.getTrainById(trainId);
    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    const coachIndex = parseInt(coachId) - 1; // Assuming coach IDs start from 1
    if (coachIndex < 0 || coachIndex >= train.totalCoaches) {
      return res.status(404).json({ error: "Coach not found" });
    }

    // Retrieve the seat status for the specified coach
    const seatStatus = train.seatStatus[coachIndex]; // Get the seat status for the specific coach
    const seatNum = parseInt(seatNumber);

    if (!seatStatus || seatNum < 1 || seatNum > seatStatus.length) {
      return res.status(404).json({ error: "Seat not found" });
    }

    const individualSeatStatus = seatStatus[seatNum - 1];
    console.log(seatStatus); // Adjust for 0-based index
    return res.json({ seatStatus: individualSeatStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateSeatStatus = async (req, res) => {
  try {
    const { trainId, coachNumber, seatNumber } = req.params;
    const { status } = req.body; // Expecting status to be sent in the request body
    const coachId = coachNumber;

    // Validate the status value
    if (!["FREE", "ON_HOLD", "BLOCKED"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status value. Allowed values: FREE, ON_HOLD, BLOCKED.",
      });
    }

    // Fetch the train by ID
    const train = await trainService.getTrainById(trainId);
    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    const coachIndex = parseInt(coachId) - 1; // Assuming coach IDs start from 1
    if (coachIndex < 0 || coachIndex >= train.totalCoaches) {
      return res.status(404).json({ error: "Coach not found" });
    }

    const seatStatusOfParticularCoach = [...train.seatStatus[coachIndex]]; // Ensure it's an array
    const seatNum = parseInt(seatNumber);

    if (!seatStatusOfParticularCoach || seatNum < 1 || seatNum > seatStatusOfParticularCoach.length) {
      return res.status(404).json({ error: "Seat not found" });
    }

    // Log before updating
    console.log(
      `Updating seat ${seatNum} from ${seatStatusOfParticularCoach[seatNum - 1]} to ${status}`
    );

    // Update the seat status (make sure the seatStatusOfParticularCoach is an array)
    seatStatusOfParticularCoach[seatNum - 1] = status; // Adjust for 0-based index

    // Now update the overall seatStatus with this new updated coach array
    const updatedSeatStatus = [...train.seatStatus]; // Copy the seat status array
    updatedSeatStatus[coachIndex] = seatStatusOfParticularCoach; // Update the specific coach

    // Update the train document
    await Train.update(
      { seatStatus: updatedSeatStatus }, // Update seat status
      { where: { id: trainId } } // Use the train ID to find the document
    );

    // Fetch the updated train to confirm the change
    const updatedTrain = await trainService.getTrainById(trainId);
    console.log("Updated Train Seat Status:", updatedTrain.seatStatus);

    return res.json({
      message: "Seat status updated successfully.",
      seat: updatedTrain.seatStatus[coachIndex][seatNum - 1], // Access updated seat status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions using CommonJS
module.exports = {
  bookSeat,
  getSeatById,
  updateSeatStatus,
};
