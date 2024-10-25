// models/Coach.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Train = require("./train");

const Coach = sequelize.define("Coach", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, // Automatically increments the value
    primaryKey: true, // Defines this as the primary key
  },
  coachNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  trainId: {
    type: DataTypes.UUID,
    references: {
      model: Train,
      key: "id",
    },
  },
});

Train.hasMany(Coach, { foreignKey: "trainId", onDelete: "CASCADE" });
Coach.belongsTo(Train, { foreignKey: "trainId" });

module.exports = Coach;
