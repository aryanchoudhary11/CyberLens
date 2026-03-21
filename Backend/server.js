import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import cors from "cors";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import targetRoutes from "./Routes/targetRoutes.js";
import scanRoutes from "./Routes/ScanRoutes.js";
import { protect } from "./Middleware/authMiddleware.js";
import aiRoutes from "./Routes/aiRoutes.js";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes — require login
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/targets", protect, targetRoutes);
app.use("/api/scan", protect, scanRoutes);
app.use("/api/ai", protect, aiRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
