import express from "express";
import {
registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,
updateAccountDetails,userProfile,updateUserAddress, addRecentlyViewedProduct,
  getRecentlyViewedProducts,sendSignupOtp,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";  // Assuming you have an auth middleware to verify JWT token
import { getAllUsers } from "../controllers/admin.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", upload.single("avatar") , registerUser);  // Register user
userRouter.post("/login", loginUser);  // Login user
userRouter.post("/register/sendotp", sendSignupOtp);

// Protected Routes (Require JWT)
userRouter.post("/logout", verifyJWT, logoutUser);  // Logout user
userRouter.post("/refreshtoken", refreshAccessToken);  // Refresh access token

userRouter.put("/changepassword", verifyJWT, changeCurrentPassword);  // Change password
userRouter.put("/updateaccount", verifyJWT, upload.single("avatar"), updateAccountDetails);  // Update user account details
userRouter.get("/profile", verifyJWT, userProfile);  // Get user profile
userRouter.get("/all", getAllUsers);
userRouter.put("/updateaddress", verifyJWT, updateUserAddress);  // Update user address
userRouter.post("/products/:productId/addrecentlyviewedproduct", verifyJWT, addRecentlyViewedProduct); 
userRouter.get("/recentlyviewedproducts", verifyJWT, getRecentlyViewedProducts);  // Get recently viewed products

// Add recently viewed product
// Reset Password (Through a token from forgot-password)
// userRouter.post("/reset-password", handlePasswordReset);  // Reset password

// Route for verifying the OTP
export default userRouter;






