import * as mongoose from "mongoose";

const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env
  .MONGO_PASSWORD}@ds157584.mlab.com:57584/hive`;
let db;

const connectMongoose = () => {
  mongoose.connect(mongoUri, {
    useMongoClient: true
  });

  db = mongoose.connection;
  //Bind connection to error event (to get notification of connection errors)
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  console.log("mongoose connected");
};

export { connectMongoose };
