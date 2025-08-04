import Order from "../models/order.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";

import Razorpay from 'razorpay';
import { User } from '../models/user.model.js';
import {Product} from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.trim(),
  key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
});

 const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(items)) {
      throw new ApiError(400, "Items should be an array");
    }

    if (items.length === 0) {
      throw new ApiError(400, "Items array cannot be empty");
    }

    if (!paymentMethod || !["cod", "razorpay", "upi"].includes(paymentMethod.toLowerCase())) {
      throw new ApiError(400, 'Invalid payment method. Use "cod", "razorpay", or "upi"');
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const address = user.address || {};
    const phone = address.phone || "";

    const requiredFields = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country,
      phone,
    ];

    if (requiredFields.some((f) => !f || typeof f !== "string" || !f.trim())) {
      throw new ApiError(400, "User address and phone must be complete to place order");
    }

    const productRecords = [];
    let total = 0;

    for (const item of items) {
      if (!item.quantity || typeof item.quantity !== "number") {
        throw new ApiError(400, `Invalid quantity for product: ${item.productId}`);
      }

      const product = await Product.findById(item.productId);
      if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      total += product.price * item.quantity;
      productRecords.push({ productId: product._id, quantity: item.quantity });
    }

    const shippingAddress = {
      fullName: user.fullName,
      phone: phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };

    const amountInPaise = total * 100;
    const normalizedMethod = paymentMethod.toLowerCase();

    if (normalizedMethod === "cod") {
      const order = await Order.create({
        userId,
        products: productRecords,
        totalAmount: amountInPaise,
        paymentMethod: "COD",
        status: "attempted",
        shippingAddress,
      });

      await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

      return res.status(201).json({
        message: "COD order placed successfully",
        orderId: order._id,
        status: order.status,
      }).console.log(res);
    }

    // Razorpay / UPI flow
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      userId,
      products: productRecords,
      totalAmount: amountInPaise,
      razorpayOrderId: razorpayOrder.id,
      paymentMethod: normalizedMethod.toUpperCase(), // UPI or RAZORPAY
      status: "created",
      shippingAddress,
    });

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    return res.status(201).json({
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      amount: amountInPaise,
      status: razorpayOrder.status,
    });
  } catch (err) {
    console.error("Order creation failed:", err.message);
    res.status(err.statusCode || 500).json({
      message: err.message || "Error creating order",
    });
  }
};





 const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .populate('products.productId', 'name price images') // optional
    .exec();

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});


// @desc    Get single order by ID (Admin or Owner)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'name email').populate('products.product', 'name price');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
    res.json({ data: order });
  } else {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }
});


// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  res.json({ message: 'Order status updated', order });
});

// @desc    Delete an order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  await order.deleteOne();
  res.json({ message: 'Order deleted' });
});




export  {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
}
