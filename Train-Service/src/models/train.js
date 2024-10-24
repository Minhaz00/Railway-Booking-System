const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Train = sequelize.define('Train', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('EXPRESS', 'LOCAL', 'INTERCITY'),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  arrivalTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  totalCoaches: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seatsPerCoach: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  frequency: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'MAINTENANCE'),
    defaultValue: 'ACTIVE'
  }
});

module.exports = Train;
