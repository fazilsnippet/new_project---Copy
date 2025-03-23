import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";

export const generateAccessTokenAndRefreshToken = async (userId) => {
  if (!userId) throw new Error("User ID is required to generate tokens");

  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};


  const registerUser = asyncHandler(async (req, res) => {
   
  
    const { fullName, email, userName, password ,phone} = req.body;
    
    if (
      [fullName, email, userName, password, phone].some((field) => field?.trim() === "")
    ) {
      
      throw new ApiError(400, "All fields are required");
    }
  
    
    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
  
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }
  
    const user = await User.create({
      fullName,
      email,
      password,
      userName,
      phone
    });
  
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    ); //remove password and refresh token field by select mithod from response which will store in Database.
  
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  });

  
  const loginUser = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;
  
    if (!userName && !email) {
      throw new ApiError(400, "Username or email is required");
    }
  
    const user = await User.findOne({ $or: [{ userName }, { email }] });
    if (!user) {
      throw new ApiError(404, "Username or email does not exist");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(409, "Invalid user password");
    }
  
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
  
    console.log(`Generated Tokens: AccessToken = ${accessToken}, RefreshToken = ${refreshToken}`);
  
    const loggedInUser = await User.findById(user._id).select("-refreshToken -password");
  
    const options = {
      httpOnly: true,
      secure: false , 
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  });
  

    const logoutUser = asyncHandler(async (req, res) => {
      await User.findOneAndUpdate(

        req.user._id,
        {
          $unset: { refreshToken: 1 },
        },
        { new: true }
      );
      const options = {
        httpOnly: true,
        secure: true,
      }; 
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"));
    });

    const refreshAccessToken = asyncHandler(async (req, res) => {
      const incomingRefreshToken =
       await req.cookies.refreshToken || req.body.refreshToken;
      if (!incomingRefreshToken) {
        throw new ApiError(402, "unauthorized request"); //refreshing the the access token
      }
      try {
        const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
        ); 
        const user = await User.findById(decodedToken?._id); 
        if (!user) {
          throw new ApiError(401, "invalid refershToken"),
          console.log("invalid refershToken");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, console.log(" refershToken expired or used")); 
        }
        const options = {
          httpOnly: true,
          secure: true,
        };
        const { accessToken, newRefreshtoken } =
          await generateAccessTokenAndRefreshToken(user._id); 
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", newRefreshtoken, options)
          .json(
            new ApiResponse(
              200,
              { accessToken: accessToken, refreshToken: newRefreshtoken },
              "accessToken refreshed..!"
            )
          );
      } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token" ,console.log("invalid refresh token"));
      }
    });

     

    const changeCurrentPassword = asyncHandler(async (req, res) => {
      const { oldPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user?._id); 
      const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); 
      if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
      }
    
      user.password = newPassword; 
      await user.save({ validateBeforeSave: false });
    
      return res
        .status(200)
        .json(new ApiResponse(200), {}, "password updated successfully");
    });

    const updateAccountDetails = asyncHandler(async (req, res) => {
      const { fullName, email } = req.body;
    
      if (!fullName || !email) {
        throw new ApiError(400, "all the fields are required");
      }
      const user = await User.findByIdAndUpdate(
        req.user?._id, //to get the user id we injected the auth middleware(verifyJWT) in route
        { $set: { fullName: fullName, email: email } },
    
        { new: true }
      ).select("-password"); //new data will be return
      return res
        .status(200)
        .json(new ApiResponse(200, user, "all the datails are updated"));
    });
    



 
const handlePasswordReset = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Step 2: Generate and send OTP if not already set
    if (!otp && !newPassword) {
      const generatedOtp = crypto.randomInt(100000, 999999).toString();

      // Save the OTP and expiration in the database
      user.passwordResetToken = generatedOtp;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      // Send OTP via email
      await transporter.sendMail({
        from: `"Support Team" <${process.env.SMTP_FROM}>`, // Sender address
        to: user.email, // Receiver address
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${generatedOtp}. This OTP is valid for 10 minutes.`,
        html: `<p>Your OTP for password reset is <b>${generatedOtp}</b>. This OTP is valid for <b>10 minutes</b>.</p>`,
      });

      return res.status(200).json({ message: "OTP sent to your email address." });
    }

    // Step 3: Verify OTP if provided
    if (otp && !newPassword) {
      if (
        user.passwordResetToken !== otp ||
        !user.passwordResetExpires ||
        Date.now() > user.passwordResetExpires
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      return res.status(200).json({ message: "OTP verified. You can now reset your password." });
    }

    // Step 4: Reset password if OTP is verified and new password is provided
    if (otp && newPassword) {
      if (
        user.passwordResetToken !== otp ||
        !user.passwordResetExpires ||
        Date.now() > user.passwordResetExpires
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      // Set the new password
      await user.setNewPassword(newPassword);

      // Clear OTP fields as the password reset is complete
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      return res.status(200).json({ message: "Password reset successfully." });
    }

    return res.status(400).json({ message: "Invalid request." });
  } catch (error) {
    console.error("Error in handling password reset:", error);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
})

const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userProfile = {
    fullName: user?.fullName,
    email: user?.email,
    userName: user?.userName,
    profilePicture: user?.profilePicture,
    location: user?.location,
    phone: user?.phone,
  };

  return res.status(200).json(new ApiResponse(200, userProfile, "User profile fetched successfully"));
})
  export {
    registerUser,
    loginUser,
    userProfile,
logoutUser,
refreshAccessToken,
changeCurrentPassword,
updateAccountDetails,
handlePasswordReset
  }