const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

const connectDB = () => {
  return client.connect()
    .then(() => {
      db = client.db("ClubsEvents");
      console.log("MongoDB Connected!");
      return db;
    })
    .catch(err => {
      console.error("MongoDB Connection Error:", err.message);
      process.exit(1);
    });
};

const getDB = () => db;

module.exports = { connectDB, getDB };
