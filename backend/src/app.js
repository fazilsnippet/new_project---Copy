
import express from 'express';
import cors from 'cors';  // For handling cross-origin requests
import cookieParser from 'cookie-parser';  // For handling cookies
import cartRouter  from './routes/cart.route.js';  // Importing cart routes
import categoryRouter from './routes/category.route.js';  // Importing category routes
import productRouter from './routes/product.route.js';  // Importing product routes
import wishlistRouter from './routes/wishlist.route.js';  // Importing wishlist routes
import dotenv from 'dotenv';  // To handle environment variables
// import orderRouter from './routes/order.route.js';
import adminRouter from './routes/admin.route.js';
import paymentRouter from './routes/payment.route.js';
import userRouter from "./routes/user.route.js"
import { errorHandler } from './middleware/errorHandler.js';
dotenv.config();  // Load environment variables from .env file
// Initialize the Express app
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    credentials: true, // ✅ Allow cookies to be sent
  })
);

// Middleware to parse JSON bodies, cookies, and handle CORS
// app.use(cors({
//   origin: process.env.CORS_ORIGIN ,  // Set the origin of allowed requests
//   //credentials: true,  // Enable sending cookies with the response
// }));  // Enable cross-origin requests
app.use(express.json()); // Ensure JSON parsing is enabled
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());  // Parse cookies attached to the request
// Use the imported routes
app.use('/api/categories', categoryRouter);  // Category routes
app.use('/api/cart', cartRouter);  // Cart routes
app.use('/api/wishlist', wishlistRouter);  // Wishlist routes
app.use('/api/products', productRouter);  // Product routes
//   // User routes
app.use('/api/admin', adminRouter)
app.use('/api/payments', paymentRouter)
// app.use('/api/orders', orderRouter)
app.use('/api/users', userRouter);
// Health check route (optional)
app.get('/', (req, res) => {
  res.send('Server is running');
});


app.use(errorHandler)
export default app