const Train = require("../models/train");
const sequelize = require("../config/database");
const { trace } = require('@opentelemetry/api');

class TrainService {
  // Find all trains
  async getAllTrains() {
    const span = trace.getTracer('train-service').startSpan('Get All Trains');
    try {
      const trains = await Train.findAll();
      return trains;
    } catch (error) {
      span.recordException(error);
      throw new Error("Error fetching trains");
    } finally {
      span.end();
    }
  }

  // Find train by ID
  async getTrainById(id) {
    const span = trace.getTracer('train-service').startSpan('Get Train By ID');
    try {
      const train = await Train.findByPk(id);
      if (!train) {
        throw new Error("Train not found");
      }
      return train;
    } catch (error) {
      span.recordException(error);
      throw new Error(error.message);
    } finally {
      span.end();
    }
  }

  // Create new train (similar to MongoDB's insertOne)
  async createTrain(trainData) {
    const span = trace.getTracer('train-service').startSpan('Create Train');
    try {
      // Initialize seatStatus as FREE for all seats
      const seatStatus = Array.from({ length: trainData.totalCoaches }, () =>
        Array(trainData.seatsPerCoach).fill("FREE")
      );

      // Create the new train with the initialized seatStatus
      const newTrain = await Train.create({
        ...trainData,
        seatStatus: seatStatus // Set the seatStatus to the initialized array
      });

      return newTrain;
    } catch (error) {
      console.error("Error creating train:", error);
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  }

  // Update train by ID (findByIdAndUpdate style)
  async updateTrain(id, trainData) {
    const span = trace.getTracer('train-service').startSpan('Update Train');
    try {
      const train = await Train.findByPk(id);
      if (!train) {
        throw new Error("Train not found");
      }
      const updatedTrain = await train.update(trainData);
      return updatedTrain;
    } catch (error) {
      span.recordException(error);
      throw new Error("Error updating train");
    } finally {
      span.end();
    }
  }

  // Delete train by ID (findByIdAndDelete style)
  async deleteTrain(id) {
    try {
      const train = await Train.findByPk(id);
      if (!train) {
        throw new Error("Train not found");
      }
      await train.destroy();
      return true;
    } catch (error) {
      throw new Error("Error deleting train");
    }
  }

  async updateSeatStatus(trainId, coachId, seatNumber, status) {
    try {
      const result = await Train.update(
        {
          seatStatus: sequelize.fn(
            'jsonb_set',
            sequelize.col('seatStatus'),
            `'{${coachId - 1},${seatNumber - 1}}'`, // Correct path as text
            `"${status}"` // Ensure this is a valid JSON string
          ),
        },
        {
          where: { id: trainId },
          returning: true, // This will return the updated instance if your DB supports it
        }
      );
  
      // Access the updated instance
      const updatedTrain = result[1][0].dataValues; // result[1] is the array containing updated instances
      console.log("Updated Train Data:", updatedTrain);
  
      return result;
    } catch (error) {
      console.error("Error updating seat status:", error);
      throw error; // Propagate the error to the controller
    }
  }
  
}  
module.exports = new TrainService();
