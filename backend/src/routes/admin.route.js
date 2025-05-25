import express from 'express';
import {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admin.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js'; // Add appropriate middleware

const adminRouter = express.Router();

// Route to create a new admin (restricted to Super Admin)
adminRouter.post('/admins', verifyJWT,  createAdmin);

// Route for admin login
adminRouter.post('/admins/login', loginAdmin);

// Route to get all admins (restricted to Super Admin)
adminRouter.get('/admins', verifyJWT, getAllAdmins);

// Route to get a single admin by ID (restricted to Super Admin)
adminRouter.get('/admins/:adminId', verifyJWT,  getAdminById);

// Route to update admin details (restricted to Super Admin)
adminRouter.put('/admins/:adminId', verifyJWT,  updateAdmin);

// Route to delete an admin (restricted to Super Admin)
adminRouter.delete('/admins/:adminId', verifyJWT,  deleteAdmin);

export default adminRouter;
