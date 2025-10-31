import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product";
import { data } from "./data/data"; 

dotenv.config(); 

const MONGO_URI = process.env.MONGO_URI; 

const seedProducts = async () => {
  try {
    if (!MONGO_URI) throw new Error("Missing MONGO_URI in .env");

    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB connected");

    await Product.deleteMany({});
    console.log(" Old products deleted");

    await Product.insertMany(data);
    console.log(" Products inserted successfully");

    await mongoose.disconnect();
    console.log(" MongoDB disconnected");
  } catch (error) {
    console.error(" Error seeding products:", error);
    mongoose.disconnect();
  }
};

seedProducts();
