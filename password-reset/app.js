import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
  max: parseInt(process.env.RATE_LIMIT_MAX),
  message: "Too many OTP requests from this IP, please try again later.",
});
app.use("/api/password-reset/request-otp", limiter);

connectDB();
app.use("/api/password-reset", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
