
import { verifyJWT } from '../middleware/auth.middleware.js';

import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/payment.controller.js';

const paymentRouter = express.Router();

paymentRouter.post('/razorpay/create', verifyJWT, createRazorpayOrder);

// Verify Razorpay payment
paymentRouter.post('/razorpay/verify', verifyJWT, verifyPayment);



export default paymentRouter;
