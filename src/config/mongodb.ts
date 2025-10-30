import "dotenv/config";
import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error("Database Connection Error: ", error);
  }
};

mongoose.connection.on("error", (error) => {
  console.error("Mongoose Connection Error: ", error);
});
