const trainService = require("../services/trainService");
const Train = require("../models/train");
const { setAsync, delAsync, getAsync, redisClient } = require("../config/redis"); // Assuming you're using Redis
const rabbitMQService = require('../services/rabbitMQService');
const BOOKING_LOCK_PREFIX = "booking_lock_";
const LOCK_EXPIRE_TIME = 50000;
class TrainController {
  async getAllTrains(req, res) {
    try {
      const trains = await trainService.getAllTrains();
      res.json(trains);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTrainById(req, res) {
    try {
      const train = await trainService.getTrainById(req.params.id);
      if (!train) {
        return res.status(404).json({ error: "Train not found" });
      }
      res.json(train);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createTrain(req, res) {
    const {
      totalCoaches,
      seatsPerCoach,
      ...rest
    } = req.body;
  
    try {
      // Create the seatStatus array based on totalCoaches and seatsPerCoach
      const seatStatus = Array(totalCoaches * seatsPerCoach).fill("FREE");
  
      const trainData = {
        ...rest,
        totalCoaches,
        seatsPerCoach,
        seatStatus, // Include seatStatus in the trainData
      };
  
      // Create the train in the database
      const train = await Train.create(trainData);
      res.status(201).json(train);
    } catch (error) {
      console.error("Error creating train:", error);
      res.status(500).json({ error: error.message });
    }
  }
  
  
  
  async updateTrain(req, res) {
    try {
      const train = await trainService.updateTrain(req.params.id, req.body);
      if (!train) {
        return res.status(404).json({ error: "Train not found" });
      }
      res.json(train);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTrain(req, res) {
    try {
      const success = await trainService.deleteTrain(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Train not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getSeatById(req, res) {
    const { trainId, coachNumber, seatNumber } = req.params;
    const redisKey = `train:${trainId}:coach:${coachNumber}:seats`;
  
    try {
      // Check if the seat status for this train and coach is cached in Redis
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
  
      // If not cached, fetch from the database
      const train = await Train.findByPk(trainId);
      if (!train) {
        return res.status(404).json({ error: "Train not found" });
      }
  
      const coachIndex = parseInt(coachNumber) - 1; // Calculate flat index
      const seatsPerCoach = train.seatsPerCoach; // Assuming this field exists
  
      // Calculate the flat seat index
      const flatSeatIndex = coachIndex * seatsPerCoach + (parseInt(seatNumber) - 1);
  
      if (flatSeatIndex < 0 || flatSeatIndex >= train.seatStatus.length) {
        return res.status(404).json({ error: "Seat not found" });
      }
  
      // Cache the seat status in Redis for future requests
      await redisClient.set(redisKey, JSON.stringify(train.seatStatus), "EX", 3600);
  
      console.log("Returning seat data from database");
      return res.json({ seatStatus: train.seatStatus[flatSeatIndex] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  
  
  

  async updateSeatStatus(req, res) {
    const { trainId, coachNumber, seatNumber } = req.params;
    const { status } = req.body;
  
    const lockKey = `${BOOKING_LOCK_PREFIX}${trainId}_${coachNumber}_${seatNumber}`;
    const redisKey = `train:${trainId}:coach:${coachNumber}:seats`;
  
    try {
      // Validate the status value
      if (!["FREE", "ON_HOLD", "BLOCKED"].includes(status)) {
        return res.status(400).json({
          error: "Invalid status value. Allowed values: FREE, ON_HOLD, BLOCKED.",
        });
      }
  
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
  
      // Fetch the train by ID
      const train = await Train.findByPk(trainId);
      if (!train) {
        return res.status(404).json({ error: "Train not found" });
      }
  
      const coachIndex = parseInt(coachNumber) - 1; // Calculate flat index
      const seatsPerCoach = train.seatsPerCoach; // Assuming this field exists
  
      // Calculate the flat seat index
      const flatSeatIndex = coachIndex * seatsPerCoach + (parseInt(seatNumber) - 1);
  
      if (flatSeatIndex < 0 || flatSeatIndex >= train.seatStatus.length) {
        return res.status(404).json({ error: "Seat not found" });
      }
  
      // Log before updating
      console.log(`Updating seat ${seatNumber} from ${train.seatStatus[flatSeatIndex]} to ${status}`);
  
      // Update the seat status
      train.seatStatus[flatSeatIndex] = status; // Update the specific seat
  
      // Update the train document
      await Train.update(
        { seatStatus: train.seatStatus }, // Update seat status
        { where: { id: trainId } } // Use the train ID to find the document
      );
  
      // Cache the updated seat status in Redis
      await redisClient.set(redisKey, JSON.stringify(train.seatStatus), "EX", 3600);
  
      const message = { trainId, coachNumber, seatNumber, status, updatedAt: new Date().toISOString() };
      await rabbitMQService.sendMessage(message);
  
      return res.json({
        message: "Seat status updated successfully.",
        seat: train.seatStatus[flatSeatIndex], // Access updated seat status
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      // Always release the lock if it was acquired
      if (await getAsync(lockKey)) {
        await delAsync(lockKey);
      }
    }
  }
  
  


    async getTrainsBySourceAndDestination(req, res) {
      console.log(req.query)
      try {
        console.log("hello")
        const { source, destination } = req.query;
  
        // Validate if source and destination are provided
        if (!source || !destination) {
          return res.status(400).json({
            error: "Please provide both source and destination parameters.",
          });
        }
  
        // Query the database to find trains matching source and destination
        const trains = await Train.findAll({
          where: {
            source: source,         // Ensure these are fields of type STRING in your model
            destination: destination // Ensure these are fields of type STRING in your model
          }
        });
        console.log(trains)
  
        // Check if any trains were found
        if (trains.length === 0) {
          return res.status(404).json({
            message: "No trains found for the given source and destination."
          });
        }
  
        // Return the list of matching trains
        return res.json({
          message: "Trains found.",
          trains: trains
        });
      } catch (error) {
        console.error("Error fetching trains:", error);
        return res.status(500).json({
          error: "An error occurred while fetching train information."
        });
      }
    }
  
}

module.exports = new TrainController();
