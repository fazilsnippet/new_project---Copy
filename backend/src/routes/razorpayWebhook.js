import express from 'express';
import { razorpayWebhookHandler } from '../controllers/payment.controller.js';

const webhookRouter = express.Router();
webhookRouter.post('/', razorpayWebhookHandler);

export default webhookRouter;

