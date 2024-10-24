const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

const lockSeat = async (trainId, seatId) => {
  const seatKey = `train:${trainId}:seat:${seatId}`;
  const isLocked = await client.get(seatKey);

  if (isLocked) return false;

  await client.set(seatKey, 'locked', 'EX', 5 * 60); // Lock for 5 minutes
  return true;
};

const releaseSeat = async (trainId, seatId) => {
  const seatKey = `train:${trainId}:seat:${seatId}`;
  await client.del(seatKey);
};

module.exports = { lockSeat, releaseSeat };
