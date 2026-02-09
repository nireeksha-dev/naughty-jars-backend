import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI!);
    
    // Access the collection
    const db = mongoose.connection.db;
    const naughtyJarsCollection = db.collection("naughty_jars");
    
    console.log("Database Connected");
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
    console.log(`Collection available: naughty_jars`);
    
    return mongoose.connection;
  } catch (error) {
    console.error("Database Connection Error: ", error);
    throw error;
  }
};

mongoose.connection.on("error", (error) => {
  console.error("Mongoose Connection Error: ", error);
});

// Optional: Export a function to get the collection
export const getNaughtyJarsCollection = () => {
  return mongoose.connection.db?.collection("naughty_jars");
};