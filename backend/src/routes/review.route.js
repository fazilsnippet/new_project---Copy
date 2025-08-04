import { verifyJWT } from '../middleware/auth.middleware.js';
import {getReviews,createReview, getAllReviews, deleteReview,updateReview} from "../controllers/review.controller.js";
import express from "express";


const reviewRouter = express.Router()

reviewRouter.post("/create/:productId", verifyJWT, createReview);

reviewRouter.get("/all", getAllReviews);  

reviewRouter.get("/:productId", getReviews);
reviewRouter.put("/update/:reviewId", verifyJWT, updateReview);
reviewRouter.delete("/delete/:reviewId", verifyJWT, deleteReview);

export default reviewRouter