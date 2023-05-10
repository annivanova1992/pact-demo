const path = require("path");
const { MessageProviderPact, providerWithMetadata } = require("@pact-foundation/pact");
const { MessageFactory } = require('./message-factory');

const PROVIDER_VERSION = "1.0.0.p2";

describe("Message provider tests", () => {
  const messageProvider = new MessageProviderPact({
    messageProviders: {
      'a new message from provider': providerWithMetadata(() => new MessageFactory().createNewMessage("jfjf-13222-1234-5678"), {
        kafka_topic: 'messages',
        "content-type": "application/json"
      }),
    },
    provider: "provider-service",
    providerVersion: PROVIDER_VERSION,
    pactUrls: [
      path.resolve(
        process.cwd(),
        "pacts",
        "consumer-service-provider-service.json"
      ),
    ],
    publishVerificationResult: true,
    logLevel: "info",
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    pactBrokerUrl: "http://localhost:9292",
    providerVersionTags: ["main"],
    pactBrokerUsername: "pactbrokeruser",
    pactBrokerPassword: "pactbrokerpassword"
  })

  describe("Provider API Client", () => {
    it("sends a message", () => {
      return messageProvider.verify();
    })
  })
})