

import express from "express";
import {
  getAllCategories,
  getCategoryById,

} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; // JWT authentication middleware

const categoryRouter = express.Router();


categoryRouter.get("/", getAllCategories); 

categoryRouter.get("/:categoryId", getCategoryById); 



export default categoryRouter;
