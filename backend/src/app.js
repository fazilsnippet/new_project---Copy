
import express from 'express';
import cors from 'cors';  
import cookieParser from 'cookie-parser';  
import cartRouter  from './routes/cart.route.js';  
import categoryRouter from './routes/category.route.js';  
import productRouter from './routes/product.route.js';  
import wishlistRouter from './routes/wishlist.route.js';  
import dotenv from 'dotenv'; 
import adminRouter from './routes/admin.route.js';
import paymentRouter from './routes/payment.route.js';
import userRouter from "./routes/user.route.js"
import { errorHandler } from './middleware/errorHandler.js';
import  client from 'prom-client'
import axios from "axios"
import webhookRouter from './routes/razorpayWebhook.js';
import reviewRouter from './routes/review.route.js';
import orderRouter from './routes/order.route.js';
import brandRouter from './routes/brand.route.js';
import otpRouter from './routes/otp.route.js';
dotenv.config(); 

const app = express();
app.use(express.json()); 
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// 🔧 Fix: Correct route path for Prometheus metrics
app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.post("/api/analyze-review", async (req, res) => {
  try {
    const { text } = req.body;
    
    const response = await axios.post("http://localhost:8000/review-analysis", 
      {
      text,
    });
    
    res.json({ result: response.data.analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI service failed", details: err.message });
  }
});

// Node.js calling Python microservice
// Node.js calling Python microservice
async function searchProducts(text) {
  const res = await axios.post("http://127.0.0.1:8000/search", { text });
  return res.data;
}

app.post("/api/search", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await searchProducts(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

// app.use('/api/webhook', express.raw({ type: 'application/json' }));

// app.use('/api/webhooks', webhookRouter);


app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());  
app.use('/api/categories', categoryRouter);  
app.use('/api/cart', cartRouter); 
app.use('/api/wishlist', wishlistRouter);  
app.use('/api/products', productRouter);  
app.use('/api/reviews', reviewRouter);
app.use('/api/admin', adminRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/users', userRouter);
app.use('/api/orders' , orderRouter)
app.use("/api/brand", brandRouter)
app.use("/api/otp", otpRouter)

app.get('/', (req, res) => {
  res.send('Server is running');
});


app.use(errorHandler)
export default app