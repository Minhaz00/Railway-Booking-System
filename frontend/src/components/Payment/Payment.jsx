import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

const PaymentPage = () => {
  const location = useLocation();
  const { otp, name, email, compartment, seatIndex } = location.state || {};
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    if (enteredOtp === otp) {
      setIsVerified(true);
    } else {
      alert('Incorrect OTP. Please try again.');
    }
  };

  const handlePayment = () => {
    // Mock payment process
    alert('Payment Successful!');
    setPaymentCompleted(true);
    navigate('/'); // Redirect to home or a success page
  };

  return (
    <div className="payment-container">
      <h2>Payment Page</h2>
      {!isVerified ? (
        <div>
          <h3>Verify OTP</h3>
          <p>An OTP has been sent to your email: {email}</p>
          <input
            type="text"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      ) : (
        <div>
          <h3>Payment Details</h3>
          <p>Compartment: {compartment}</p>
          <p>Seat Number: {seatIndex + 1}</p>
          <button onClick={handlePayment}>Pay Now</button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
