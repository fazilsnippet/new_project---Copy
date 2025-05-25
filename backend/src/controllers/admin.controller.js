import { Admin } from '../models/admin.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Securely generate JWT tokens
const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, role: admin.role, permissions: admin.permissions }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Create a new admin (Only Super Admin can create admins)
const createAdmin = asyncHandler(async (req, res) => {
  if (req.user.role !== "Super Admin") {
    return res.status(403).json({ message: 'Access denied. Only Super Admins can create new admins.' });
  }

  const { name, email, password, role, permissions } = req.body;

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const newAdmin = new Admin({
    name,
    email,
    password, // No need to hash, it's handled in the model
    role,
    permissions,
  });

  await newAdmin.save();
  res.status(201).json({ message: 'Admin created successfully' });
});

// Authenticate admin & return JWT token
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check if the account is locked
  if (admin.isAccountLocked()) {
    return res.status(403).json({ message: 'Account is locked. Try again later.' });
  }

  // Verify password
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    admin.failedLoginAttempts += 1;

    // Lock account if too many failed attempts
    if (admin.failedLoginAttempts >= 5) {
      admin.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
    }
    await admin.save();
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Reset failed login attempts & update last login
  admin.failedLoginAttempts = 0;
  admin.accountLockedUntil = null;
  admin.lastLogin = Date.now();
  await admin.save();

  // Generate token
  const token = generateToken(admin);

  // Set token in HttpOnly Cookie (secure way)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure only in production
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.status(200).json({ message: 'Login successful' });
});

// Get all admins (Only Super Admin can view all admins)
const getAllAdmins = asyncHandler(async (req, res) => {
  if (req.user.role !== "Super Admin") {
    return res.status(403).json({ message: 'Access denied' });
  }

  const admins = await Admin.find({}, '-password'); // Exclude passwords
  res.status(200).json(admins);
});

// Get a single admin by ID (Only Super Admin or self)
const getAdminById = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  if (req.user.role !== "Super Admin" && req.user.id !== adminId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const admin = await Admin.findById(adminId, '-password');
  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  res.status(200).json(admin);
});

// Update admin details (Only Super Admin or self)
const updateAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  let updates = req.body;

  if (req.user.role !== "Super Admin" && req.user.id !== adminId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Ensure password is hashed if updated
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, { new: true, select: '-password' });
  if (!updatedAdmin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  res.status(200).json(updatedAdmin);
});

// Soft delete an admin (Only Super Admin can deactivate admins)
const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  if (req.user.role !== "Super Admin") {
    return res.status(403).json({ message: 'Access denied' });
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  // Instead of permanent delete, mark admin as inactive
  admin.isActive = false;
  await admin.save();

  res.status(200).json({ message: 'Admin deactivated successfully' });
});

export {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};



