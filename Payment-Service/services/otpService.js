const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

let otpStore = {}; // In-memory storage of OTPs, ideally should be Redis in production

// Generate OTP
function generateOTP() {
  return otpGenerator.generate(6, { upperCase: false, specialChars: false });
}

// Send OTP to email
async function sendOTPEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Payment OTP',
    text: `Your OTP for the payment process is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${email}`);
}

// Store OTP in memory
function storeOTP(email, otp) {
  otpStore[email] = { otp, expiry: Date.now() + OTP_EXPIRY_TIME };
}

// Verify OTP
function verifyOTP(email, otp) {
  const data = otpStore[email];
  if (!data || Date.now() > data.expiry) {
    return false;
  }
  return data.otp === otp;
}

module.exports = { generateOTP, sendOTPEmail, storeOTP, verifyOTP };
