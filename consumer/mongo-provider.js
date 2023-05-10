const { MongoClient } = require('mongodb');

class MongoProvider {
  constructor() {
    this.url = 'mongodb://mongodb:27017';
  }

  async insert(document) {
    const mongoClient = new MongoClient(this.url);
    await mongoClient.connect();
    try {
      const collection = mongoClient.db("messages-data").collection("messages");
      await collection.insertOne(document);
      return true;
    } catch (error) {
      console.log(`Error during insert: ${error}`);
      return false;
    } finally {
      await mongoClient.close();
    }
  }

  async read() {
    const mongoClient = new MongoClient(this.url);
    const collection = mongoClient.db("messages-data").collection("messages");
    const cursor = collection.find({});
    const result = await cursor.toArray();
    await mongoClient.close();
    return result;
  }
}

module.exports = {
  MongoProvider
};