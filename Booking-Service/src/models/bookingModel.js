// Simulate database for seat booking
const bookings = [];

const createBooking = (userId, trainId, seatId) => {
  bookings.push({ userId, trainId, seatId, status: 'on-hold' });
};

module.exports = { createBooking };
