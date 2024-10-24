const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');

let mongoServer;

beforeAll(async () => {
  // Create the MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Disconnect from any existing connection
  await disconnectDB();
  
  // Connect to the in-memory database
  await connectDB(mongoUri);
});

afterAll(async () => {
  await disconnectDB();
  await mongoServer.stop();
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  }
});