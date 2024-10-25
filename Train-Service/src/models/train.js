const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Train extends Model {}

Train.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
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
    type: DataTypes.JSON, // Store seat status as JSON
    allowNull: false,
  },
  frequency: {
    type: DataTypes.JSON, // Store frequency as JSON
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Train',
});

module.exports = Train;