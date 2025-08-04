import express from "express"
import { sendForgotPasswordOtp, sendSignupOtp, verifySignupOtp, resetPassword, sendUpdatePasswordOtp, updatePasswordAfterLogin} from "../controllers/otp.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const otpRouter = express.Router()
otpRouter.post("/signup/sendotp", sendSignupOtp);
otpRouter.post("/signup/verifyotp", verifySignupOtp);

otpRouter.post("/forgot/sendotp", sendForgotPasswordOtp);
otpRouter.post("/forgot/resetpassword", resetPassword);

otpRouter.post("/update/sendotp", verifyJWT, sendUpdatePasswordOtp);
otpRouter.post("/update/password", verifyJWT, updatePasswordAfterLogin);

export default otpRouter