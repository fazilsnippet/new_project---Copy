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

//with indexing, for fast retrieval 
/*import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Pre-save hook to calculate totalPrice automatically
cartSchema.pre("save", async function (next) {
  if (!this.isModified("items")) return next();

  const productIds = this.items.map(item => item.product);
  const products = await mongoose.model("Product").find({ _id: { $in: productIds } });

  this.totalPrice = this.items.reduce((total, item) => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  next();
});

export const Cart = mongoose.model("Cart", cartSchema);*/