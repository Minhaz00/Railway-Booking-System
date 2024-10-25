const sequelize = require('../config/database'); // Adjust path as necessary
const { DataTypes } = require('sequelize');

<<<<<<< HEAD
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
  id: {clear
    
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
=======
const Train = sequelize.define('Train', {
>>>>>>> 466858256b934e42ea7155fedb8440db692482b0
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  arrivalTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  totalCoaches: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatsPerCoach: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatStatus: {
<<<<<<< HEAD
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: Array(10).fill(Array(10).fill('FREE')), // Example static value for testing
  },
  frequency: {
    type: DataTypes.ARRAY(DataTypes.STRING),
=======
    type: DataTypes.ARRAY(DataTypes.STRING), // Ensure this is set correctly
>>>>>>> 466858256b934e42ea7155fedb8440db692482b0
    allowNull: false,
  },
  
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Train;
