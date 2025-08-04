import nodemailer from "nodemailer";
import { renderFile } from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  const html = await renderFile(path.join(__dirname, "../views/otpEmail.ejs"), {
    otp,
    expiresIn: process.env.OTP_EXPIRY_MINUTES || 10,
  });

  return transporter.sendMail({
    from: `"Password Reset" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Password Reset",
    html,
  });
};
