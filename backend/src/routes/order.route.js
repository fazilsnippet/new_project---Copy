import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';  // Authentication middleware

const orderRouter = express.Router();

// Route to create a new order
orderRouter.post('/', verifyJWT, createOrder);  // Protect middleware to ensure user is authenticated

// Route to get all orders for a user
orderRouter.get('/:userId', verifyJWT, getAllOrders);

// Route to get a single order by its ID
orderRouter.get('/:orderId', verifyJWT, getOrderById);

// Route to update the order status (for example, after payment completion)
orderRouter.put('/:orderId/status', verifyJWT, updateOrderStatus);

// Route to delete an order (if needed, e.g., after payment or cancellation)
orderRouter.delete('/:orderId', verifyJWT, deleteOrder);

export default orderRouter;

