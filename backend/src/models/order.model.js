import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ productId: String, quantity: Number }],
  totalAmount: Number,
  status: { 
    type: String, 
    enum: ['created', 'attempted', 'paid'], // Define allowed values
    default: 'created' 
  },  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
