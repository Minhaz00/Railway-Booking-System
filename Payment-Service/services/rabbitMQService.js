const { getChannel } = require('../config/rabbitMQ');

async function sendMessageToQueue(queueName, message) {
  const channel = await getChannel();
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log(`Message sent to queue ${queueName}: ${message}`);
}

async function consumeQueue(queueName, callback) {
  const channel = await getChannel();
  await channel.assertQueue(queueName);
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      console.log(`Received message from queue ${queueName}: ${msg.content.toString()}`);
      callback(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
}

module.exports = { sendMessageToQueue, consumeQueue };
