import express from 'express';
import {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admin.controller.js';
import { verifyJWT, admin } from '../middleware/auth.middleware.js'; // Add appropriate middleware

const adminRouter = express.Router();

// Route to create a new admin (restricted to Super Admin)
adminRouter.post('/admins', verifyJWT, admin(['Super Admin']), createAdmin);

// Route for admin login
adminRouter.post('/admins/login', loginAdmin);

// Route to get all admins (restricted to Super Admin)
adminRouter.get('/admins', verifyJWT, admin(['Super Admin']), getAllAdmins);

// Route to get a single admin by ID (restricted to Super Admin)
adminRouter.get('/admins/:adminId', verifyJWT, admin(['Super Admin']), getAdminById);

// Route to update admin details (restricted to Super Admin)
adminRouter.put('/admins/:adminId', verifyJWT, admin(['Super Admin']), updateAdmin);

// Route to delete an admin (restricted to Super Admin)
adminRouter.delete('/admins/:adminId', verifyJWT, admin(['Super Admin']), deleteAdmin);

export default adminRouter;
