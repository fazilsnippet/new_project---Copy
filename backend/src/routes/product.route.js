import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import {verifyJWT} from "../middleware/auth.middleware.js"; // Use 'verifyJWT' here
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  addReview 
} from '../controllers/product.controller.js';

const productRouter = express.Router();

// Route to create a new product (protected route)
productRouter.post("/",upload.array('images', 5), verifyJWT, createProduct);

// Route to get all products (public route, but can be restricted later)
productRouter.get("/", getAllProducts);

// Route to get a single product by ID
productRouter.get("/:productId", getProductById);

// Route to update a product by ID (protected route)
productRouter.put("/:productId", verifyJWT, updateProduct);

// Route to delete a product by ID (protected route)
productRouter.delete("/:productId", verifyJWT, deleteProduct);

// Route to add a review to a product (protected route)
productRouter.post("/:productId/review", verifyJWT, addReview);

export default productRouter;