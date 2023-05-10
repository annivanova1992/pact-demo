class MessageHandler {
  constructor(databaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async handle(message) {
    if (!message.id ||
      !message.text ||
      !message.version ||
      !message.event) {
      throw new Error("Malformed message");
    }

    await this.databaseProvider.insert(message);
    return true;
  }
}

module.exports = {
  MessageHandler
};