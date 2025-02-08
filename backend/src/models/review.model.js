import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Review must be associated with a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: [true, "Review must be associated with a product"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false, // Set to true if the review comes from a verified order
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
