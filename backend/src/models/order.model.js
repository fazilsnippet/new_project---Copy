// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to the User model
//       required: [true, "Order must be associated with a user"],
//     },
//     orderItems: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product", // Reference to the Product model
//           required: [true, "Order item must reference a product"],
//         },
//         quantity: {
//           type: Number,
//           required: [true, "Order item must have a quantity"],
//           min: [1, "Quantity must be at least 1"],
//         },
//         price: {
//           type: Number,
//           required: [true, "Order item must have a price"],
//           min: [0, "Price cannot be negative"],
//         },
//       },
//     ],
//     shippingAddress: {
//       address: { type: String, required: [true, "Shipping address is required"] },
//       city: { type: String, required: [true, "City is required"] },
//       postalCode: { type: String, required: [true, "Postal code is required"] },
//       country: { type: String, required: [true, "Country is required"] },
//     },
//     paymentMethod: {
//       type: String,
//       required: [true, "Payment method is required"],
//       enum: ["Credit Card", "PayPal", "Cash on Delivery"], // Add methods as needed
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Completed", "Failed"],
//       default: "Pending",
//     },
//     shippingStatus: {
//       type: String,
//       enum: ["Not Shipped", "Shipped", "Delivered"],
//       default: "Not Shipped",
//     },
//     totalPrice: {
//       type: Number,
//       required: [true, "Total price is required"],
//       min: [0, "Total price cannot be negative"],
//     },
//     isPaid: {
//       type: Boolean,
//       default: false,
//     },
//     paidAt: {
//       type: Date,
//     },
//     isDelivered: {
//       type: Boolean,
//       default: false,
//     },
//     deliveredAt: {
//       type: Date,
//     },
//   },
//   { timestamps: true } // Automatically manages createdAt and updatedAt
// );

// export const Order = mongoose.model("Order", orderSchema);

//2nd
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'], 
    default: 'Pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  shippingAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for fast querying
orderSchema.index({ userId: 1, orderStatus: 1 });

export const Order = mongoose.model('Order', orderSchema);

// Example aggregation pipeline
Order.aggregate([
  { $unwind: "$products" },
  { $lookup: { from: 'products', localField: 'products.productId', foreignField: '_id', as: 'productDetails' } },
  { $unwind: "$productDetails" },
  { $group: {
    _id: "$_id",
    totalPrice: { 
      $sum: { 
        $multiply: [
          { $ifNull: ["$products.quantity", 0] }, 
          { $ifNull: ["$products.price", 0] }
        ] 
      }
    }
  }}
]);



