const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Train = sequelize.define('Train', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
  coachNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatsPerCoach: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seats: {
    type: DataTypes.JSON, // Use JSON or TEXT to store the seat information
    allowNull: false,
  },
}, {
  sequelize, // Pass the sequelize instance
  modelName: 'Train',
  tableName: 'trains', // Ensure this matches your actual table name
});

// Sync the model with the database (you might want to control this in a separate migration script)
sequelize.sync()
  .then(() => {
    console.log('Trains table synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing Trains table:', error);
  });

module.exports = Train;
