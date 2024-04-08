require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

class DbConnection {
  constructor() {
    this.db = null;
    this.client = null;
  }

  async connect() {
    const url = process.env.MONGODB_CONNECTION_STRING;
    this.client = await MongoClient.connect(url);
    console.log("Connected successfully to server");
    this.db = this.client.db();
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log("Closed the database connection");
    }
  }
}

module.exports = new DbConnection();