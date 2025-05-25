import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
    enum: ['created', 'processing', 'captured', 'failed', 'refunded'],
    default: 'created'
  },
  paymentCapturedAt: { type: Date },
  notes: { type: mongoose.Schema.Types.Mixed }, // To store any extra Razorpay notes if needed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
