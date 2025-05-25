
// // test/setup.js or inside your test file
// import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";

// let mongo;

// beforeAll(async () => {
//   mongo = await MongoMemoryServer.create(); // Starts in-memory MongoDB
//   const uri = mongo.getUri();

//   await mongoose.connect(uri); // Connect Mongoose to it
// });

// afterEach(async () => {
//   const collections = await mongoose.connection.db.collections();
//   for (let collection of collections) {
//     await collection.deleteMany(); // Clear DB between tests
//   }
// });

// afterAll(async () => {
//   await mongoose.connection.close();
//   await mongo.stop(); // Stops the in-memory server
// });
