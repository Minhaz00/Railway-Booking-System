const Train = require("../models/Train");
const sequelize = require("../config/database");
class TrainService {
  // Find all trains
  async getAllTrains() {
    try {
      const trains = await Train.findAll();
      return trains;
    } catch (error) {
      throw new Error("Error fetching trains");
    }
  }

  // Find train by ID
  async getTrainById(id) {
    try {
      const train = await Train.findByPk(id);
      if (!train) {
        throw new Error("Train not found");
      }
      return train;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create new train (similar to MongoDB's insertOne)
  async createTrain(trainData) {
    try {
      const newTrain = await Train.create(trainData);
      return newTrain;
    } catch (error) {
      console.error("Error creating train:", error); // Log the exact error
      throw error; // Rethrow the error to be caught in the controller
    }
  }

  // Update train by ID (findByIdAndUpdate style)
  async updateTrain(id, trainData) {
    try {
      const train = await Train.findByPk(id);
      if (!train) {
        throw new Error("Train not found");
      }
      // Update train with new data
      const updatedTrain = await train.update(trainData);
      return updatedTrain;
    } catch (error) {
      throw new Error("Error updating train");
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
