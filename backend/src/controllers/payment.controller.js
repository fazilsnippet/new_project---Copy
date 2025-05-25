import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import {User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.trim() , 
  key_secret: process.env.RAZORPAY_KEY_SECRET.trim()
});
// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {


    const { userId, items } = req.body;
    if (!userId || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(401, "userId and items are required!");
    }
    
    
    // Example: securely calculate amount on server
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });


    const amountInPaise = total * 100;

    const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,

      });
  
      const order = await Order.create({
        userId,
        products:[ items.map(item => ({ productId: item.productId, quantity: item.quantity }))],
        totalAmount: razorpayOrder.amount,
        razorpayOrderId: razorpayOrder.id,
        status: 'created',
      });
      console.log(order)
      await order.save()
  if (!order) { throw new ApiError( 404, " failed to create new order");  }

      await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
  
      res.status(201).json({
        razorpayOrderId: razorpayOrder.id,
        orderId: order._id,
        amount: amountInPaise,
        status: razorpayOrder.status,
      });
  
    } catch (err) {
      console.error("Error while creating the Razorpay order:", err);
      res.status(err.statusCode || 500).json({ 
        status: 'error',
        message: err.message || "Something went wrong while creating the order"
      });
          }
  };
// Verify and store payment
// export const verifyPayment = async (req, res) => {
//     try {
//       const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId } = req.body;
//       if (![razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId].every(Boolean)) {
//         throw new ApiError(400, "All payment credentials are required");
//       }
      
//       const  generatedSignature =  crypto
//         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//         .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//         .digest('hex');
  
//       if (generatedSignature !== razorpay_signature) {
//         return res.status(400).json({ message: 'Invalid signature' }, console.log("generatend signature and razorpay signature are not same"));
//       }
//       const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

//       const order = await Order.findById(orderId);
//       if (!order) throw new ApiError(404, "Order not found");
  
//       const payment = await Payment.create({
//         userId,
//         orderId,
//         razorpayOrderId: razorpay_order_id,
//         razorpayPaymentId: razorpay_payment_id,
//         razorpaySignature: razorpay_signature,
//         amount: order.totalAmount,
//         currency: paymentDetails.currency,
//         method: paymentDetails.method,
//         status: paymentDetails.status || 'captured',
//         paymentCapturedAt: paymentDetails.captured ? new Date(paymentDetails.captured * 1000) : undefined,
//         notes: paymentDetails.notes || {},
//       });
      
//       if (!payment) {
//         throw new ApiError(404, "failed to create payment")
//       }
//       console.log(payment)
//       await Order.findByIdAndUpdate(orderId, {
//         razorpayPaymentId: razorpay_payment_id,
//         status: 'paid'
//       });
//       await User.findByIdAndUpdate(userId, { $push: { payments: payment._id } });
  
//       res.json({ message: 'Payment verified', paymentId: payment._id });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
      
  export const verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId } = req.body;
      
      // if (![razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId].every(Boolean)) {
      //   throw new ApiError(400, "All payment credentials are required");
      // }
      if (!razorpay_order_id) {
        throw new ApiError(400, "razorpay_order_id is required");
      }
      if (!razorpay_payment_id) {
        throw new ApiError(400, "razorpay_payment_id is required");
      }
      if (!razorpay_signature) {
        throw new ApiError(400, "razorpay_signature is required");
      }
      if (!orderId) {
        throw new ApiError(400, "orderId is required");
      }
      if (!userId) {
        throw new ApiError(400, "userId is required");
      }
  
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET.trim())
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
  
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid signature' });
      }
  
      // ✅ Fetch full payment details from Razorpay
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
  
      const order = await Order.findById(orderId);
      if (!order) throw new ApiError(404, "Order not found");
  
      const payment = await Payment.create({
        userId,
        orderId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        status: paymentDetails.status || 'captured',
        method: paymentDetails.method || 'unknown',
        paymentCapturedAt: paymentDetails.captured ? new Date(paymentDetails.captured * 1000) : null,
        notes: paymentDetails.notes || {}
      });
  
      if (!payment) throw new ApiError(404, "Failed to create payment");
  
      await Order.findByIdAndUpdate(orderId, {
        razorpayPaymentId: razorpay_payment_id,
        status: 'paid'
      });
  
      await User.findByIdAndUpdate(userId, { $push: { payments: payment._id } });
  
      res.json({ message: 'Payment verified', paymentId: payment._id, status: payment.status });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  