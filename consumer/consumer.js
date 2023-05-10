const { Kafka } = require('kafkajs');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoProvider } = require('./mongo-provider');
const { MessageHandler } = require('./message-handler');

const app = express();
app.use(bodyParser.json());

const kafka = new Kafka({
  clientId: 'pact-consumer',
  brokers: ['kafka:9092'],
});

const consumerGroupId = 'pact-consumer-group';
const topic = 'messages';
const messagesTopicConsumer = kafka.consumer({ groupId: consumerGroupId });
const mongoDatabaseProvider = new MongoProvider();
const messageHandler = new MessageHandler(mongoDatabaseProvider);

app.get('/message', async (req, res) => {
  res.json(await mongoDatabaseProvider.read());
});

async function start() {
  await messagesTopicConsumer.connect();
  await messagesTopicConsumer.subscribe({ topics: [ topic ], fromBeginning: true });

  await messagesTopicConsumer.run({
    eachMessage: subscribeToMessages
  });

  app.listen(3000, () => {
    console.log('Consumer service listening on port 3000');
  });
}

async function stop() {
  await messagesTopicConsumer.disconnect();
}

async function subscribeToMessages({ topic, partition, message }) {
  const messagePayload = JSON.parse(message.value.toString());
  console.log({
    key: message.key,
    value: messagePayload,
    headers: message.headers,
    topic: topic,
    partition: partition,
    offset: message.offset,
    timestamp: message.timestamp
  });

  await messageHandler.handle(messagePayload);

  await messagesTopicConsumer.commitOffsets([{
    topic: topic,
    partition: partition,
    offset: message.offset
  }]);
}

start();

module.exports = {
  server: {
    start,
    close: stop,
  },
  app
};