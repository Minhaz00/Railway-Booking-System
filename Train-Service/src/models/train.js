const sequelize = require('../config/database'); // Adjust path as necessary
const { DataTypes } = require('sequelize');

const Train = sequelize.define('Train', {
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
    type: DataTypes.ARRAY(DataTypes.STRING), // Ensure this is set correctly
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
