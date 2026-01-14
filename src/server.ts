// server.ts
import { connectDB } from "./config/mongodb";
import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import crewRoutes from "./routes/crewRoutes";
import adminRoutes from "./routes/adminRoutes";
import testimonialRoutes from "./routes/testimonialRoutes"

const app = express();
app.use(express.json());

app.use(cors({
  origin: "localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/crew", crewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/testimonials", testimonialRoutes);

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