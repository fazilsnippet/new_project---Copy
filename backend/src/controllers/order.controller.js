import mongoose from 'mongoose';
import {asyncHandler} from "../utils/asyncHandler.js"
import {Order} from '../models/order.model.js'
// Controller for Orders

  /**
   * Create a new order
   */
  const createOrder = asyncHandler(async (req, res) => {
    try {
      const { userId, products, shippingAddress } = req.body;

      // Calculate totalPrice
      const totalPrice = products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );

      const newOrder = new Order({
        userId,
        products,
        totalPrice,
        shippingAddress,
      });

      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  )
  /**
   * Get orders by userId with details
   */
  const getUserOrders= asyncHandler(async (req, res) => {
    try {
      const userId = req.params?.userId;

      const orders = await Order.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $unwind: "$products" },
        {
          $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: "$productDetails" },
        {
          $group: {
            _id: "$_id",
            userId: { $first: "$userId" },
            shippingAddress: { $first: "$shippingAddress" },
            paymentStatus: { $first: "$paymentStatus" },
            orderStatus: { $first: "$orderStatus" },
            createdAt: { $first: "$createdAt" },
            products: {
              $push: {
                productId: "$products.productId",
                quantity: "$products.quantity",
                price: "$products.price",
                productDetails: "$productDetails",
              },
            },
            totalPrice: { $first: "$totalPrice" },
          },
        },
        { $sort: { createdAt: -1 } }, // Sort orders by latest
      ]);

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },)

  /**
   * Update order status
   */
  const updateOrderStatus=asyncHandler( async (req, res) => {
    try {
      const { orderId } = req.params;
      const { orderStatus, paymentStatus } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          ...(orderStatus && { orderStatus }),
          ...(paymentStatus && { paymentStatus }),
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },)

  /**
   * Get summary of orders (e.g., for analytics)
   */
  const getOrderSummary=asyncHandler( async (req, res) => {
    try {
      const summary = await Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            totalOrders: { $count: {} },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { totalRevenue: -1 } },
      ]);

      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },)

  /**
   * Delete an order
   */
  const deleteOrder=asyncHandler( async (req, res) => {
    try {
      const { orderId } = req.params;

      const deletedOrder = await Order.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
)

export{
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderSummary,
  deleteOrder,

}