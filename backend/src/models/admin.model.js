import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["Super Admin", "Admin", "Moderator"], // Add more roles if necessary
      default: "Admin",
    },
    permissions: {
        type: [String],
        enum: [
          "manageUsers", "manageOrders", "manageProducts", "manageCategories", "manageReviews", "viewAnalytics", "managePayments",
          // Add any other permissions your platform requires
        ],
        default: [],
      },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save middleware for hashing passwords
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Method to check account lock status
adminSchema.methods.isAccountLocked = function () {
  if (!this.accountLockedUntil) return false;
  return this.accountLockedUntil > Date.now();
};

export const Admin = mongoose.model("Admin", adminSchema);
