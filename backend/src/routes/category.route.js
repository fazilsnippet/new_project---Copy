import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import {verifyJWT} from "../middleware/auth.middleware.js"; // Use 'verifyJWT' here

const categoryRouter = express.Router();

// Route to Create a New Category
categoryRouter.post('/',verifyJWT, createCategory);

// Route to Get All Categories with Hierarchy and Product Counts
categoryRouter.get('/',verifyJWT, getAllCategories);

// Route to Get a Single Category by ID with Subcategories and Products
categoryRouter.get('/:categoryId',verifyJWT, getCategoryById);

// Route to Update a Category by ID
categoryRouter.put('/:categoryId',verifyJWT, updateCategory);

// Route to Delete a Category by ID
categoryRouter.delete('/:categoryId',verifyJWT, deleteCategory);

export default categoryRouter