
const { MongoClient } = require("mongodb");
const env = require("./env");

const client = new MongoClient(env.mongoUri);

async function connectToDatabase() {
  await client.connect();

  const db = client.db(env.mongoDb);

  console.log(`Conectado a MongoDB: ${env.mongoDb}`);

  return db;
}

module.exports = {
  connectToDatabase,
  client,
};
