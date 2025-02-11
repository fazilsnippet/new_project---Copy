import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
const generateAccessTokenAndRefreshToken = async (userid) => {
    try {
      const user = await User.findById(userid);
      const accessToken = await user.generateAccessToken(); //
      const refreshToken = await user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Error... generating access and refresh token");
    }
  };

  const registerUser = asyncHandler(async (req, res) => {
   
  
    const { fullName, email, userName, password } = req.body;
    
    if (
      [fullName, email, userName, password].some((field) => field?.trim() === "")
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
    // req body -> data
    //username or email check for login
    //find the user
    //password check
    //generate the access token and refresh token
    //send the token through cookies
    //send the response "login success"
    const { email, userName, password } = req.body; //requsting data fot login user
    if (!userName && !email) {
      //if(!(userName || email))
      throw new ApiError(400, "username or email is required");
    }
    const user = await User.findOne({
      // while login user must give email and password or username and password by using $or operator and find in the database
      $or: [{ userName }, { email }],
    });
    if (!user) {
      // if there is no username or email matches, throw an error
      throw new ApiError(404, "username or email does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password); //checking the entered password with existing password in the database.
    if (!isPasswordValid) {
      throw new ApiError(409, "invalid user password");
    }
  
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user?._id); //this method is expects a parameter -which is user._id. this method creates access and refresh tokens.
    // console.log(`acesstoken:${accessToken}, refreshtoken: ${refreshToken}`)
    const loggedInUser = await User.findById(user._id).select(
      "-refreshToken -password"
    ); //optional
  
    const options = {
      httpOnly: true,
      secure: true,
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
          "user logged in successfully"
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
      // const options = {
      //   httpOnly: true,
      //   secure: true,
      // }; 
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"));
    });

    const refreshAccessToken = asyncHandler(async (req, res) => {
      const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
      if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request"); //refreshing the the access token
      }
      try {
        const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
        ); 
        const user = await User.findById(decodedToken?._id); 
        if (!user) {
          throw new ApiError(401, "invalid refershToken");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, " refershToken expired or used"); 
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
        throw new ApiError(401, error?.message || "invalid refresh token");
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
    

// //FIRST ATTEMPT FAILED
// // Forgot Password Controller
// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate password reset token
//     const resetToken = user.generatePasswordResetToken();
//     await user.save();

//     const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

//     // Configure the transporter for sending email
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });

//     // Send the password reset email
//     await transporter.sendMail({
//       to: user.email,
//       subject: "Password Reset Request",
//       text: `You requested to reset your password. Please click the link to proceed: ${resetLink}`,
//     });

//     res.status(200).json({ message: "Password reset email sent" });
//   } catch (error) {
//     console.error("Error in forgotPassword:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Reset Password Controller
//  const resetPassword = asyncHandler(async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     // Decode and validate the token
//     const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET || "reset_secret");

//     // Find the user using the decoded token data
//     const user = await User.findOne({
//       _id: decoded._id,
//       passwordResetToken: token,
//       passwordResetExpires: { $gt: Date.now() }, // Ensure token is not expired
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     // Set the new password and clear the reset token
//     user.setNewPassword(newPassword);
//     await user.save();

//     res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error("Error in resetPassword:", error);
//     res.status(400).json({ message: "Invalid or expired token" });
//   }
// });


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASSWORD, // SMTP password
  },
});

/**
 * Unified Password Reset Handler
 */
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



  export {
    registerUser,
    loginUser,
logoutUser,
refreshAccessToken,
changeCurrentPassword,
updateAccountDetails,
handlePasswordReset
  }