// controllers/payment.controller.js

import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import Payment from '../models/payment.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.trim(),
  key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
});

// 1. CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId) throw new ApiError(401, 'userId required! please login');
    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Items array is required and cannot be empty');
    }

    let total = 0;
    let productRecords = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      total += product.price * item.quantity;
      productRecords.push({ productId: product._id, quantity: item.quantity });
    }

    const amountInPaise = total * 100;

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      userId,
      products: productRecords,
      totalAmount: amountInPaise,
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
    });

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.status(201).json({
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      amount: amountInPaise,
      status: razorpayOrder.status,
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message || 'Something went wrong while creating the order',
    });
  }
};

// 2. VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId || !userId) {
      throw new ApiError(400, 'Missing required fields for payment verification');
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET.trim())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, 'Order not found');

    order.status = 'attempted';
    await order.save();

    if (expectedSignature !== razorpay_signature) {
      order.status = 'failed';
      await order.save();
      throw new ApiError(400, 'Invalid Razorpay signature');
    }

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    const payment = await Payment.create({
      userId,
      orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      status: paymentDetails.status,
      method: paymentDetails.method,
      paymentCapturedAt: new Date(paymentDetails.created_at * 1000),
      notes: paymentDetails.notes || {},
    });

    order.status = paymentDetails.status === 'captured' ? 'paid' : 'failed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentMethod = paymentDetails.method?.toUpperCase() || 'RAZORPAY';
    await order.save();

    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ Clear cart and save payment
    await User.findByIdAndUpdate(userId, {
      $push: { payments: payment._id },
      $set: { 'cart.items': [], 'cart.totalPrice': 0 }, // ✅ clear cart after success
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: payment._id,
      status: payment.status,
    });
  } catch (err) {
    console.error('Payment verification failed:', err.message);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Error verifying Razorpay payment',
    });
  }
};



export const razorpayWebhookHandler = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  if (event === 'payment.captured') {
    const razorpayOrderId = req.body.payload.payment.entity.order_id;

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'paid';
    await order.save();

    await User.findByIdAndUpdate(order.userId, {
      $set: { 'cart.items': [], 'cart.totalPrice': 0 }
    });

    return res.status(200).json({ message: 'Payment captured and cart cleared' });
  }

  res.status(200).json({ message: 'Webhook received but not handled' });
};
