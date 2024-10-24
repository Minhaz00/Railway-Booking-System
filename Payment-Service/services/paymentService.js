async function processPayment(email) {
    console.log(`Processing payment for ${email}...`);
    // Simulate a dummy payment process
    return { success: true };
  }
  
  module.exports = { processPayment };
  