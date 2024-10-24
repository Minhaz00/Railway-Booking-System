const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('EXPRESS', 'LOCAL', 'INTERCITY'),
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
  // Initialize seat status for each coach as 'FREE'
  seatStatus: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: Array(10).fill(Array(10).fill('FREE')), // Example static value for testing
  },
  frequency: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'MAINTENANCE'),
    defaultValue: 'ACTIVE',
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
