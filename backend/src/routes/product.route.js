import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  addReview 
} from '../controllers/product.controller.js';

const productRouter = express.Router();

productRouter.post("/", upload.array('images', 5), verifyJWT, createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:productId", getProductById)
productRouter.put("/:productId", verifyJWT, updateProduct);
productRouter.delete("/:productId", verifyJWT, deleteProduct);
productRouter.post("/:productId/review", verifyJWT, addReview);

export default productRouter;
