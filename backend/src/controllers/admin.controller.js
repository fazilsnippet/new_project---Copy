import { Admin } from '../models/admin.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Create a new admin
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  // Check if the admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  // Create new admin
  const newAdmin = new Admin({
    name,
    email,
    password,
    role,
    permissions,
  });

  const savedAdmin = await newAdmin.save();
  res.status(201).json(savedAdmin);
});

// Authenticate an admin and return a token
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
});

// Get all admins
const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({});
  res.status(200).json(admins);
});

// Get a single admin by ID
const getAdminById = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const admin = await Admin.findById(adminId);

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  res.status(200).json(admin);
});

// Update admin details
const updateAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const updates = req.body;

  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, {
    new: true,
  });

  if (!updatedAdmin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  res.status(200).json(updatedAdmin);
});

// Delete an admin
const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const deletedAdmin = await Admin.findByIdAndDelete(adminId);

  if (!deletedAdmin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  res.status(200).json({ message: 'Admin deleted successfully' });
});

export {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
