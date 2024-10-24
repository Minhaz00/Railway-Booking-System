const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  url: 'redis://localhost:6379', // Update the URL if needed
});

// Handle connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect the client
(async () => {
  await redisClient.connect(); // Use await to ensure connection is established
})();

module.exports = {
  redisClient,
  setAsync: (key, value, mode, duration, condition) => {
    return redisClient.set(key, value, mode, duration, condition);
  },
  getAsync: (key) => {
    return redisClient.get(key);
  },
  delAsync: (key) => {
    return redisClient.del(key);
  },
};
