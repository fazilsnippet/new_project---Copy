import express from 'express';
import { getAdvancedWishlist, removeProductFromWishlist } from '../controllers/wishlist.controller.js';
import {verifyJWT} from "../middleware/auth.middleware.js"; // Use 'verifyJWT' here

const wishlistRouter = express.Router();

// Route to get advanced wishlist with pagination
wishlistRouter.get('/wishlist/advanced', verifyJWT, getAdvancedWishlist);

// Route to remove a product from the wishlist
wishlistRouter.delete('/wishlist/:productId', verifyJWT, removeProductFromWishlist);

export default wishlistRouter;
