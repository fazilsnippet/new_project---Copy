

import express from 'express';
import cors from 'cors';  // For handling cross-origin requests
// import bodyParser from 'body-parser';  // To parse incoming request bodies
import cookieParser from 'cookie-parser';  // For handling cookies
import cartRouter  from './routes/cart.route.js';  // Importing cart routes
import categoryRouter from './routes/category.route.js';  // Importing category routes
import productRouter from './routes/product.route.js';  // Importing product routes
import wishlistRouter from './routes/wishlist.route.js';  // Importing wishlist routes
import userRouter from './routes/user.route.js';  // Importing user routes
import orderRouter from './routes/order.route.js';
import dotenv from 'dotenv';  // To handle environment variables
import adminRouter from './routes/admin.route.js';

dotenv.config();  // Load environment variables from .env file

// Initialize the Express app
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware to parse JSON bodies, cookies, and handle CORS
// app.use(cors({
//   origin: process.env.CORS_ORIGIN ,  // Set the origin of allowed requests
//   //credentials: true,  // Enable sending cookies with the response
// }));  // Enable cross-origin requests
app.use(express.static("public"))
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(cookieParser());  // Parse cookies attached to the request

// Use the imported routes
app.use('/api/categories', categoryRouter);  // Category routes
app.use('/api/cart', cartRouter);  // Cart routes
app.use('/api/wishlist', wishlistRouter);  // Wishlist routes
app.use('/api/products', productRouter);  // Product routes
app.use('/api/orders', orderRouter)
app.use('/api/users', userRouter);  // User routes
app.use('/api/admin', adminRouter)

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('Server is running');
});


export {app}