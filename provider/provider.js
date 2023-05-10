const { Kafka } = require('kafkajs');
const express = require('express');
const bodyParser = require('body-parser');
const { MessageFactory } = require('./message-factory');

const app = express();
app.use(bodyParser.json());

const kafka = new Kafka({
  clientId: 'pact-provider',
  brokers: ['kafka:9092'],
});

const topic = 'messages';
const messageProducer = kafka.producer();

app.post('/message', async (req, res) => {
  const message = await new MessageFactory().createNewMessage(req.body.messageId);
  const messageKey = message.key || null;
  const messageValue = JSON.stringify(message);
  await messageProducer.send({
    topic,
    messages: [{ key: messageKey, value: messageValue }],
  });
  console.log(`Sent message: ${messageValue}`);
  res.sendStatus(200);
});

async function start() {
  await messageProducer.connect();
  app.listen(3001, () => {
    console.log('Provider service listening on port 3001');
  });
}

async function stop() {
  await messageProducer.disconnect();
}

start();

module.exports = {
  server: {
    start,
    close: stop,
  },
  app
};