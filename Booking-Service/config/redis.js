const redis = require('redis');

// Create Redis client
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// Handle Redis errors
client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Custom promisified methods
const setAsync = (key, value) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const getAsync = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const delAsync = (key) => {
  return new Promise((resolve, reject) => {
    client.del(key, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const existsAsync = (key) => {
  return new Promise((resolve, reject) => {
    client.exists(key, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const hgetAsync = (hash, key) => {
  return new Promise((resolve, reject) => {
    client.hget(hash, key, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const hsetAsync = (hash, key, value) => {
  return new Promise((resolve, reject) => {
    client.hset(hash, key, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Graceful shutdown function
const shutdown = async () => {
  console.log('Closing Redis connection...');
  await new Promise((resolve) => {
    client.quit((err) => {
      if (err) {
        console.error('Error closing Redis client:', err);
      }
      resolve();
    });
  });
  console.log('Redis connection closed.');
};

// Export Redis methods and shutdown function
module.exports = {
  setAsync,
  getAsync,
  delAsync,
  existsAsync,
  hgetAsync,
  hsetAsync,
  shutdown,
};

// Handle process termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
