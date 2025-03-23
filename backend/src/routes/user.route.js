import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
handlePasswordReset,
userProfile
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";  // Assuming you have an auth middleware to verify JWT token

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", registerUser);  // Register user
userRouter.post("/login", loginUser);  // Login user

// Protected Routes (Require JWT)
userRouter.post("/logout", verifyJWT, logoutUser);  // Logout user
userRouter.post("/refresh-token", refreshAccessToken);  // Refresh access token

userRouter.put("/change-password", verifyJWT, changeCurrentPassword);  // Change password
userRouter.put("/update-account", verifyJWT, updateAccountDetails);  // Update user account details
userRouter.get("/profile", verifyJWT, userProfile);  // Get user profile
// Reset Password (Through a token from forgot-password)
userRouter.post("/reset-password", handlePasswordReset);  // Reset password

// Route for verifying the OTP
export default userRouter;





