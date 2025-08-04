

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },

    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },

    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String }, // e.g. card, netbanking, UPI, etc.

    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created'
    },

    paymentCapturedAt: { type: Date },
    refundedAt: { type: Date }, // Optional

    notes: { type: mongoose.Schema.Types.Mixed }, // Razorpay metadata
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);

