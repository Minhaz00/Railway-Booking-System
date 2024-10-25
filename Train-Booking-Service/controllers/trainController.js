const Train = require("../models/train");
const sequelize=require("../config/db");
const { redisClient } = require("../config/redis");
const BOOKING_LOCK_PREFIX = "booking_lock_";
const { setAsync, delAsync, getAsync} = require("../config/redis"); 
const rabbitMQService = require("../services/rabbitMQService");
const LOCK_EXPIRE_TIME = 50000;



exports.createTrain = async (req, res) => {
  const { name, source, destination, coachNumber, seatsPerCoach } = req.body;

  // Initialize seats for each coach
  const seats = [];
  for (let i = 0; i < coachNumber; i++) {
    const coachSeats = new Array(seatsPerCoach).fill("FREE"); // Fill with 'FREE'
    seats.push(coachSeats);
  }

  try {
    const train = await Train.create({
      name,
      source,
      destination,
      coachNumber,
      seatsPerCoach,
      seats,
    });
    res.status(201).json(train);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Find trains by source and destination
exports.findTrains = async (req, res) => {
  const { source, destination } = req.query;
  try {
    const trains = await Train.findAll({ where: { source, destination } });
    res.status(200).json(trains);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSeatStatus = async (req, res) => {
  const { trainId, coachNumber, seatNumber } = req.params;
  const redisKey = `train:${trainId}:coach:${coachNumber}:seats`;
  console.log(redisKey)
  try {
    const cachedSeats = await redisClient.get(redisKey);
  
      if (cachedSeats) {
        console.log("Returning seat data from Redis cache");
        const seatStatus = JSON.parse(cachedSeats);
        const seatNum = parseInt(seatNumber);
  
        if (seatNum < 1 || seatNum > seatStatus.length) {
          return res.status(404).json({ error: "Seat not found" });
        }
  
        return res.json({ seatStatus: seatStatus[seatNum - 1] });
      }
    // Find the train by its ID
    const train = await Train.findByPk(trainId);

    // Check if the train exists
    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    // Get the seat information for the specified coach
    const coachIndex = parseInt(coachNumber) - 1; // Assuming coach numbers start from 1
    if (coachIndex < 0 || coachIndex >= train.coachNumber) {
      return res.status(400).json({ error: "Invalid coach number" });
    }

    // Check if the seat number is valid
    const seatIndex = parseInt(seatNumber) - 1; // Assuming seat numbers start from 1
    if (seatIndex < 0 || seatIndex >= train.seats[coachIndex].length) {
      return res.status(400).json({ error: "Invalid seat number" });
    }

    const seatStatus = train.seats[coachIndex][seatIndex]; // Retrieve status of the specified seat
    await redisClient.set(redisKey, JSON.stringify(train.seats[coachIndex]), "EX", 3600);
  
    console.log("Returning seat data from database");
    res.status(200).json({
      coachNumber: coachNumber,
      seatNumber: seatNumber,
      status: seatStatus, // Return the status of the specific seat
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateSeatStatus = async (req, res) => {
  const { trainId, coachNumber, seatNumber } = req.params;
  const { status } = req.body;
  const lockKey = `${BOOKING_LOCK_PREFIX}${trainId}_${coachNumber}_${seatNumber}`;
  const redisKey = `train:${trainId}:coach:${coachNumber}:seats`;
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
    error: "This seat is being updated by another process. Please try again later.",
  });
}


    // Step 1: Find the train by its ID
    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    // Step 2: Validate coach and seat numbers
    const coachIndex = parseInt(coachNumber) - 1;
    if (coachIndex < 0 || coachIndex >= train.coachNumber) {
      return res.status(400).json({ error: "Invalid coach number" });
    }

    const seatIndex = parseInt(seatNumber) - 1;
    if (seatIndex < 0 || seatIndex >= train.seats[coachIndex].length) {
      return res.status(400).json({ error: "Invalid seat number" });
    }

    // Step 3: Get the current status and create a deep copy of seats array
    const previousStatus = train.seats[coachIndex][seatIndex];
    const updatedSeats = JSON.parse(JSON.stringify(train.seats));
    
    // Step 4: Update the seat status in the copied array
    updatedSeats[coachIndex][seatIndex] = status;

    // Step 5: Update the entire seats array
    const updateResult = await Train.update(
      { seats: updatedSeats },
      { where: { id: trainId } }
    );

    if (updateResult[0] === 0) {
      return res.status(400).json({ error: "Failed to update seat status." });
    }
     await redisClient.set(redisKey, JSON.stringify(train.seats[coachIndex]), "EX", 3600);
  
    const message = { trainId, coachNumber, seatNumber, status, updatedAt: new Date().toISOString() };
    await rabbitMQService.sendMessage(message);


    // Step 6: Fetch the updated train record
    const updatedTrain = await Train.findByPk(trainId);
    const newStatus = updatedTrain.seats[coachIndex][seatIndex];

    res.status(200).json({
      coachNumber,
      seatNumber,
      previousStatus,
      newStatus,
    });
  } catch (error) {
    console.error('Error updating seat status:', error);
    res.status(500).json({ error: error.message });
  }
};