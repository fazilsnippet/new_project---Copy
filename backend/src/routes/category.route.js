

import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; // JWT authentication middleware
import { upload } from "../middlewares/multer.js"; // Import multer middleware

const categoryRouter = express.Router();

categoryRouter.post("/", verifyJWT, upload.array("images", 5), createCategory);

categoryRouter.get("/", getAllCategories); 

categoryRouter.get("/:categoryId", getCategoryById); 

categoryRouter.put("/:categoryId", verifyJWT, upload.array("images", 5), updateCategory);

categoryRouter.delete("/:categoryId", verifyJWT, deleteCategory);

export default categoryRouter;
