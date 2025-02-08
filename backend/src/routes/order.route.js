import express from 'express';
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderSummary,
  deleteOrder,
} from '../controllers/order.controller.js';
import { verifyJWT, admin } from '../middleware/auth.middleware.js'; // Import authentication and authorization middleware

const orderRouter = express.Router();

// Create a new order (protected route)
orderRouter.post('/orders', verifyJWT, createOrder);

// Get all orders for a specific user (protected route)
orderRouter.get('/orders/user/:userId', verifyJWT, getUserOrders);

// Update order status (protected route)
orderRouter.put('/orders/:orderId', verifyJWT, admin, updateOrderStatus);

// Get summary of all orders (e.g., for analytics) (admin route)
orderRouter.get('/orders/summary', verifyJWT, admin, getOrderSummary);

// Delete an order (protected route, admin)
orderRouter.delete('/orders/:orderId', verifyJWT, admin, deleteOrder);

export default orderRouter
