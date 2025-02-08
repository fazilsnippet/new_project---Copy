import mongoose from "mongoose"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    phone: {
      type: String,
      required: false,
      match: [/^\+?[0-9]{10,15}$/, "Please provide a valid phone number"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically includes `createdAt` and `updatedAt`
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with stored password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h", // Default to 1 hour
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d", // Default to 7 days
    }
  );
};

// Generate Password Reset Token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = jwt.sign(
    { _id: this._id },
    process.env.RESET_TOKEN_SECRET || "reset_secret",
    { expiresIn: "1h" }
  );

  // Save the token and expiration time in the database
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 3600 * 1000; // 1 hour in milliseconds

  return resetToken;
};

// Set New Password (called after token verification)
userSchema.methods.setNewPassword = async function (newPassword) {
  this.password = await bcrypt.hash(newPassword, 10); // Hash the new password
  this.passwordResetToken = null; // Clear the reset token
  this.passwordResetExpires = null; // Clear expiration
  await this.save();
};

// Create and export the User model
export const User = mongoose.model("User", userSchema);

