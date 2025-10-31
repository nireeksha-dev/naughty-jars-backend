import { connectDB } from "./config/mongodb";
import "dotenv/config";
import express from "express";
// import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(express.json());
// app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

export default app;

app.get("/", (req, res) => {
  res.send("hello");
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
