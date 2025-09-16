// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   otp: { type: String, required: true },
//   purpose: { type: String, enum: ["signup", "forgotPassword", "updatePassword"], required: true },
//   expiresAt: { type: Date, required: true },
// });

// export const OTP = mongoose.model("OTP", otpSchema);

import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ["signup", "forgotPassword", "updatePassword"], required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // TTL index
});

// TTL index will automatically remove expired docs
// No manual cleanup needed after expiry
export const OTP = mongoose.model("OTP", otpSchema);
