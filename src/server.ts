// server.ts
import { connectDB } from "./config/mongodb";
import "dotenv/config";
import express from "express";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import crewRoutes from "./routes/crewRoutes";
import adminRoutes from "./routes/adminRoutes"; // 👈 Add this

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/crew", crewRoutes);
app.use("/api/admin", adminRoutes); // 👈 Add this

app.get("/", (req, res) => {
  res.send("API is running...");
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server Listening @ ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();