// config/rabbitMQConfig.js
const host = process.env.RABBITMQ_HOST || 'localhost';
module.exports = {
    // url: `amqp://admin:admin@${host}:5672`,
    url: `amqp://admin:admin@rabbitmq:5672`,
    queue: 'seatStatusQueue',
};
