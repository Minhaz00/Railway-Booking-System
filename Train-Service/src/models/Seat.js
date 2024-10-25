// models/Seat.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Coach = require("./Coach");

const Seat = sequelize.define("Seat", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, // Automatically increments the value
    primaryKey: true, // Defines this as the primary key
  },
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("FREE", "ON_HOLD", "BLOCKED"),
    defaultValue: "FREE",
  },
  
  
});

Coach.hasMany(Seat, { foreignKey: "coachId", onDelete: "CASCADE" });
Seat.belongsTo(Coach, { foreignKey: "coachId" });

module.exports = Seat;
