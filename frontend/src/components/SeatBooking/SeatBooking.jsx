import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SeatBooking.css';

const SeatBooking = ({ compartment, seatIndex }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleBooking = () => {
    if (name && email) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
      alert(`Your OTP is: ${otp}`); // In real case, send the OTP to the user via email/SMS

      // Navigate to the payment page with OTP
      navigate(`/payment`, { state: { otp, name, email, compartment, seatIndex } });
    } else {
      alert('Please provide your name and email.');
    }
  };

  return (
    <div className="seat-booking-container">
      <h2>Confirm Your Booking</h2>
      <div className="seat-info">
        <p><strong>Compartment:</strong> {compartment}</p>
        <p><strong>Seat Number:</strong> {seatIndex + 1}</p> {/* Display seat number */}
      </div>
      <div className="input-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button onClick={handleBooking}>Proceed to Payment</button>
    </div>
  );
};

export default SeatBooking;
