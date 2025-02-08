import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Cart must belong to a user"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: [true, "Cart item must reference a product"],
        },
        quantity: {
          type: Number,
          required: [true, "Cart item must have a quantity"],
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export const Cart = mongoose.model("Cart", cartSchema);
