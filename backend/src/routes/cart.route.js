import express from "express";
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cart.controller.js"; // Import controller functions
import { verifyJWT } from "../middleware/auth.middleware.js"; // Assuming you have a middleware to protect routes

const cartRouter = express.Router();

// Route to add an item to the cart
cartRouter.post("/add", verifyJWT, addToCart);

// Route to get the cart for the logged-in user
cartRouter.get("/", verifyJWT, getCart);

// Route to update the quantity of an item in the cart
cartRouter.put("/update", verifyJWT, updateCartItem);

// Route to remove an item from the cart
cartRouter.delete("/remove", verifyJWT, removeCartItem);

// Route to clear the cart
cartRouter.delete("/clear", verifyJWT, clearCart);

export default cartRouter;