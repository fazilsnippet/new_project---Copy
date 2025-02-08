import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Payment must be linked to a user"],
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
      required: [true, "Payment must be linked to an order"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["Credit Card", "PayPal", "Cash on Delivery"], // Add methods as needed
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    transactionId: {
      type: String,
      unique: true,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
