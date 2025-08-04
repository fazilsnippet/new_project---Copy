import asyncHandler from "express-async-handler";
import {
  requestOtp,
  verifyOtp,
  resetPassword,
} from "../services/otpService.js";

export const requestOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  await requestOtp(email);
  res.status(200).json({ message: "OTP sent to your email" });
});

export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });

  await verifyOtp(email, otp);
  res.status(200).json({ message: "OTP verified successfully" });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || password !== confirmPassword)
    return res.status(400).json({ message: "Invalid inputs" });

  const result = await resetPassword({ email, password });
  res.status(200).json({ message: "Password reset successfully", result });
});
