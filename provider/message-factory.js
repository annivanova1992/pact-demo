class MessageFactory {
  createNewMessage(messageId) {
    return new Promise((resolve, reject) => {
      resolve({
        id: messageId,
        text: "some test text",
        version: "v1",
        event: "CREATED"
      })
    })
  }
}

module.exports = {
  MessageFactory
};