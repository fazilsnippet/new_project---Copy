import express from 'express';
import { getAdvancedWishlist, removeProductFromWishlist, addProductToWishlist} from '../controllers/wishlist.controller.js';
import {verifyJWT} from "../middleware/auth.middleware.js"; // Use 'verifyJWT' here

const wishlistRouter = express.Router();

// Route to get advanced wishlist with pagination
wishlistRouter.get('/', verifyJWT, getAdvancedWishlist);
wishlistRouter.post('/', verifyJWT, addProductToWishlist)
// Route to remove a product from the wishlist
wishlistRouter.delete('/:productId', verifyJWT, removeProductFromWishlist);

export default wishlistRouter;
