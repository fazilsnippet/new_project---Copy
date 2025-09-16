import {OTP} from "../models/otp.model.js"
import { User } from '../models/user.model.js';
import { sendEmail } from "../utils/sendEmail.js";
import { generateOtp } from "../utils/generateOtp.js";
export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email, purpose: "signup" });
    await OTP.create({ email, otp: otpCode, purpose: "signup", expiresAt });

    await sendEmail(email, "Signup OTP", `Your OTP is ${otpCode}`);
    res.json({ message: "OTP sent for registration" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const otpRecord = await OTP.findOne({ email, otp, purpose: "signup" });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    await OTP.deleteMany({ email, purpose: "signup" });

    const user = new User({ email, password });
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email, purpose: "forgotPassword" });
    await OTP.create({ email, otp: otpCode, purpose: "forgotPassword", expiresAt });

    await sendEmail(email, "Forgot Password OTP", `Your OTP is ${otpCode}`);
    res.json({ message: "OTP sent for password reset" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await OTP.findOne({ email, otp, purpose: "forgotPassword" });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    await OTP.deleteMany({ email, purpose: "forgotPassword" });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendUpdatePasswordOtp = async (req, res) => {
  try {
    const email = req.user.email; // from JWT
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email, purpose: "updatePassword" });
    await OTP.create({ email, otp: otpCode, purpose: "updatePassword", expiresAt });

    await sendEmail(email, "Password Update OTP", `Your OTP is ${otpCode}`);
    res.json({ message: "OTP sent for password update" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePasswordAfterLogin = async (req, res) => {
  try {
    const email = req.user.email;
    const { otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({ email, otp, purpose: "updatePassword" });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    await OTP.deleteMany({ email, purpose: "updatePassword" });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

