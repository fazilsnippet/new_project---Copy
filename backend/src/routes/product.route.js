import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { 
  // createProduct, 
  getAllProducts, 
  getProductById, 
  // addReview ,
  handleVisualSearch,
  handleSemanticSearch,
  handleVoiceSearch,
  getProducts,
  getTopSellingProducts,
  getRecentProducts,
  getRelatedProducts,

} from '../controllers/product.controller.js';

const productRouter = express.Router();
//use verifyJWT middleware for required routes in this router
// productRouter.post("/", upload.array('images', 5), createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/products", getProducts);
productRouter.get("/recent" , getRecentProducts)
productRouter.get("/top-sellings", getTopSellingProducts); 
productRouter.get("/related/:productId", getRelatedProducts);

// ?range=allTime
// productRouter.get("/top-sellings/7days", (req, res, next) => {
//   req.query.range = "last7days";
//   getTopSellingProducts(req, res, next);
// });
// productRouter.get("/top-sellings/30days", (req, res, next) => {
//   req.query.range = "last30days";
//   getTopSellingProducts(req, res, next);
// });
productRouter.post('/search/semantic', handleSemanticSearch);                     // text -> body
productRouter.post('/search/visual', upload.single('image'), handleVisualSearch); // file -> form-data key: image
productRouter.post('/search/voice', upload.single('audio'), handleVoiceSearch); 
productRouter.get("/:productId", getProductById)


export default productRouter;
