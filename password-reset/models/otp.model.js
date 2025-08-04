import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otpHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "600" }, // 10 mins
  verified: { type: Boolean, default: false },
});

export default mongoose.model("OtpToken", otpSchema);
