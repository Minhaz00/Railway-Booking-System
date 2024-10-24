require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const trainRoutes = require('./routes/trainRoutes');
const seatRoutes = require('./routes/seatRoute');
const morgan = require("morgan")
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.use('/api/trains', trainRoutes);
app.use('/api/trains/seats', seatRoutes);

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Train service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();

module.exports = app;