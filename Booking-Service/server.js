const express = require('express');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Use routes
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
