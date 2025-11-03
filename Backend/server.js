import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import cors from "cors";
import dashboardRoutes from "./Routes/dashboardRoutes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
