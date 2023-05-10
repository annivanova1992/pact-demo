const { Matchers, MessageConsumerPact, asynchronousBodyHandler } = require('@pact-foundation/pact');
const { like, term } = Matchers;
const path = require('path');
const { MessageHandler } = require('./message-handler');

describe("Kafka handler test", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "consumer-service",
    provider: "provider-service",
    pactfileWriteMode: "update",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  const fakeDatabaseProvider = jest.fn();
  fakeDatabaseProvider.insert = jest.fn();
  fakeDatabaseProvider.insert.mockReturnValue(true);
  const consumerMessageHandler = new MessageHandler(fakeDatabaseProvider);
  const consumerHandleFunction = consumerMessageHandler.handle.bind(consumerMessageHandler);

  describe("receive a message", () => {
    it("accepts a message", () => {
      return messagePact
        .given("provider created a new message")
        .expectsToReceive("a new message from provider")
        .withContent({
          id: like("some-uuid-1234-5678"),
          text: like("Some Text"),
          version: like("v1"),
          event: term({ generate: "UPDATED", matcher: "^(CREATED|UPDATED|DELETED)$"}),
        })
        .withMetadata({
          "content-type": "application/json",
          "kafka_topic": "messages",
        })
        .verify(asynchronousBodyHandler(consumerHandleFunction));
    });
  });
});