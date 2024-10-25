const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { Sequelize } = require("sequelize");
class Train extends Model {
  // Method to calculate free seats
  getFreeSeatsCount() {
    let freeCount = 0;
    this.seatStatus.forEach(coach => {
      coach.forEach(seat => {
        if (seat === 'FREE') {
          freeCount++;
        }
      });
    });
    return freeCount;
  }
}

// Define the Train model
Train.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  seatStatus: {
    type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.ENUM('FREE', 'ON_HOLD', 'BLOCKED'))),
    allowNull: false,
    defaultValue: Array(10).fill(Array(10).fill('FREE')), // Example static value for testing
  },
  
  // Define a virtual attribute
  freeSeats: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getFreeSeatsCount(); // Call the method to get the count
    }
  }
}, {
  sequelize,
  modelName: 'Train',
});

// Example usage of freeSeats
// Train.findByPk(trainId).then(train => {
//   console.log(`Free seats: ${train.freeSeats}`); // Accessing the virtual attribute
// });

module.exports = Train;