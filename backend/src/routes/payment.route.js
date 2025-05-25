
import { verifyJWT } from '../middleware/auth.middleware.js';
import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/payment.controller.js';

const paymentRouter = express.Router();
// paymentRouter.use(verifyJWT)
paymentRouter.post('/create-order', createRazorpayOrder);
paymentRouter.post('/verify', verifyPayment);

export default paymentRouter;
