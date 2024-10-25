// services/rabbitMQService.js
const amqp = require('amqplib');
const rabbitMQConfig = require('../config/rabbitMQ');
const uri = process.env.RABBITMQ_URL;
class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queue = 'seatStatusQueue';
    }

    async connect() {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect(uri);
                this.channel = await this.connection.createChannel();
                await this.channel.assertQueue(this.queue, { durable: true });
                console.log('RabbitMQ connection and channel successfully initialized');
            }
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            throw new Error('RabbitMQ connection failed');
        }
    }

    async sendMessage(message) {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        try {
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            console.log('Message sent to RabbitMQ:', message);
        } catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
            throw new Error('RabbitMQ send message failed');
        }
    }

    async closeConnection() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
}

module.exports = new RabbitMQService();
