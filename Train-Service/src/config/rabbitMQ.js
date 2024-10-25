// config/rabbitMQConfig.js
const uri = process.env.RABBITMQ_URL
module.exports = {
    url: uri,
    queue: 'seatStatusQueue',
};
