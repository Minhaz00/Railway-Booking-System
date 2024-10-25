require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rabbitMQ = require('./config/rabbitMQ');
const paymentRoutes = require('./routes/paymentRoutes');
const rabbitMQService = require('./services/rabbitMQService');
const paymentController=require("./controllers/paymentController")
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await rabbitMQ.connect();
    console.log('RabbitMQ connected successfully');

    // Start consuming messages
    await rabbitMQService.consumeQueue('seatStatusQueue', async (message) => {
      const email = "u1904010@student.cuet.ac.bd"
      console.log(`Processing payment request for: ${email}`);

      // Call the payment logic directly
      const result = await paymentController.initiatePaymentLogic(email);
      console.log('Payment initiation result:', result);
    });

    app.listen(PORT, () => {
      console.log(`Payment service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
