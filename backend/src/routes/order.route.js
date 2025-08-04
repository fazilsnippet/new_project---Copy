
import { getMyOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
  deleteOrder,} from "../controllers/order.controller.js"

  import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"; // Assuming you have

const orderRouter = express.Router();

orderRouter.post("/create", verifyJWT, createOrder);
orderRouter.get("/getorder/:orderId", verifyJWT, getOrderById)
orderRouter.get("/getmyorders" , verifyJWT, getMyOrders);
orderRouter.delete("/delete" , verifyJWT , deleteOrder);

export default orderRouter