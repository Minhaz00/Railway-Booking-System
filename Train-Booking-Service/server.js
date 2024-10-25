const express = require('express');
const bodyParser = require('body-parser');
const trainRoutes = require('./routes/trainRoutes');
const sequelize = require('./config/db');
require('dotenv').config();
const morgan = require("morgan");
const rabbitMQService = require('./services/rabbitMQService');
const app = express();
app.use(bodyParser.json());
PORT = process.env.PORT
// Middleware
app.use('/api/trains', trainRoutes);
app.use(morgan('dev'))
// Start the server
async function startServer() {
  try {

    await rabbitMQService.connect();
    console.log('RabbitMQ connected successfully');

    // 2. Sync database
    await sequelize.sync();
    console.log('Database synced successfully');
    
    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`Train service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
