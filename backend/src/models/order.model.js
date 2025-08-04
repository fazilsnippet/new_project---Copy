import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

paymentMethod: {
  type: String,
  enum: ['UPI', 'CARD', 'NETBANKING', 'WALLET', 'COD', 'RAZORPAY'],
},
    status: {
      type: String,
      enum: ['created', 'attempted', 'paid', 'failed', 'cancelled'],
      default: 'created',
    },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    isDelivered: {
  type: Boolean,
  default: false
},
deliveredAt: {
  type: Date,
},
shippingAddress: {
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
},
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
