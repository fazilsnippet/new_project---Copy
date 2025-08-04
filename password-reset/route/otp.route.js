import express from "express";
import {
  requestOtpController,
  verifyOtpController,
  resetPasswordController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/request-otp", requestOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router;
