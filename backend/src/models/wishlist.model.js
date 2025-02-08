import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Wishlist must belong to a user"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: [true, "Wishlist item must reference a product"],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
