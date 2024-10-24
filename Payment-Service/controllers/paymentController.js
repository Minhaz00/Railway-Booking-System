const otpService = require('../services/otpService');
const paymentService = require('../services/paymentService');
const rabbitMQService = require('../services/rabbitMQService');

// Reusable function to initiate payment logic
async function initiatePaymentLogic(email) {
  const otp = otpService.generateOTP();
  console.log(otp)
  otpService.storeOTP(email, otp);

  // Send OTP to email
  await otpService.sendOTPEmail(email, otp);

  // You can add additional logic if required (such as logging)
  return { message: 'OTP sent to email. Please verify to proceed.' };
}

// Controller function used for HTTP route
async function initiatePayment(req, res) {
  const { email } = req.body;
  try {
    const response = await initiatePaymentLogic(email);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}

// Reusing initiate logic in both places
async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  if (!otpService.verifyOTP(email, otp)) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // Proceed with dummy payment process
  const paymentResult = await paymentService.processPayment(email);
  if (paymentResult.success) {
    await rabbitMQService.sendMessageToQueue('payment-confirmation', { email, status: 'PAID' });
    return res.json({ message: 'Payment successful' });
  } else {
    return res.status(500).json({ error: 'Payment failed' });
  }
}

module.exports = { initiatePayment, verifyOTP, initiatePaymentLogic };
