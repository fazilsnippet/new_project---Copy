import OtpToken from "../models/OtpToken.js";
import { generateOtp, hashOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "./emailService.js";
// import Redis from "ioredis"; // optional

// const redis = new Redis();

export const requestOtp = async (email) => {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  await OtpToken.deleteMany({ email }); // remove previous
  await OtpToken.create({ email, otpHash });

  // await redis.setex(email, 600, otp); // if Redis used

  await sendOtpEmail(email, otp);
  return otp;
};

export const verifyOtp = async (email, otpInput) => {
  const hashedInput = hashOtp(otpInput);
  const record = await OtpToken.findOne({ email, otpHash: hashedInput });

  if (!record) throw new Error("Invalid or expired OTP");

  record.verified = true;
  await record.save();
  return true;
};

export const resetPassword = async ({ email, password }) => {
  const verifiedOtp = await OtpToken.findOne({ email, verified: true });
  if (!verifiedOtp) throw new Error("OTP verification required");

  const response = await axios.put(process.env.AUTH_SERVICE_URL, {
    email,
    password,
  });

  await OtpToken.deleteMany({ email }); // Invalidate
  return response.data;
};
