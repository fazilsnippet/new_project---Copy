import crypto from "crypto";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
