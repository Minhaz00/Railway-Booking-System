const trainService = require("../services/trainService");
const Train = require("../models/train");
const { setAsync, delAsync, getAsync, redisClient } = require("../config/redis"); // Assuming you're using Redis

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
    try {
      const train = await trainService.createTrain(req.body);
      res.status(201).json(train);
    } catch (error) {
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
    const coachId = coachNumber;
    const redisKey = `train:${trainId}:coach:${coachId}:seats`;
  
    try {
      // Check if the seat status for this train and coach is cached in Redis
      const cachedSeats = await redisClient.get(redisKey);
      
      if (cachedSeats) {
        console.log('Returning seat data from Redis cache');
        const seatStatus = JSON.parse(cachedSeats);
        const seatNum = parseInt(seatNumber);
  
        if (!seatStatus || seatNum < 1 || seatNum > seatStatus.length) {
          return res.status(404).json({ error: "Seat not found" });
        }
  
        const individualSeatStatus = seatStatus[seatNum - 1]; // Adjust for 0-based index
        return res.json({ seatStatus: individualSeatStatus });
      }
  
      // If not cached, fetch from the database
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
  
      // Cache the seat status for this coach in Redis for future requests
      await redisClient.set(redisKey, JSON.stringify(seatStatus), 'EX', 3600); // Cache with 1 hour expiry
  
      console.log('Returning seat data from database');
      return res.json({ seatStatus: individualSeatStatus });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
  

  async updateSeatStatus(req, res) {
    const { trainId, coachNumber, seatNumber } = req.params;
    const { status } = req.body;
    const coachId = coachNumber;

    const lockKey = `${BOOKING_LOCK_PREFIX}${trainId}_${coachNumber}_${seatNumber}`;
    const redisKey = `train:${trainId}:coach:${coachId}:seats`;
    try {
      // Validate the status value
      if (!["FREE", "ON_HOLD", "BLOCKED"].includes(status)) {
        return res.status(400).json({
          error:
            "Invalid status value. Allowed values: FREE, ON_HOLD, BLOCKED.",
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

      if (
        !seatStatusOfParticularCoach ||
        seatNum < 1 ||
        seatNum > seatStatusOfParticularCoach.length
      ) {
        return res.status(404).json({ error: "Seat not found" });
      }

      // Log before updating
      console.log(
        `Updating seat ${seatNum} from ${
          seatStatusOfParticularCoach[seatNum - 1]
        } to ${status}`
      );

      // Update the seat status
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
      await setAsync(redisKey, JSON.stringify(updatedSeatStatus));
      return res.json({
        message: "Seat status updated successfully.",
        seat: updatedTrain.seatStatus[coachIndex][seatNum - 1], // Access updated seat status
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
